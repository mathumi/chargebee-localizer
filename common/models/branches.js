var Promise = require("bluebird");
const app = require("../../server/server");
const serialize = require("loopback-jsonapi-model-serializer");

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
        description: "name, description"
      }
    ],
    returns: { arg: "release", type: "object", root: true },
    http: { path: "/", verb: "post", errorStatus: 400 }
  });

  Branches.remoteMethod("getCollections", {
    accepts: [
      {
        arg: "branchId",
        type: "number",
        required: true
      },
      {
        arg: "versionId",
        type: "string",
        required: true
      }
    ],
    returns: { arg: "collections", type: "array", root: true },
    http: {
      verb: "get",
      path: "/:branchId/:versionId/collections",
      errorStatus: 400
    }
  });

  Branches.remoteMethod("getKeys", {
    accepts: [
      {
        arg: "versionId",
        required: true,
        type: "string"
      },
      {
        arg: "branchId",
        required: true,
        type: "number"
      },
      {
        arg: "collectionId",
        required: true,
        type: "string"
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

  Branches.createBranch = async function(data, callback) {
    const { name, description, from_branch } = data;
    let draft_version;

    if (!name || !description) {
      return callback(new Error("Missing parameters"));
    }

    const newBranch = await Branches.find({
      order: "publised_version DESC",
      limit: 1
    }).then(data => {
      draft_version =
        parseInt((data && data[0] && data[0]["publised_version"]) || 999) + 1;
      return Branches.create({ name, description, draft_version });
    });

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
    Branches.find(
      {
        where: {
          id: branchId,
          version: versionId
        }
      },
      function(err, collections) {
        if (err || !collections) return cb(err);
        return cb(null, collections);
      }
    );
  };

  Branches.getKeys = function(branchId, versionId, collectionId, cb) {
    Branchedcollection.find({
      where: {
        version: versionId,
        id: branchId,
        branch_collection_id: collectionId
      },
      function(err, keys) {
        if (err || !keys) return cb(err);
        return cb(null, keys);
      }
    });
  };

  function getCollections(branchData) {
    const result = branchData.included
      .filter(obj => obj.type == "collections")
      .map(collection => ({
        id: collection.id,
        name: collection.attributes.name,
        handle: collection.attributes.handle,
        description: collection.attributes.description
      }));
    return result;
  }

  function getTexts(branchData) {
    const result = branchData.included
      .filter(obj => obj.type == "text")
      .map(text => ({
        key: text.id,
        value: text.attributes.value,
        locale: text.attributes.locale,
        collection_id: text.attributes.collection_id
      }));
    return result;
  }

  function getCollections(branchData) {
    const result = branchData.included
      .filter(obj => obj.type == "collections")
      .map(collection => ({
        id: collection.id,
        name: collection.attributes.name,
        handle: collection.attributes.handle,
        description: collection.attributes.description
      }));
    return result;
  }

  function getTexts(branchData) {
    const result = branchData.included
      .filter(obj => obj.type == "text")
      .map(text => ({
        key: text.id,
        value: text.attributes.value,
        locale: text.attributes.locale,
        collection_id: text.attributes.collection_id
      }));
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
        await branch.updateAttribute("publised_version", branch.draft_version);
        // Create a release
        const release = await Release.create({
          name: releaseData.name,
          description: releaseData.description
        });

        const collections = getCollections(serialize(branch, Branches));
        const texts = getTexts(serialize(branch, Branches));

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

  Branches.observe("before save", async function(ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
