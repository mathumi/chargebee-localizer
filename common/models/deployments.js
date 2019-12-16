'use strict';
const operators = {
  is: (a, b) => `(${JSON.stringify(b)}==\`\${data.${a}\}\`)`,
  contains: (a, b) => `(${JSON.stringify(b)}.includes(\`\${data.${a}\}\`))`,
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
    const { id, name, key, value, priority, rules, comment } = data;
    let deployment;
    let evalCondition 

    evalCondition = rules.length ? rules.map(rule => {
      const { attribute, value, operator } = rule
      return operators[operator](attribute, value)
    }).join(' && ') : "true"

    const rawRules = JSON.stringify(rules)
    if(id) {
      deployment = await Deployments.findById(id);

      deployment = await deployment.updateAttributes({
        priority,
        value,
        condition: evalCondition,
        raw_condition: rawRules,
        comment,
      })

    } else {
      deployment = await Deployments.create({
        name,
        key,
        value,
        priority,
        enabled: true,
        raw_condition: rawRules,
        condition: evalCondition,
        comment,
      })
    }

    return deployment;
  }

  Deployments.remoteMethod('deleteDeployment', {
    description: 'Delete a deployment',
    accepts: [
      {
        arg: 'deploymentId',
        type: 'number',
        required: true,
        description: 'deployment id',
      },
    ],
    returns: {arg: 'deployment', type: 'object', root: true},
    http: {path: '/:deploymentId', verb: 'post', errorStatus: 400},
  });
  Deployments.deleteDeployment = async function(deploymentId) {
    const deployment = await Deployments.findById(deploymentId)
    if(!deployment) throw new Error('Deployment not found')

    await deployment.destroy()
    return { success: true }
  }

  function match(data, deployment) {
    try {
      return eval(deployment.condition)
    } catch(e) {
      console.error(e)
      return false
    }
  }

  Deployments.remoteMethod('match', {
    description: 'Match deployment rules',
    accepts: [
      { arg: 'payload', type: 'object', required: true, description: 'payload', http: {source: 'body'}, },
    ],
    returns: {arg: 'value', type: 'object', root: true},
    http: {path: '/match', verb: 'post', errorStatus: 400},
  });
  Deployments.match = async function(data) {
    const key = 'app.copy.version'
    const deployments = await Deployments.find({
      where: {
        and: [ {key}, {enabled: true} ]
      }, 
      order: 'priority DESC'
    })
		
    for (let i in deployments) {
      const deployment = deployments[i]
      if (match(data, deployment)) {
        return { value: deployment.value }
      }
    }

    throw new Error('No deployment matches found');
  }

  Deployments.observe("before save", async function (ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
