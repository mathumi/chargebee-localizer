<template>
  <form action>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New Release</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Release Tag">
          <b-input type="text" placeholder="v1.0.0" required></b-input>
        </b-field>
        <b-field label="Release Target">
          <b-select :value="selectedBranch" icon="source-branch">
            <option v-for="branch in branches" :value="branch.id" :key="branch.id">{{ branch.name }}</option>
          </b-select>
        </b-field>

        <b-field label="Description">
          <b-input type="textarea" placeholder="Super snappingly scalable"></b-input>
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
  name: "NewBranch",
  props: ["selectedBranch", "branches"]
};
</script>

<style>
</style>