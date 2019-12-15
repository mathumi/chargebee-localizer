<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Publish Branch</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Release Name">
        <b-input type="text" v-model="releaseName" placeholder="Winter Release" required></b-input>
      </b-field>
      <b-field label="Release Id">
        <b-input type="text" :value="releaseId" placeholder="winter_release" readonly></b-input>
      </b-field>
      <b-field label="Description">
        <b-input type="textarea" v-model="description" placeholder="Fall Edition"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-primary" :loading="loading" @click="createRelease">Publish</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "NewRelease",
  props: ["branchId"],
  data() {
    return {
      releaseName: "",
      description: "",
      loading: false
    };
  },
  computed: {
    releaseId() {
      return this.releaseName
        .replace(/[^a-zA-Z ]/g, "")
        .toLowerCase()
        .replace(/ /g, "_");
    }
  },
  methods: {
    createRelease() {
      this.loading = true;
      const newRelease = {
        name: this.releaseId,
        description: this.description
      };

      this.$store
        .dispatch("publishDraftBranch", {
          id: this.branchId,
          payload: newRelease
        })
        .then(() => {
          this.$success("Branch published");
          this.$parent.close();
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