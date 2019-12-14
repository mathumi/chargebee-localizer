'use strict';
var Promise = require('bluebird');

module.exports = function(Branches) {
  Branches.disableRemoteMethod("create", true);

  Branches.remoteMethod('createBranch', {
    description: 'Create a branch',
    accepts: [
      {
        arg: 'data', type: 'object', http: { source: 'body' }, required: true,
        description: 'name, description'
      },
    ],
    returns: {arg: 'branch', type: 'object', "root": true},
    http: {path: '/', verb: 'post', errorStatus: 400}
  });

  Branches.remoteMethod('getCollections', {
    accepts: [
      {
        arg: 'branchId', type: 'number', required: true
      },
      {
        arg: 'versionId', type: 'string', required: true
      }
  ],
    returns: {arg: 'collections', type: 'array', 'root': true},
    http: {verb: 'get', path: '/:branchId/:versionId/collections', errorStatus: 400}
  });

  Branches.remoteMethod('getKeys', {
    accepts: [{
      arg: 'versionId', required: true, type: 'string'
    }, {
      arg: 'branchId', required: true, type: 'number'
    },{
      arg: 'collectionId', required: true, type: 'string'
    }, {
      arg: 'locale', required: true, type: 'string', http: {source: 'query'}
    }],
    returns: {arg: 'keys', type: 'object', 'root': true},
    http: {verb: 'get', path: '/:branchId/:versionId/collections/:collectionId/keys', errorStatus: 400}
  });

  Branches.remoteMethod("listBranches", {
    description: 'List all the branches',
    returns: {arg: 'branches', type: 'array', root: true},
    http: {path: '/', verb: 'get', errorStatus: 400}
  });

  Branches.createBranch = async function(data, callback) {
    const { name, description, fromBranch } = data;
    let draft_version;

    if( !name || !description ) {
      return callback(new Error("Missing parameters"))
    }

    const newBranch = await Branches.find({order: 'publised_version DESC', limit: 1})
    .then(data => {
      draft_version = (data && data [0] && data[0]["publised_version"] || 999) + 1;
      return Branches.create({ name, description, draft_version})
    });

    if(fromBranch) {
      duplicateCollectionsAndText(fromBranch, newBranch);
    }

    return callback(null, newBranch)

  }

  let duplicateCollectionsAndText = async function(fromBranchId, newBranch) {
    const filter = {
      include: {
        relation: 'collections',
        scope: {
          include: {
            relation: 'text',
            scope: { where: { archived: false } }
          }
        }
      }
    };
    const baseBranch = await Branches.findById(fromBranchId, filter);
    baseBranch.collections.array.forEach(collection => {
      let newCollection = {
        version: collection.version,
        handle: collection.handle,
        name: collection.name,
        description: collection.description,
        branch_id: newBranch.id
      };
      Branches.app.models.Branchedcollection.create(newCollection)
      .then(data => {
        let newTextArr = [];
        collection.texts.array.forEach(text => {
          newTextArr.push({
            key: text.key,
            value: text.value,
            locale: text.locale,
            collection_id: data.id
          })
        });
        return Branches.app.models.branched_text.create(newTextArr);
      });
    });
  }

  Branches.listBranches = function(callback) {
    Branches.find().then(data => {
      return callback(null, data);
    });
  }
  
  Branches.getCollections = function(branchId, versionId, cb) {
    Branches.find({where: {
      id : branchId,
      version: versionId
    }},
      function (err, collections) {
        if (err || !collections) return cb(err)
        return cb(null, collections)
      }
    )
  }

  Branches.getKeys = function(branchId, versionId, collectionId, cb) {
    Branchedcollection.find({
      where: {
        version: versionId,
        id: branchId,
        branch_collection_id: collectionId
      }, function (err, keys) {
        if (err || !keys) return cb(err)
        return cb(null, keys)
      }
    })
  }

  Branches.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
