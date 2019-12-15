<template>
  <form action>
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
          <b-input type="textarea" placeholder="Fall Edition"></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary">Publish</button>
      </footer>
    </div>
  </form>
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
  }
};
</script>

<style>
</style>