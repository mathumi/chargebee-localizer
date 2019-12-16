<template>
  <div>
    <div class="flex">
      <div class="is-size-3 mar--b-sm flex-grow">Deployments</div>
      <b-button
        type="is-primary deploy-button"
        icon-left="plus"
        class="mar--l-mi"
        @click="openDeployModal"
      >Create Deployment</b-button>
    </div>
    <div class="deploy-item" v-for="data in deployments" :key="data.value">
      <h3>{{data.name}}</h3>
      <div>
        <b>Version:</b>
        {{ data.value }}
      </div>
      <div>
        <b>Priority:</b>
        {{ data.priority }}
      </div>
      <div>{{ data.comment }}</div>
      <b-table :data="data.rules">
        <template slot-scope="props">
          <b-table-column label="Attribute">{{ props.row.attribute }}</b-table-column>
          <b-table-column label="Operator">{{ props.row.operator }}</b-table-column>
          <b-table-column label="Value">{{ props.row.value}}</b-table-column>
        </template>
      </b-table>
    </div>
    <b-modal :active.sync="isNewDeployModalActive" :width="640">
      <deploy-modal @reset="fetchDeployments" />
    </b-modal>
  </div>
</template>

<script>
import DeployModal from "@/components/modals/Deploy.vue";

import { deploymentService } from "@/services";

export default {
  data() {
    return {
      deploySchema: [
        {
          name: "deploy",
          key: "app.copy.version",
          value: "copy-1.0.0",
          priority: 2,
          comment: "hello",
          rules: [
            {
              attribute: "environment",
              value: "predev",
              operator: "is"
            },
            {
              attribute: "ui_version",
              value: "cb-vue-1.0.0",
              operator: "is"
            },
            {
              attribute: "domain",
              value: "mannar-test,mannar",
              operator: "contains"
            }
          ]
        },
        {
          name: "app.copy.version",
          value: "copy-2.0.0",
          priority: 2,
          comment:
            "hello hellohellohellohellohello hellohello hellohello hello",
          rules: [
            {
              attribute: "environment",
              value: "predev",
              operator: "is"
            },
            {
              attribute: "ui_version",
              value: "cb-vue-1.0.0",
              operator: "is"
            },
            {
              attribute: "domain",
              value: "mannar-test,mannar",
              operator: "contains"
            }
          ]
        }
      ],
      isNewDeployModalActive: false,
      deployments: []
    };
  },
  components: {
    DeployModal
  },
  methods: {
    openDeployModal() {
      this.isNewDeployModalActive = true;
    },
    fetchDeployments() {
      deploymentService
        .getDeployments()
        .then(result => {
          this.deployments = result.map(deploy => {
            return {
              ...deploy,
              rules: JSON.parse(deploy.raw_condition || [])
            };
          });
        })
        .catch(this.$error);
    }
  },
  mounted() {
    this.fetchDeployments();
  }
};
</script>

<style lang="scss">
.deploy-item {
  padding-bottom: 30px;
  margin-top: 15px;
  padding-left: 0;
  padding-right: 0;
  &:not(:last-child) {
    border-bottom: 2px solid #dbdbdb;
  }
  table {
    border: 1px solid #dbdbdb !important;
    padding: 4px 15px;
    margin-top: 12px;
  }
}
.deploy-button {
  min-width: 110px;
  height: 36px;
}
</style>
