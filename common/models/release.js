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
    http: {path: '/', verb: 'post', errorStatus: 400}
  });

  Release.remoteMethod('getReleases', {
    returns: {arg: 'releases', type:'array', root: true},
    http: {verb: 'get', path: '/', errorStatus: 400}
  })

  Release.remoteMethod('getReleaseText', {
    accepts: [{
        arg: 'locale', required: true, type: 'string', http: {source: 'query'}
      }, {
        arg: 'release', type: 'string', http: {source: 'query'}
      }, {
        arg: 'collections', type: 'string', http: {source: 'query'}
      }],
      returns: {arg: 'texts', type: 'object', root: true},
      http: {verb: 'get', path: '/release/texts', errorStatus: 400}
  })

  
  Release.getReleases = function(cb) {
    Release.find(function(err, releases) {
      if(err) return cb(err);
      cb(null, releases);
    })
  }
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
      }
    ], cb);
    
  }

  Release.observe('before save', async function(ctx) {
    ctx.instance.updated_at = new Date()
    return;
  });
};
