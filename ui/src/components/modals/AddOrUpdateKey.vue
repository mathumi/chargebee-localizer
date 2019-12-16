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
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">New Key</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Text">
            <b-input type="text" v-model="value" placeholder="Getting Started" required></b-input>
          </b-field>
          <b-field label="Key">
            <b-input type="text" v-model="key" placeholder="getting_started" required></b-input>
          </b-field>
          <b-field label="Locale">
            <b-input type="text" v-model="locale" placeholder="en" required></b-input>
          </b-field>
          <b-field label="Description">
            <b-input type="textarea" v-model="description" placeholder="Text used in title areas"></b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <b-button type="is-primary" @click="addKey" :loading="loading">Add Key</b-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { textService } from "@/services";

export default {
  name: "AddKey",
  props: ["versionId", "collectionId", "branchId"],
  components: {},
  data() {
    return {
      isNewKeyModalActive: false,
      key: "",
      value: "",
      locale: "",
      description: "",
      loading: false
    };
  },
  methods: {
    openModal() {
      this.isNewKeyModalActive = true;
    },
    addKey() {
      this.loading = true;
      textService
        .createOrUpdateText({
          key: this.key,
          value: this.value,
          locale: this.locale,
          description: this.description,
          ...this.$props
        })
        .then(() => {
          this.$emit("reset");
          this.reset();
          this.isNewKeyModalActive = false;
        })
        .catch(this.$error)
        .finally(() => {
          this.loading = false;
        });
    },
    reset() {
      this.key = "";
      this.value = "";
      this.locale = "";
      this.description = "";
    }
  }
};
</script>

<style>
</style>