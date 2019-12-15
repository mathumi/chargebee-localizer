<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Update Collection</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Collection Name">
        <b-input type="text" v-model="collectionName" placeholder="Snap" required></b-input>
      </b-field>
      <b-field label="Collection Handle">
        <b-input type="text" :value="collectionData.handle" placeholder="snap" readonly></b-input>
      </b-field>
      <b-field label="Description">
        <b-input type="textarea" v-model="description" placeholder="Super snappingly scalable"></b-input>
      </b-field>
      <b-field label="Locale Name">
        <b-input type="text" v-model="localeName" placeholder="en" required></b-input>
      </b-field>
      <div class="field">
        <b-checkbox v-model="overwrite">Overwrite matching existing keys</b-checkbox>
      </div>
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
      <b-button type="is-primary" @click="updateCollection" :loading="loading">Update</b-button>
    </footer>
  </div>
</template>

<script>
import { collectionService } from "@/services";

export default {
  name: "UpdateCollection",
  props: ["collectionData", "selectedBranchData"],
  data() {
    return {
      loading: false,
      description: this.collectionData.description,
      collectionName: this.collectionData.name,
      localeName: "",
      overwrite: false,
      collectionFile: null
    };
  },
  computed: {},
  methods: {
    updateCollection() {
      collectionService
        .updateCollection(
          this.selectedBranchData.id,
          this.selectedBranchData.draft_version,
          this.collectionData.id,
          {
            name: this.collectionName,
            overwrite: this.overwrite,
            description: this.description,
            file: this.collectionFile,
            locale: this.localeName
          },
          { "Content-Type": "multipart/form-data" }
        )
        .then(() => {
          this.$success("Collection updated");
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