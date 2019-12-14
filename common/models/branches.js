'use strict';
const app = require('../../server/server')
const serialize = require('loopback-jsonapi-model-serializer')

module.exports = function (Branches) {
  Branches.disableRemoteMethod("create", true);

  Branches.remoteMethod('createBranch', {
    description: 'Create a branch',
    accepts: [
      {
        arg: 'data', type: 'object', http: { source: 'body' }, required: true,
        description: 'name, description'
      },
    ],
    returns: { arg: 'release', type: 'object', "root": true },
    http: { path: '/create', verb: 'post', errorStatus: 400 }
  });

  Branches.remoteMethod('publish', {
    description: 'Publish a branch',
    accepts: [
      {
        arg: 'branchId', type: 'number', required: true, description: 'Branch Id'
      },
      {
        arg: 'data', type: 'object', required: true, description: 'Release name and description',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'release', type: 'object', "root": true },
    http: { path: '/:branchId/publish', verb: 'post', errorStatus: 400 }
  });

  Branches.createBranch = function (data, cb) {
    const { name, description } = data;
    if (!name && description) return cb(new Error('Missing parameters'))

    Branches.create({
      name,
      description
    }, cb)
  }

  function getCollections(branchData) {

    const result = branchData.included.filter(obj => obj.type == "collections").map(collection => ({
      id: collection.id,
      name: collection.attributes.name,
      handle: collection.attributes.handle,
      description: collection.attributes.description,
    }))
    return result;
  }

  function getTexts(branchData) {
    const result = branchData.included.filter(obj => obj.type == "text").map(text => ({
      key: text.id,
      value: text.attributes.value,
      locale: text.attributes.locale,
      collection_id: text.attributes.collection_id
    }))
    return result
  }

  Branches.publish = async function (branchId, releaseData, cb) {
    try {
      await app.dataSources.mysqldb.transaction(async models => {
        const Release = Branches.app.models.Release
        const ReleaseCollection = Branches.app.models.ReleaseCollection
        const ReleasedText = Branches.app.models.ReleasedText

        if (!branchId && releaseData.name && releaseData.description)
          throw new Error('Missing parameters')

        // Fetch all collections with texts
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
        const branch = await Branches.findById(branchId, filter)
        // Update branch published version
        await branch.updateAttribute('publised_version', branch.draft_version)
        // Create a release
        const release = await Release.create({
          name: releaseData.name,
          description: releaseData.description
        })

        const collections = getCollections(serialize(branch, Branches))
        const texts = getTexts(serialize(branch, Branches))

        for (let i = 0; i < collections.length; i++) {
          const collectionObj = collections[i]
          // Create each collection under release
          const releaseCollection = await ReleaseCollection.create({
            name: collectionObj.name,
            handle: collectionObj.handle,
            description: collectionObj.description,
            release_id: release.id
          })

          const filteredText = texts.filter(text => text.collection_id == collectionObj.id).map(text => ({
            key: text.key,
            value: text.value,
            locale: text.locale,
            collection_id: releaseCollection.id
          }))

          // Create text under each collection
          await ReleasedText.create(
            filteredText
          )
        }

        return cb(null, release)

      })
    } catch (e) {
      return cb(e)
    }

  }

  Branches.observe('before save', async function (ctx) {
    const instance = ctx.instance || ctx.currentInstance
    if (instance) instance.updated_at = new Date()

    return;
  });
};
