<template>
  <form action>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New Branch</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Branch Name">
          <b-input type="text" placeholder="feature/snap" required></b-input>
        </b-field>
        <b-field label="Fork From">
          <b-select :value="selectedResource" icon="source-branch">
            <option
              v-for="filter in resourceFilters"
              :value="filter.id"
              :key="filter.id"
            >{{ filter.name }}</option>
          </b-select>
        </b-field>

        <b-field label="Description">
          <b-input type="textarea" placeholder="Super snappingly scalable"></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary">Create</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: "NewBranch",
  props: ["selectedResource", "resourceFilters"]
};
</script>

<style>
</style>