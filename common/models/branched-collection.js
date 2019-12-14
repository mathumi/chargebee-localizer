'use strict';

module.exports = function(Branchedcollection) {
  Branchedcollection.publish = function(collectionId, cb) {
    Branchedcollection.findOne({
      id: collectionId
    }, function(err, collection) {
      if(err || !collection) return cb(err)
      collection.updateAttributes({
        publised_texts_version: collection.draft_texts_version,
        draft_texts_version: ''
      }, cb)
    })
  }

  Branchedcollection.remoteMethod('publish', {
    accepts: {arg: 'collectionId', type: 'number'},
    returns: {arg: 'collection', type: 'object', "root": true},
    http: {path: '/:collectionId/publish', verb: 'post', errorStatus: 400}
  });
  
  Branchedcollection.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
