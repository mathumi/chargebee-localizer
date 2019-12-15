<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">New Collection</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Collection Name">
        <b-input type="text" v-model="collectionName" placeholder="Snap" required></b-input>
      </b-field>
      <b-field label="Collection Handle">
        <b-input type="text" :value="collectionHandle" placeholder="snap" readonly></b-input>
      </b-field>
      <b-field label="Description">
        <b-input type="textarea" v-model="description" placeholder="Super snappingly scalable"></b-input>
      </b-field>
      <b-field label="Locale Name">
        <b-input type="text" v-model="localeName" placeholder="en" required></b-input>
      </b-field>
      <b-field label="Collections">
        <b-upload drag-drop v-model="collectionFile">
          <section class="section">
            <div class="content has-text-centered">
              <template v-if="!collectionFile">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
                <p>Drop your translation file here</p>
              </template>
              <p v-else>
                You have uploaded
                <strong>{{ collectionFile.name }}</strong>
              </p>
            </div>
          </section>
        </b-upload>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button type="is-primary" @click="createCollection" :loading="loading">Create</b-button>
    </footer>
  </div>
</template>

<script>
import { collectionService } from "@/services";

export default {
  name: "NewCollection",
  props: ["selectedBranchData"],
  data() {
    return {
      loading: false,
      description: "",
      collectionName: "",
      localeName: "",
      collectionFile: null
    };
  },
  computed: {
    collectionHandle() {
      return this.collectionName
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .toLowerCase()
        .replace(/ /g, "_");
    }
  },
  methods: {
    createCollection() {
      this.loading = true;
      collectionService
        .createCollection(
          this.selectedBranchData.id,
          this.selectedBranchData.draft_version,
          {
            name: this.collectionName,
            handle: this.collectionHandle,
            description: this.description,
            file: this.collectionFile,
            locale: this.localeName
          },
          { "Content-Type": "multipart/form-data" }
        )
        .then(() => {
          this.$success("Collection created");
          this.$store.dispatch("init");
          this.$parent.close();
          // TODO
          // this.$router.push(
          //   `/blob/${this.selectedBranchData.name}/mock_collection_1`
          // );
        })
        .catch(this.$error)
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>