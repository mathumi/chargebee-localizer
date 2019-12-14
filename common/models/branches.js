'use strict';

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
    returns: {arg: 'release', type: 'object', "root": true},
    http: {path: '/create', verb: 'post', errorStatus: 400}
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

  Branches.createBranch = function (data, cb) {
    const { name, description } = data;
    if(!name && description) return cb(new Error('Missing parameters'))

    Branches.create({
      name,
      description
    }, cb)
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
