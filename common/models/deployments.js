'use strict';
const operators = {
  is: (a, b) => `(${JSON.stringify(b)}==\`\${${a}\}\`)`,
  contains: (a, b) => `(${JSON.stringify(b)}.includes(\`\${${a}\}\`))`,
}

module.exports = function(Deployments) {
  Deployments.disableRemoteMethod("create", true);

  Deployments.remoteMethod('createDeployment', {
    description: 'Create a deployment',
    accepts: [
      {
        arg: 'data',
        type: 'object',
        http: {source: 'body'},
        required: true,
        description: 'rules',
      },
    ],
    returns: {arg: 'deployment', type: 'object', root: true},
    http: {path: '/', verb: 'patch', errorStatus: 400},
  });
  Deployments.createDeployment = async function(data) {
    const { name, value, priority, rules, comment } = data;
    let evalCondition = rules.map(rule => {
      const { attribute, value, operator } = rule
      return operators[operator](attribute, value)
    }).join(' && ')
    
    const deployment = await Deployments.create({
      name,
      value,
      priority,
      enabled: true,
      raw_condition: JSON.stringify(rules),
      condition: evalCondition,
      comment,
    })

    return deployment;
  }

  Deployments.observe("before save", async function (ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
