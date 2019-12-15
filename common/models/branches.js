var Promise = require("bluebird");
const app = require("../../server/server");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const downloadPath = path.join(__dirname, "../../server/storage");
    cb(null, downloadPath + "/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  }
});

async function getMultipartData(req, res) {
  var upload = multer({ storage }).single("file");
  return new Promise((resolve, reject) => {
    upload(req, res, function (err) {
      if (err) return reject(err);
      const data = req.body || {};
      if (req.file) {
        try {
          data.fileContents = JSON.parse(
            fs.readFileSync(req.file.path, { encoding: "utf8" })
          );
        } catch (e) {
          return reject(e);
        }
      }
      return resolve(data);
    });
  })
}


module.exports = function (Branches) {
  Branches.disableRemoteMethod("create", true);

  Branches.remoteMethod("createBranch", {
    description: "Create a branch",
    accepts: [
      {
        arg: "data",
        type: "object",
        http: { source: "body" },
        required: true,
        description: "name, description, from_branch (branch id)"
      }
    ],
    returns: { arg: "branch", type: "object", root: true },
    http: { path: "/", verb: "post", errorStatus: 400 }
  });

  Branches.remoteMethod("getCollections", {
    accepts: [
      { arg: "branchId", type: "number", required: true },
      { arg: "versionId", type: "string", required: true }
    ],
    returns: { arg: "collections", type: "array", root: true },
    http: {
      verb: "get",
      path: "/:branchId/:versionId/collections",
      errorStatus: 400
    }
  });

  Branches.remoteMethod("getTextKeys", {
    accepts: [
      {
        arg: "branchId",
        required: true,
        type: "number"
      },
      {
        arg: "versionId",
        required: true,
        type: "number"
      },
      {
        arg: "collectionId",
        required: true,
        type: "number"
      },
      {
        arg: "locale",
        required: true,
        type: "string",
        http: { source: "query" }
      }
    ],
    returns: { arg: "keys", type: "object", root: true },
    http: {
      verb: "get",
      path: "/:branchId/:versionId/collections/:collectionId/keys",
      errorStatus: 400
    }
  });

  Branches.remoteMethod("listBranches", {
    description: "List all the branches",
    returns: { arg: "branches", type: "array", root: true },
    http: { path: "/", verb: "get", errorStatus: 400 }
  });

  Branches.remoteMethod("publish", {
    description: "Publish a branch",
    accepts: [
      {
        arg: "branchId",
        type: "number",
        required: true,
        description: "Branch Id"
      },
      {
        arg: "data",
        type: "object",
        required: true,
        description: "Release name and description",
        http: { source: "body" }
      }
    ],
    returns: { arg: "release", type: "object", root: true },
    http: { path: "/:branchId/publish", verb: "post", errorStatus: 400 }
  });

  async function getNewDraftVersion() {
    const branchPublished = await Branches.findOne({
      order: "published_version DESC",
      limit: 1
    })
    const branchDrafted = await Branches.findOne({
      order: "draft_version DESC",
      limit: 1
    })
    const newDraftVersion = (Math.max(branchPublished.published_version, branchDrafted.draft_version) || 999) + 1
    return newDraftVersion
  }

  Branches.createBranch = async function (data) {
    const { name, description, from_branch } = data;
    if (!name || !description) throw new Error("Missing parameters");

    const newDraftVersion = await getNewDraftVersion()
    const newBranch = await Branches
      .create({ name, description, draft_version: newDraftVersion });

    if (from_branch) {
      await duplicateCollectionsAndText(from_branch, newBranch);
    }

    return newBranch;
  };

  async function duplicateCollectionsAndText (fromBranchId, newBranch) {
    let baseBranch = await Branches.findById(fromBranchId);
    if(!baseBranch.published_version) 
      throw new Error('Cannot create a new branch from an unpublished branch')

    const filter = {
      include: {
        relation: "collections",
        scope: {
          where : { version: baseBranch.published_version },
          include: {
            relation: "text",
            scope: { where: { archived: false } }
          }
        }
      }
    };

    baseBranch = await Branches.findById(fromBranchId, filter);
    const collections = baseBranch.collections()
    for (let i in collections) {
      let collection = collections[i];

      let newCollection = {
        version: newBranch.draft_version,
        handle: collection.handle,
        name: collection.name,
        description: collection.description,
        branch_id: newBranch.id
      };

      const newCollectionInstance = await Branches.app.models.BranchedCollection
        .create(newCollection)

      const newTexts = []
      const texts = collection.text()
      texts.map(text => {
        newTexts.push({
          key: text.key,
          value: text.value,
          locale: text.locale,
          description: text.description,
          collection_id: newCollectionInstance.id
        })
      })
      await Branches.app.models.BranchText.create(newTextArr);
    }
  };

  Branches.listBranches = function (callback) {
    Branches.find().then(data => {
      return callback(null, data);
    });
  };

  Branches.getCollections = async function (branchId, versionId) {
    const Collection = Branches.app.models.BranchedCollection;
    const branch = await Branches.findById(branchId)
    if (!branch) throw new Error("Not found");

    const filter = {
      where: {
        and: [{ branch_id: branch.id }, { version: versionId }]
      },
      include: {
        relation: "text",
        scope: {
          fields: ["key", "locale", "collection_id"],
        }
      }
    }
    const collections = await Collection.find(filter);
    let output = []

    collections.map(collection => {
      const count = collection.text().length
      output.push({
        id: collection.id,
        handle: collection.handle,
        name: collection.name,
        description: collection.description,
        created_at: collection.created_at,
        updated_at: collection.updated_at,
        version: collection.version,
        keyCount: count
      })
    })
    return output;
  };

  Branches.getTextKeys = async function (branchId, versionId, collectionId, locale) {
    if (!locale) locale = "en";

    const filter = {
      include: {
        relation: "collections",
        scope: {
          fields: ["text", "branch_id", "id"],
          where: { id: collectionId },
          include: {
            relation: "text",
            scope: { where: { and: [{ locale }, { archived: false }] } }
          }
        }
      }
    };

    const branch = await Branches.findById(branchId, filter)
    if (!branch) throw new Error('Branch not found')

    let output = []
    const collections = branch.collections()
    collections.map(collection => {
      const texts = collection.text()
      texts.map(text => {
        output.push({
          key: text.key,
          value: text.value,
          locale: text.locale,
          description: text.description,
          collection_id: text.collection_id,
        })
      })
    })
    return output;
  };

  Branches.publish = async function (branchId, releaseData) {
    await app.dataSources.mysqldb.transaction(async models => {
      const Release = Branches.app.models.Release;
      const ReleaseCollection = Branches.app.models.ReleaseCollection;
      const ReleasedText = Branches.app.models.ReleasedText;

      if (!branchId && releaseData.name && releaseData.description)
        throw new Error("Missing parameters");

      // Fetch all draft collections with texts
      let branch = await Branches.findById(branchId);
      if (!branch.draft_version) throw new Error('Cannot release a publised branch')

      const filter = {
        include: {
          relation: "collections",
          scope: {
            where: { version: branch.draft_version },
            include: {
              relation: "text",
              scope: { where: { archived: false } }
            }
          }
        }
      };
      branch = await Branches.findById(branchId, filter)
      // Update branch published version
      await branch.updateAttributes({
        published_version: branch.draft_version,
        draft_version: null,
      });
      // Create a release
      const release = await Release.create({
        name: releaseData.name,
        description: releaseData.description
      });

      const collections = branch.collections()
      for(i in collections) {
        const collection = collections[i]
        const texts = collection.text()

        // Create each collection under release
        const releaseCollection = await ReleaseCollection.create({
          name: collection.name,
          handle: collection.handle,
          description: collection.description,
          release_id: release.id
        });

        const newTexts = texts.map(text => ({
          key: text.key,
          value: text.value,
          locale: text.locale,
          collection_id: releaseCollection.id,
          description: text.description,
        }))

        // Create text under each collection
        await ReleasedText.create(newTexts);
      }

      return release;
    });
  };

  Branches.remoteMethod("createCollection", {
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "res", type: "object", http: { source: "res" } },
      { arg: "branchId", type: "number" },
      { arg: "versionId", type: "number" }
    ],
    returns: { arg: "collection", type: "object", root: true },
    http: {
      verb: "post",
      path: "/:branchId/:versionId/collections",
      errorStatus: 400
    }
  });

  const isValidLocale = locale => {
    return !!~["en", "fr", "de", "pt", "es", "it"].indexOf(locale);
  };

  Branches.createCollection = async function (req, res, branchId, versionId) {
    const Collection = Branches.app.models.BranchedCollection;
    const Text = Branches.app.models.BranchText;

    let name, handle, locale, description;
    const data = await getMultipartData(req, res)
    name = data.name;
    handle = data.handle;
    locale = data.locale;
    description = data.description;

    if (!(name && handle)) throw new Error("Missing parameters");
    if (!data.fileContents) throw new Error("Missing file")

    const branch = await Branches.findOne({
      where: {
        and: [{ id: branchId }, { draft_version: versionId }]
      }
    });

    if (!branch) throw new Error('Branch not found')
    const collection = await Collection.create({
      version: versionId,
      handle: handle,
      name: name,
      description: description,
      branch_id: branch.id
    });

    const locales = locale ? [locale]
      : Object.keys(data.fileContents).filter(locale => isValidLocale(locale));
    let textArray = [];
    locales.map(locale => {
      let textData = data.fileContents[locale];
      if (!textData) throw new Error("Missing locale data in file");

      Object.keys(textData).map(key => {
        textArray.push({
          key,
          value: textData[key],
          locale,
          description: '',
          collection_id: collection.id
        });
      });
    });

    await Text.create(textArray);
    return collection
  };

  Branches.remoteMethod("draft", {
    accepts: [
      { arg: "branchId", type: "number" }
    ],
    returns: { arg: "branch", type: "object", root: true },
    http: {
      verb: "post",
      path: "/:branchId/draft",
      errorStatus: 400
    }
  });
  Branches.draft = async function (branchId) {
    const Collection = Branches.app.models.BranchedCollection;
    const Text = Branches.app.models.BranchText

    const branch = await Branches.findById(branchId, {
      include: {
        relation: 'collections',
        scope: {
          include: {
            relation: 'text',
            scope: { where: { archived: false } }
          }
        }
      }
    })
    if (branch.draft_version) {
      throw new Error('Draft already exists')
    }

    const publishedCollections = branch.collections()
      .filter(collection => collection.version == branch.published_version)

    const newDraftVersion = await getNewDraftVersion();
    await branch.updateAttribute('draft_version', newDraftVersion)

    for (let i in publishedCollections) {
      const collection = publishedCollections[i]

      const newCollection = await Collection.create({
        version: newDraftVersion,
        handle: collection.handle,
        name: collection.name,
        description: collection.description,
        branch_id: branch.id
      })

      const texts = collection.text().map(text => ({
        key: text.key,
        value: text.value,
        locale: text.locale,
        description: text.description,
        archived: false,
        collection_id: newCollection.id
      }))

      await Text.create(texts)
    }

    const _branch = await Branches.findById(branchId)
    return _branch
  }

  Branches.remoteMethod("updateCollection", {
    accepts: [
      { arg: "req", type: "object", http: { source: "req" } },
      { arg: "res", type: "object", http: { source: "res" } },
      { arg: "branchId", type: "number" },
      { arg: "versionId", type: "number" },
      { arg: "collectionId", type: "number" }
    ],
    returns: { arg: "collection", type: "object", root: true },
    http: {
      verb: "post",
      path: "/:branchId/:versionId/collections/:collectionId",
      errorStatus: 400
    }
  });

  Branches.updateCollection = async function (req, res, branchId, versionId, collectionId) {
    const Collection = Branches.app.models.BranchedCollection;
    const Text = Branches.app.models.BranchText
    let overwrite = false;

    const branch = await Branches.findById(branchId)
    if (!branch) throw new Error('Branch not found')
    if (branch.draft_version !== versionId) throw new Error('Cannot update branch version')
    if (branch.published_version == versionId) throw new Error('Cannot update published branch')

    const collection = await Collection.findOne({
      where: { id: collectionId, branch_id: branch.id }
    })
    if (!collection) throw new Error('Collection not found')

    const data = await getMultipartData(req, res)
    overwrite = data.overwrite || overwrite;

    if (data.description) {
      await collection.updateAttribute('description', data.description)
    }

    if(data.name) {
      await collection.updateAttribute('name', data.name) 
    }

    if (data.fileContents) {
      const localesInFile = Object.keys(data.fileContents).filter(locale => isValidLocale(locale))
      const allText = await Text.find({
        where: { collection_id: collection.id, archived: false }
      })

      const existingLocales = Array.from(new Set(allText.map(text => text.locale)))
      let existingTextMap = {}
      existingLocales.map(locale => {
        existingTextMap[locale] = {}
      })
      allText.map(text => {
        existingTextMap[text.locale][text.key] = text
      })

      let newTextToBeAdded = []
      for (i in localesInFile) {
        const locale = localesInFile[i]
        const textMap = data.fileContents[locale]
        const textKeys = Object.keys(textMap)
        for (j in textKeys) {
          const key = textKeys[j]
          const existingText = existingTextMap[locale] && existingTextMap[locale][key]

          if (existingText && overwrite) {
            const textInstance = await Text.findOne({
              where: {
                and: [
                  { key: existingText.key },
                  { locale },
                  { collection_id: collection.id },
                  { archived: false },
                ]
              }
            })
            await textInstance.updateAttribute('value', textMap[key])
          } else if (!existingText) {
            newTextToBeAdded.push({
              key,
              value: textMap[key],
              locale,
              description: '',
              archived: false,
              collection_id: collection.id
            })
          }
        }
      }
      if (newTextToBeAdded.length) {
        await Text.create(newTextToBeAdded)
      }
    }
    return collection
  }

  Branches.remoteMethod("discardDraft", {
    accepts: [{ arg: "branchId", type: "number" }],
    returns: { arg: "branch", type: "object", root: true },
    http: { verb: "post", path: "/:branchId/discard_draft", errorStatus: 400 }
  });
  Branches.discardDraft = async function (branchId) {
    const Text = Branches.app.models.BranchText;
    const Collection = Branches.app.models.BranchedCollection;

    let branch = await Branches.findById(branchId)

    if (!branch.draft_version) throw new Error('No collections or keys to discard')

    const filter = {
      include: {
        relation: 'collections',
        scope: {
          where: { version: branch.draft_version },
        }
      }
    }

    let branchRelation = await Branches.findById(branchId, filter);
    const collections = branchRelation.collections()

    for (i in collections) {
      const collection = collections[i]
      await Text.destroyAll({ collection_id: collection.id })
    }

    await Collection.destroyAll({ branch_id: branch.id, version: branch.draft_version })
    branch = await branch.updateAttribute('draft_version', null)
    return branch

  }

  Branches.observe("before save", async function (ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
