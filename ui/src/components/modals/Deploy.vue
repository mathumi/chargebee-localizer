<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Deploy {Release Name}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Release Target">
        <b-select v-model="selectedEnv">
          <option v-for="env in environments" value="dev" key="dev">
            {{
            env
            }}
          </option>
        </b-select>
      </b-field>

      <b-field label="Domains">
        <b-input type="text" :value="domain" placeholder="Domain name"></b-input>
      </b-field>

      <b-field label="Comment">
        <b-input type="textarea" v-model="comment" placeholder="Comment"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-primary">Deploy</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "NewBranch",
  data() {
    return {
      selectedEnv: "dev",
      comment: "",
      domain: "",
      environments: ["dev", "staging", "prod"]
    };
  },
  methods: {}
};
</script>

<style></style>
