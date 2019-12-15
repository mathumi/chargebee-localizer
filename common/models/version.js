'use strict';

module.exports = function(Version) {
  Version.disableRemoteMethod('create', true);

  Version.remoteMethod('createVersion', {
    description: 'Create new version',
    accepts: [
      {
        arg: 'data',
        type: 'object',
        http: {source: 'body'},
        required: true,
        description: 'name, value, level',
      },
    ],
    returns: {arg: 'version', type: 'object', root: true},
    http: {path: '/', verb: 'post', errorStatus: 400},
  });

  Version.remoteMethod('getVersion', {
    description: 'Get a version',
    accepts: [
      {arg: 'name', type: 'string', required: true},
      {
        arg: 'payload',
        type: 'string',
        required: false,
        description:
          'Must be JSON encoded string `{"domain":"siva","env":"prod"...}`',
      },
    ],
    returns: {arg: 'version', type: 'object', root: true},
    http: {verb: 'get', path: '/:name', errorStatus: 400},
  });

  Version.createVersion = function(data, callback) {
    const {
			name,
			value,
      level,
      enabled,
      attribute1,
      operator1,
      value1,
      attribute2,
      operator2,
      value2,
      comment,
		} = data;

    Version.create({
      name,
      value,
      level,
      enabled,
      attribute1,
      operator1,
      value1,
      attribute2,
      operator2,
      value2,
      comment,
    }).then(data => {
      callback(null, data);
    });
  };

  Version.getVersion = function(name, payload, callback) {
    Version.find({where: {name: name, enabled: true}, order: 'level DESC'})
		.then(versions => {
  		for (let i = 0; i < versions.length; i++) {
        let version = versions[i];
        if (matchVersion(payload, version)) {
          return callback(null, version);
        }
      }
  		return callback(new Error('No Record Matches'));
    });
  };

  let matchVersion = function(payload, version) {
    return (
			matchRule(payload, version.attribute1, version.operator1, version.value1) && 
			matchRule(payload, version.attribute2, version.operator2, version.value2)
    );
  };

  let matchRule = function(payload, key, operator, value) {
    if (!key || !operator || !value) {
      return true;
		}
    let currVal = payload && payload[key];
    if (!currVal) {
      return false;
    }
    switch (operator) {
      case 'equals':
        return value == currVal;
      case 'contains':
        return value.includes(currVal);
    }
  };
};
