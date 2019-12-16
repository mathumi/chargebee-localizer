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
      <h3>{{ data.name }}</h3>
      <div>{{ data.comment }}</div>

      <div class="flex mar--t-st">
        <div class="flex-grow">
          <div v-for="(rule, index) in data.rules" class="mar--b-xs deploy-tags">
            <span class="tag is-light tag-attribute">
              {{
              rule.attribute
              }}
            </span>
            <span class="tag is-light tag-operator">{{ rule.operator }}</span>
            <span class="tag is-light tag-value">{{ rule.value }}</span>
            <span v-if="index !== data.rules.length - 1">
              <b>AND</b>
            </span>
          </div>
        </div>
        <div class="flex-grow">
          <div>
            <b>Version:</b>
            {{ data.value }}
          </div>
          <div>
            <b>Priority:</b>
            {{ data.priority }}
          </div>
        </div>
        <div class="text-right">
          <b-button
            type="is-primary deploy-button"
            class="mar--l-mi"
            outlined
            @click="openDeployModal"
          >Update Deployment</b-button>
        </div>
      </div>
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
  margin-top: 30px;
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
.deploy-tags {
  .tag {
    background-color: #f9f6f6 !important;
    font-size: 14px;
    margin-right: 12px;
    &- {
      &attribute {
        color: #336911 !important;
      }
      &operator {
        color: #0c1369 !important;
      }
      &value {
        color: #3367d6 !important;
      }
    }
  }
}
</style>
