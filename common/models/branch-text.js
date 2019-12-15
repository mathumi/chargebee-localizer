'use strict';

module.exports = function(Branchtext) {
  Branchtext.observe('before save', async function(ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
