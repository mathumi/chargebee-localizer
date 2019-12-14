'use strict';

module.exports = function(Branchtext) {
  Branchtext.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
