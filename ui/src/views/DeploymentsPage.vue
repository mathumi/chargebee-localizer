<template>
  <div>
    <b-button type="is-primary " class="mar--l-mi" @click="openDeployModal">Deploy</b-button>
    <div>List of Deployments</div>
  </div>
</template>

<script>
import DeployModal from "@/components/modals/Deploy.vue";

export default {
  components: {
    DeployModal
  },
  methods: {
    openDeployModal(){
      this.isNewDeployModalActive = true
    }
  }
};
</script>

<style>
</style>