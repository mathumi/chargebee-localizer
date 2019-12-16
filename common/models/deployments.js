"use strict";
const operators = {
  is: (a, b) => `(${JSON.stringify(b)}==\`\${${a}\}\`)`,
  contains: (a, b) => `(${JSON.stringify(b)}.includes(\`\${${a}\}\`))`
};

module.exports = function(Deployments) {
  Deployments.disableRemoteMethod("create", true);

  Deployments.remoteMethod("createDeployment", {
    description: "Create a deployment",
    accepts: [
      {
        arg: "data",
        type: "object",
        http: { source: "body" },
        required: true,
        description: "rules"
      }
    ],
    returns: { arg: "deployment", type: "object", root: true },
    http: { path: "/", verb: "post", errorStatus: 400 }
  });
  Deployments.createDeployment = async function(data) {
    const { id, name, value, priority, rules, comment } = data;
    let deployment;
    let evalCondition = rules
      .map(rule => {
        const { attribute, value, operator } = rule;
        return operators[operator](attribute, value);
      })
      .join(" && ");

    const rawRules = JSON.stringify(rules);
    if (id) {
      deployment = await Deployments.findById(id);

      deployment = await deployment.updateAttributes({
        priority,
        value,
        condition: evalCondition,
        raw_condition: rawRules,
        comment
      });
    } else {
      deployment = await Deployments.create({
        name,
        value,
        priority,
        enabled: true,
        raw_condition: rawRules,
        condition: evalCondition,
        comment
      });
    }

    return deployment;
  };

  Deployments.remoteMethod("deleteDeployment", {
    description: "Delete a deployment",
    accepts: [
      {
        arg: "deploymentId",
        type: "number",
        required: true,
        description: "deployment id"
      }
    ],
    returns: { arg: "deployment", type: "object", root: true },
    http: { path: "/:deploymentId", verb: "delete", errorStatus: 400 }
  });
  Deployments.deleteDeployment = async function(deploymentId) {
    const deployment = await Deployments.findById(deploymentId);
    if (!deployment) throw new Error("Deployment not found");

    await deployment.destroy();
    return { success: true };
  };

  Deployments.observe("before save", async function(ctx) {
    const instance = ctx.instance || ctx.currentInstance;
    if (instance) instance.updated_at = new Date();

    return;
  });
};
