'use strict';

module.exports = function(Branches) {
  Branches.disableRemoteMethod("create", true);

  Branches.remoteMethod('createBranch', {
    description: 'Create a branch',
    accepts: [
      {
        arg: 'data', type: 'object', http: { source: 'body' }, required: true,
        description: 'name, description'
      },
    ],
    returns: {arg: 'release', type: 'object', "root": true},
    http: {path: '/create', verb: 'post', errorStatus: 400}
  });

  Branches.createBranch = function (data, cb) {
    const { name, description } = data;
    if(!name && description) return cb(new Error('Missing parameters'))

    Branches.create({
      name,
      description
    }, cb)
  }

  Branches.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
