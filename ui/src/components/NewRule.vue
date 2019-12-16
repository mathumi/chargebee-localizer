<template>
  <div class="flex ai-center mar--b-xs">
    <b-field>
      <b-select placeholder="Attributes" v-model="detail.attribute">
        <option v-for="attr in attributes" :value="attr.id" :key="attr.id">{{ attr.name }}</option>
      </b-select>
    </b-field>

    <b-field>
      <b-select placeholder="Condition" v-model="detail.condition">
        <option v-for="cond in operators" :value="cond.id" :key="cond.id">{{ cond.name }}</option>
      </b-select>
    </b-field>

    <b-field>
      <b-input v-model="detail.value" placeholder="Value"></b-input>
    </b-field>
    <!-- <b-icon class="cursor-pointer" @click="$emit('remove')" icon="delete"></b-icon> -->
    <slot name="newRule"></slot>
  </div>
</template>

<script>
export default {
  name: "NewRule",
  props: ["index"],
  data() {
    return {
      detail: {
        value: "",
        condition: "is",
        attribute: "environment"
      },
      operators: [
        {
          name: "Is",
          id: "is"
        },
        {
          name: "Contains",
          id: "contains"
        }
      ],
      attributes: [
        {
          id: "environment",
          name: "Environment"
        },
        {
          id: "ui_version",
          name: "UI Version"
        },
        {
          id: "domain",
          name: "Domain"
        }
      ]
    };
  },
  watch: {
    detail: {
      handler(data = {}) {
        this.$emit("data", {
          ...data,
          index: this.index
        });
      },
      deep: true
    }
  }
};
</script>

<style>
</style>