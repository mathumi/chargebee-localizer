<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Deploy</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Version">
        <b-input type="text" v-model="collectionName" placeholder="cb-vue-1.0.0" required></b-input>
      </b-field>
      <b-field label="Priority">
        <b-input type="text" v-model="collectionName" placeholder="2" required></b-input>
      </b-field>
      <b-input type="textarea" v-model="collectionName" placeholder="Leave your commnets here."></b-input>
      <div>
        <div>
          <p>Rules</p>
          <b-button type="is-primary" @click="addNewRule">Add rule</b-button>
        </div>
        <new-rule v-for="(rule,index) in rules" :key="rule.id+index" />
      </div>
      <!-- <b-field label="Release Target">
        <b-select v-model="selectedEnv">
          <option v-for="env in environments" value="dev" key="dev">
            {{
            env
            }}
          </option>
        </b-select>
      </b-field>-->

      <!-- <b-field label="Domains">
        <b-input type="text" :value="domain" placeholder="Domain name"></b-input>
      </b-field>

      <b-field label="Comment">
        <b-input type="textarea" v-model="comment" placeholder="Comment"></b-input>
      </b-field>-->
    </section>
    <footer class="modal-card-foot">
      <button class="button is-primary">Deploy</button>
    </footer>
  </div>
</template>

<script>
import NewRule from "@/components/NewRule.vue";
export default {
  name: "NewBranch",
  components: { NewRule },
  data() {
    return {
      name: "app.copy.version",
      value: "",
      rules: [
        {
          id: 1,
          attribute: "environment",
          value: "predev",
          operator: "is"
        }
      ]
    };
  },
  methods: {
    addNewRule() {
      this.rules.push(this.rules[0])
    }
  }
};
</script>

<style></style>
