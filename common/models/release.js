'use strict';
const async = require('async')
const serialize = require("loopback-jsonapi-model-serializer");

module.exports = function (Release) {
  Release.disableRemoteMethod("create", true);
  Release.remoteMethod('createRelease', {
    description: 'Create a release from a branch',
    accepts: [
      {
        arg: 'data', type: 'object', http: { source: 'body' }, required: true,
        description: 'name, description and branchId'
      },
    ],
    returns: { arg: 'release', type: 'object', "root": true },
    http: { path: '/', verb: 'post', errorStatus: 400 }
  });

  Release.remoteMethod('getReleases', {
    returns: { arg: 'releases', type: 'array', root: true },
    http: { verb: 'get', path: '/', errorStatus: 400 }
  })

  Release.remoteMethod('getReleaseText', {
    accepts: [{
      arg: 'locale', required: true, type: 'string', http: { source: 'query' }
    }, {
      arg: 'release', type: 'string', http: { source: 'query' }
    }, {
      arg: 'collections', type: 'string', http: { source: 'query' }
    }],
    returns: { arg: 'texts', type: 'object', root: true },
    http: { verb: 'get', path: '/release/texts', errorStatus: 400 }
  })


  Release.getReleases = function (cb) {
    Release.find(function (err, releases) {
      if (err) return cb(err);
      cb(null, releases);
    })
  }
  Release.createRelease = function (data, cb) {
    const { name, description, branchId } = data;
    if (!(name && description && branchId)) {
      return new Error('Missing parameters')
    }
    const Branch = Release.app.models.Branches

    async.waterfall([
      // Create a release
      function (callback) {
        Release.create({
          name,
          description
        }, function (err, release) {
          return callback(err, release)
        })
      },
      // Get current branch with its collections and its text
      function (release, callback) {
        const filters = {
          include: {
            relation: 'collections',
            scope: {
              fields: ['id', 'name', 'description', 'publised_texts_version'],
              include: {
                relation: 'text',
                scope: {
                  fields: ['key', 'value', 'locale'],
                  where: {
                    archieved: false
                  }
                }
              }
            }
          }
        };
        Branch.findById(branchId, filters, function (err, branch) {
          return callback(err, branch, release)
        })
      }
    ], cb);

  }

  Release.remoteMethod('getCollections', {
    accepts: [
      {
        arg: 'releaseId', required: true, type: 'string'
      }
    ],
    returns: { arg: 'collections', type: 'object', root: true },
    http: { verb: 'get', path: '/:releaseId/collections', errorStatus: 400 }
  })

  Release.getCollections = function(releaseId, cb) {
    const Collection = Release.app.models.ReleaseCollection
    Release.findById(releaseId)
      .then(release => {
        if(!release) throw new Error('Not found')

        return Collection.find({
          where: {release_id: releaseId},
          include: {
            relation: 'text',
            scope: {
              fields: ['key']
            }
          }
        })
      })
      .then(data => {
        const rawData = serialize(data, Collection)
        const collectionMap = {}
        rawData.data.map(collection => {
          collectionMap[collection.id] = {
            id: collection.id,
            handle: collection.attributes.handle,
            name: collection.attributes.name,
            description: collection.attributes.description,
            created_at: collection.attributes.created_at,
            keyCount: 0
          }
        })

        if(rawData.included) {
          rawData.included.map(key => {
            const _collection = collectionMap[key.attributes.collection_id]
            _collection.keyCount = _collection.keyCount + 1
          })
        }

        const formattedData = Object.values(collectionMap)
        
        cb(null, formattedData)
      })
      .catch(err => cb(err))
  }

  Release.remoteMethod("getTextKeys", {
    accepts: [
      {
        arg: "releaseId",
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
      path: "/:releaseId/collections/:collectionId/keys",
      errorStatus: 400
    }
  });

  Release.getTextKeys = function (releaseId, collectionId, locale, cb) {
    if(!locale) locale = 'en'
    const filter = {
      include: {
        relation: 'collections',
        scope: {
          where: { id: collectionId },
          include: {
            relation: 'text',
            scope: {
              where: { locale }
            }
          }
        }
      }
    };
    Release.findById(releaseId, filter, function(err, release) {
      if (err || !release) return cb(err);
      const rawData = serialize(release, Release)
      const texts = rawData.included ?
        rawData.included.filter(obj => obj.type == 'released_texts')
        .map(text => ({
          key: text.id,
          value: text.attributes.value,
          locale: text.attributes.locale,
          collection_id: text.attributes.collection_id,
        })) : []

      return cb(null, texts);
    }
  );
};

  Release.observe('before save', async function (ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
