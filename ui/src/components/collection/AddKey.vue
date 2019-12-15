<template>
  <div>
    <b-button
      class="float-right"
      type="is-primary"
      outlined
      icon-left="key-variant"
      @click="openModal"
    >Add Key</b-button>
    <b-modal :active.sync="isNewKeyModalActive" :width="640">
      <new-key />
    </b-modal>
  </div>
</template>

<script>
import NewKey from "@/components/modals/NewKey.vue";

export default {
  name: "AddKey",
  components: {
    NewKey
  },
  data() {
    return {
      isNewKeyModalActive: false
    };
  },
  methods: {
    openModal() {
      this.isNewKeyModalActive = true;
    }
  }
};
</script>

<style>
</style>