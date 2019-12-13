'use strict';

module.exports = function(Release) {
  Release.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
