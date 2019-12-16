<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Deploy</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Name">
        <b-input type="text" v-model="displayName" placeholder="Dev deployment" required></b-input>
      </b-field>
      <b-field label="Version">
        <b-input type="text" v-model="value" placeholder="cb-vue-1.0.0" required></b-input>
      </b-field>
      <b-field label="Priority">
        <b-input type="number" v-model="priority" placeholder="2" required></b-input>
      </b-field>
      <b-input type="textarea" v-model="comment" placeholder="Leave your comments here."></b-input>
      <div>
        <div class="mar--t-sm">
          <p>Rules</p>
          <b-button type="is-primary" @click="addRule">Add rule</b-button>
        </div>
        <new-rule
          v-for="(rule,index) in rules"
          :key="index"
          :index="index"
          @remove="removeRule(index)"
          @data="updateRuleData"
        />
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-primary">Deploy</button>
    </footer>
  </div>
</template>

<script>
import NewRule from "@/components/NewRule.vue";
export default {
  name: "NewDeploy",
  components: { NewRule },
  data() {
    return {
      name: "app.copy.version",
      displayName: "",
      value: "",
      priority: 0,
      comment: "",
      rules: []
    };
  },
  methods: {
    addRule() {
      this.rules.push({});
    },
    removeRule(index) {
      this.rules.splice(this.rules[data.index], 1);
    },
    updateRuleData(data) {
      this.rules[data.index] = data;
    }
  }
};
</script>

<style></style>
