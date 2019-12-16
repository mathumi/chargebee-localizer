<template>
  <div>
    <b-button type="is-primary " class="mar--l-mi" @click="openDeployModal">Deploy</b-button>
    <div>List of Deployments</div>
    <b-modal :active.sync="isNewDeployModalActive" :width="640">
      <deploy-modal />
    </b-modal>
  </div>
</template>

<script>
import DeployModal from "@/components/modals/Deploy.vue";

export default {
  data() {
    return {
      isNewDeployModalActive: false
    };
  },
  components: {
    DeployModal
  },
  methods: {
    openDeployModal() {
      this.isNewDeployModalActive = true;
    }
  }
};
</script>

<style>
</style>