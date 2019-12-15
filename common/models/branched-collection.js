'use strict';

module.exports = function(Branchedcollection) {
  
  Branchedcollection.observe('before save', async function(ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
