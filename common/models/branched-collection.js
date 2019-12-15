'use strict';

module.exports = function(Branchedcollection) {
  
  Branchedcollection.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
