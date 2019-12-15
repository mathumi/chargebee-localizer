'use strict';

module.exports = function(BranchText) {

  BranchText.remoteMethod("upsertText", {
    accepts: [
      { arg: "data", type: "object", http: { source: 'body' } }
    ],
    returns: { arg: "text", type: "object", root: true },
    http: { verb: "put", path: "/", errorStatus: 400 }
  });
  BranchText.upsertText = async function(data, callback) {
    const Branch = BranchText.app.models.Branches
    const Collection = BranchText.app.models.BranchedCollection

    const { key, branchId, collectionId, versionId, locale, value='', archived=false } = data;
    try {
      if(!(key && branchId && collectionId && versionId && locale)) 
        throw new Error('Missing parameters')

      const branch = await Branch.findById(branchId);
      const collection = await Collection.findById(collectionId)

      if(!branch) throw new Error('Branch not found')
      if(!collection) throw new Error('Collection not found')

      if(branch.draft_version !== versionId) throw new Error('Incorrect draft version')
      if(collection.branch_id !== branch.id) throw new Error('Collection does not belong to branch')
      if(collection.version !== versionId) throw new Error('Incorrect collection version')

      const text = await BranchText.upsert({
        key,
        value,
        archived,
        locale,
        collection_id: collection.id,
      })
      return callback(null, text)
    } catch(e) {
      return callback(e)
    }
  }

  BranchText.observe('before save', async function(ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
