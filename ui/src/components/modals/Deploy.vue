<template>
  <div class="modal-card deploy-modal">
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
        <b-input type="text" v-model="priority" placeholder="2" required></b-input>
      </b-field>
      <b-input type="textarea" v-model="comment" placeholder="Leave your comments here."></b-input>
      <div class="deploy-rules">
        <div class="mar--t-sm mar--b-sm">
          <b>Rules</b>
        </div>
        <new-rule
          v-for="(rule,index) in rules"
          :key="index"
          :index="index"
          @remove="removeRule(index)"
          @data="updateRuleData"
        >
          <b-button slot="newRule" class="mar--l-mi"  v-if="index===rules.length-1" type="is-primary" @click="addRule">Add rule</b-button>
        </new-rule>
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
  name: "NewBranch",
  components: { NewRule },
  data() {
    return {
      name: "app.copy.version",
      displayName: "",
      value: "",
      priority: 0,
      comment: "",
      rules: [
        {
          attribute: "environment",
          value: "predev",
          operator: "is"
        }
      ]
    };
  },
  methods: {
    addRule() {
      this.rules.push({
        ...this.rules[0]
      });
    },
    removeRule(index) {
      this.rules = this.rules.splice(index, 1);
    }
  }
};
</script>

<style lang="scss">
.deploy-rules{
  .field {
  &:not(:last-child){
    margin-right: 8px;
    margin-bottom: 0;
  }
}
}
</style>
