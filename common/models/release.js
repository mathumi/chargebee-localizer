'use strict';
const async = require('async')

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
              fields: ['id', 'name', 'description', 'published_texts_version'],
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

  Release.getCollections = async function (releaseId) {
    const Collection = Release.app.models.ReleaseCollection
    const release = await Release.findById(releaseId)
    if (!release) throw new Error('Not found')

    const filter = {
      where: { release_id: releaseId },
      include: {
        relation: 'text',
        scope: {
          fields: ['key', 'locale', 'collection_id']
        }
      }
    }
    const collections = await Collection.find(filter)
    const output = []
    collections.map(collection => {
      const count = collection.text().length
      output.push({
        id: collection.id,
        version: collection.version,
        handle: collection.handle,
        name: collection.name,
        description: collection.description,
        created_at: collection.created_at,
        keyCount: count
      })
    })

    return output
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

  Release.getTextKeys = async function (releaseId, collectionId, locale) {
    if (!locale) locale = 'en'
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
    const release = await Release.findById(releaseId, filter)
    if(!release) throw new Error('Release not found')

    const collections = release.collections()
    const output = []

    collections.map(collection => {
      const texts = collection.text()
      texts.map(text => {
        output.push({
          key: text.id,
          value: text.value,
          locale: text.locale,
          collection_id: text.collection_id,
        })
      })
    })

    return output;
  };

  Release.remoteMethod('getTextByCollections', {
    accepts: [
      { arg: 'releaseName', required: true, type: 'string' },
      { arg: 'collections', required: false, type: 'string', http: { source: 'query' } },
      { arg: 'locale', required: true, type: 'string', http: { source: 'query' } },
    ],
    description: 'Get all text by release name and collection names',
    returns: { arg: 'localeTextObj', type: 'object', root: true },
    http: { verb: 'get', path: '/:releaseId', errorStatus: 400 }
  })

  Release.getTextByCollections = async function (releaseName, collectionsStr, locale) {
    let collectionHandles = []
    if (collectionsStr) collectionHandles = decodeURIComponent(collectionsStr).split(',')
    let release = await Release.findOne({ where: { name: releaseName } });
    if (!release) throw new Error('Release not found')

    const filter = {
      include: {
        relation: 'collections',
        scope: {
          where: { and: [{ release_id: release.id }] },
          include: {
            relation: 'text',
            scope: {
              where: { locale }
            }
          }
        }
      }
    }

    if (collectionHandles.length) {
      filter.include.scope.where.and.push({
        handle: { inq: collectionHandles }
      })
    }

    release = await Release.findById(release.id, filter)
    const collections = release.collections()
    const output = {
      [locale]: {}
    }
    collections.map(collection => {
      const texts = collection.text()
      texts.map(text => {
        output[locale][`${collection.handle}.${text.key}`] = text.value
      })
    })
    return output
  }

  Release.observe('before save', async function (ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
