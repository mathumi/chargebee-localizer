<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">New Branch</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Branch Name">
        <b-input type="text" v-model="branchName" placeholder="Account Hierarchy" required></b-input>
      </b-field>
      <b-field label="Branch Id">
        <b-input type="text" :value="branchId" placeholder="account_hierarchy" readonly></b-input>
      </b-field>
      <b-field label="Fork From">
        <b-select v-model="fromBranch" icon="source-branch">
          <option
            v-for="branch in (branches ||[])"
            :value="branch.name"
            :key="branch.id"
          >{{ branch.name }}</option>
        </b-select>
      </b-field>

      <b-field label="Description">
        <b-input
          v-model="description"
          type="textarea"
          placeholder="Super snappingly scalable"
          required
        ></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button type="is-primary" @click="createBranch" :loading="loading">Create</b-button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "NewBranch",
  props: ["selectedBranchData", "branches"],
  data() {
    return {
      branchName: "",
      fromBranch: this.selectedBranchData.name,
      description: "",
      loading: false
    };
  },
  computed: {
    branchId() {
      return this.branchName
        .replace(/[^a-zA-Z_ ]/g, "")
        .toLowerCase()
        .replace(/ /g, "_");
    }
  },
  methods: {
    createBranch() {
      this.loading = true;
      const newBranch = {
        name: this.branchId,
        fromBranch: this.selectedBranchData.id,
        description: this.description
      };

      this.$store
        .dispatch("createBranch", newBranch)
        .then(() => {
          this.$success("Branch created");
          this.$parent.close();
          this.$router.push(`/tree/${newBranch.name}`);
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