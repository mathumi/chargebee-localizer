var Promise = require("bluebird");
const app = require("../../server/server");
const serialize = require("loopback-jsonapi-model-serializer");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

module.exports = function(Branches) {
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

  Branches.createBranch = async function(data, callback) {
    const { name, description, from_branch } = data;
    let draft_version;

    if (!name || !description) {
      return callback(new Error("Missing parameters"));
    }

    const newDraftVersion = await getNewDraftVersion()
    const newBranch = Branches.create({ name, description, draft_version: newDraftVersion });

    if (from_branch) {
      await duplicateCollectionsAndText(from_branch, newBranch);
    }

    return callback(null, newBranch);
  };

  let duplicateCollectionsAndText = async function(fromBranchId, newBranch) {
    const filter = {
      include: {
        relation: "collections",
        scope: {
          include: {
            relation: "text",
            scope: { where: { archived: false } }
          }
        }
      }
    };

    const baseBranch = await Branches.findById(fromBranchId, filter);

    for (let i = 0; i < baseBranch.collections().length; i++) {
      let collection = baseBranch.collections()[i];

      let newCollection = {
        version: newBranch.draft_version,
        handle: collection.handle,
        name: collection.name,
        description: collection.description,
        branch_id: newBranch.id
      };

      await Branches.app.models.branched_collection
        .create(newCollection)
        .then(data => {
          let newTextArr = [];
          for (let i = 0; i < collection.text().length; i++) {
            let text = collection.text()[i];
            newTextArr.push({
              key: text.key,
              value: text.value,
              locale: text.locale,
              collection_id: data.id
            });
          }
          return Branches.app.models.branch_text.create(newTextArr);
        });
    }

    return Promise.resolve(true);
  };

  Branches.listBranches = function(callback) {
    Branches.find().then(data => {
      return callback(null, data);
    });
  };

  Branches.getCollections = function(branchId, versionId, cb) {
    const Collection = Branches.app.models.BranchedCollection;
    Branches.findById(branchId)
      .then(branch => {
        if (!branch) throw new Error("Not found");

        return Collection.find({
          where: {
            and: [{ branch_id: branch.id }, { version: versionId }]
          },
          include: {
            relation: "text",
            scope: {
              fields: ["key"]
            }
          }
        });
      })
      .then(data => {
        const rawData = serialize(data, Collection);
        const collectionMap = {};
        rawData.data.map(collection => {
          collectionMap[collection.id] = {
            id: collection.id,
            handle: collection.attributes.handle,
            name: collection.attributes.name,
            description: collection.attributes.description,
            created_at: collection.attributes.created_at,
            updated_at: collection.attributes.updated_at,
            keyCount: 0
          };
        });

        if (rawData.included) {
          rawData.included.map(key => {
            const _collection = collectionMap[key.attributes.collection_id];
            _collection.keyCount = _collection.keyCount + 1;
          });
        }

        const formattedData = Object.values(collectionMap);

        cb(null, formattedData);
      })
      .catch(err => cb(err));
  };

  Branches.getTextKeys = function(
    branchId,
    versionId,
    collectionId,
    locale,
    cb
  ) {
    if (!locale) locale = "en";

    const filter = {
      include: {
        relation: "collections",
        scope: {
          fields: ["text", "branch_id", "id"],
          where: {
            id: collectionId
          },
          include: {
            relation: "text",
            scope: {
              where: {
                locale,
                archived: false
              }
            }
          }
        }
      }
    };

    Branches.findById(branchId, filter, function(err, branch) {
      if (err || !branch) return cb(err);

      const rawData = serialize(branch, Branches);
      const texts = rawData.included
        ? rawData.included
            .filter(
              obj => obj.type == "text" && obj.attributes.archived == false
            )
            .map(text => ({
              key: text.id,
              value: text.attributes.value,
              locale: text.attributes.locale,
              collection_id: text.attributes.collection_id
            }))
        : [];

      return cb(null, texts);
    });
  };

  function getCollectionsJSON(branchData) {
    const result = branchData.included
      ? branchData.included
          .filter(obj => obj.type == "collections")
          .map(collection => ({
            id: collection.id,
            name: collection.attributes.name,
            handle: collection.attributes.handle,
            description: collection.attributes.description
          }))
      : [];
    return result;
  }

  function getTextsJSON(branchData) {
    const result = branchData.included
      ? branchData.included
          .filter(obj => obj.type == "text")
          .map(text => ({
            key: text.id,
            value: text.attributes.value,
            locale: text.attributes.locale,
            collection_id: text.attributes.collection_id
          }))
      : [];
    return result;
  }

  Branches.publish = async function(branchId, releaseData, cb) {
    try {
      await app.dataSources.mysqldb.transaction(async models => {
        const Release = Branches.app.models.Release;
        const ReleaseCollection = Branches.app.models.ReleaseCollection;
        const ReleasedText = Branches.app.models.ReleasedText;

        if (!branchId && releaseData.name && releaseData.description)
          throw new Error("Missing parameters");

        // Fetch all collections with texts
        const filter = {
          include: {
            relation: "collections",
            scope: {
              include: {
                relation: "text",
                scope: { where: { archived: false } }
              }
            }
          }
        };
        const branch = await Branches.findById(branchId, filter);
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

        const collections = getCollectionsJSON(serialize(branch, Branches));
        const texts = getTextsJSON(serialize(branch, Branches));

        for (let i = 0; i < collections.length; i++) {
          const collectionObj = collections[i];
          // Create each collection under release
          const releaseCollection = await ReleaseCollection.create({
            name: collectionObj.name,
            handle: collectionObj.handle,
            description: collectionObj.description,
            release_id: release.id
          });

          const filteredText = texts
            .filter(text => text.collection_id == collectionObj.id)
            .map(text => ({
              key: text.key,
              value: text.value,
              locale: text.locale,
              collection_id: releaseCollection.id
            }));

          // Create text under each collection
          await ReleasedText.create(filteredText);
        }

        return cb(null, release);
      });
    } catch (e) {
      return cb(e);
    }
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

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const downloadPath = path.join(__dirname, "../../server/storage");
      cb(null, downloadPath + "/");
    },
    filename: function(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
  });

  const isValidLocale = locale => {
    return !!~["en", "fr", "de", "pt", "es", "it"].indexOf(locale);
  };

  Branches.createCollection = function(
    req,
    res,
    branchId,
    versionId,
    callback
  ) {
    let fileData, name, handle, locale, description;

    // Read contents of file
    new Promise((resolve, reject) => {
      var upload = multer({
        storage: storage
      }).single("file");

      upload(req, res, function(err) {
        if (err) return reject(err);
        const data = req.body || {};
        name = data.name;
        handle = data.handle;
        locale = data.locale;
        description = data.description;

        if (!(name && handle)) return reject(new Error("Missing parameters"));

        if (req.file) {
          fileData = JSON.parse(
            fs.readFileSync(req.file.path, { encoding: "utf8" })
          );
        }
        return resolve(fileData);
      });
    })
      .then(data => {
        // Fetch branch
        return new Promise((resolve, reject) => {
          Branches.findOne(
            {
              where: {
                and: [{ id: branchId }, { draft_version: versionId }]
              }
            },
            function(err, branch) {
              if (err || !branch) return reject(err || new Error("Not found"));
              return resolve(branch);
            }
          );
        });
      })
      .then(branch => {
        // Create collection
        return new Promise((resolve, reject) => {
          const Collection = Branches.app.models.BranchedCollection;
          Collection.create(
            {
              version: versionId,
              handle: handle,
              name: name,
              description: description,
              branch_id: branch.id
            },
            function(err, collection) {
              if (err) return reject(err);
              return resolve(collection);
            }
          );
        });
      })
      .then(collection => {
        // Create text for collection
        return new Promise((resolve, reject) => {
          const Text = Branches.app.models.BranchText;
          const locales = locale
            ? [locale]
            : Object.keys(fileData).filter(locale => isValidLocale(locale));
          let textArray = [];
          locales.map(locale => {
            let textData = fileData[locale];
            if (!textData)
              return reject(new Error("Missing locale data in file"));
            Object.keys(textData).map(key => {
              textArray.push({
                key,
                value: textData[key],
                locale,
                collection_id: collection.id
              });
            });
          });
          Text.create(textArray, function(err, texts) {
            if (err) return reject(err);
            return resolve(collection);
          });
        });
      })
      .then(collection => callback(null, collection))
      .catch(err => callback(err));
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
  Branches.draft = async function(branchId, callback) {
    const Collection = Branches.app.models.BranchedCollection;
    const Text = Branches.app.models.BranchText

    try {
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
      if(branch.draft_version) {
        throw new Error('Draft already exists')
      }

      const publishedCollections = branch.collections()
        .filter(collection => collection.version == branch.published_version)
      
      const newDraftVersion = await getNewDraftVersion();
      await branch.updateAttribute('draft_version', newDraftVersion)

      for(let i in publishedCollections) {
        const collection = publishedCollections[i]

        const newCollection = await Collection.create({
          version: newDraftVersion,
          handle: collection.handle,
          name: collection.name,
          description: collection.description,
        })

        const texts = collection.text().map(text => ({
          key: text.key,
          value: text.value,
          locale: text.locale,
          archived: false,
          collection_id: newCollection.id
        }))

        await Text.create(texts)
      }

      const _branch = await Branches.findById(branchId)
      return callback(null, _branch)
    } catch(e) {
      return callback(e)
    }
  }

  Branches.observe("before save", async function(ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
