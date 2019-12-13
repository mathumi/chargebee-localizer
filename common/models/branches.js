'use strict';

module.exports = function(Branches) {
  Branches.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
