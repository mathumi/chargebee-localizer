'use strict';
const async = require('async')

module.exports = function(Release) {
  Release.disableRemoteMethod("create", true);
  Release.remoteMethod('createRelease', {
    description: 'Create a release from a branch',
    accepts: [
      {
        arg: 'data', type: 'object', http: { source: 'body' }, required: true,
        description: 'name, description and branchId'
      },
    ],
    returns: {arg: 'release', type: 'object', "root": true},
    http: {path: '/create', verb: 'post', errorStatus: 400}
  });

  Release.createRelease = function(data, cb) {
    const { name, description, branchId } = data;
    if(!(name && description && branchId)) {
      return new Error('Missing parameters')
    }
    const Branch = Release.app.models.Branches

    async.waterfall([
      // Create a release
      function(callback) {
        Release.create({
          name,
          description
        }, function(err, release) {
          return callback(err, release)
        })
      },
      // Get current branch with its collections and its text
      function(release, callback) {
        const filters = { 
          include: { 
            relation: 'collections',
            scope: {
              fields: [ 'id', 'name', 'description', 'publised_texts_version' ],
              include: {
                relation: 'text',
                scope: {
                  fields: ['key', 'value', 'locale'],
                  where: {
                    archieved: false
                  }
                }
              }
            }
          }
        };
        Branch.findById(branchId, filters, function(err, branch) {
          return callback(err, branch, release)
        })
      },
      // Move text from current branch to release
      function(branch, release, callback) {

        console.log(JSON.stringify(branch), release)
        return callback(null)
      }
    ], cb);
    
  }

  Release.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
