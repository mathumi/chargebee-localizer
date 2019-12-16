<template>
  <div class="flex">
    <b-field>
      <b-select placeholder="Operator">
        <option
          v-for="option in data"
          :value="option.id"
          :key="option.id"
        >{{ option.user.first_name }}</option>
      </b-select>
    </b-field>

    <b-field>
      <b-select placeholder="Operand">
        <option
          v-for="option in data"
          :value="option.id"
          :key="option.id"
        >{{ option.user.first_name }}</option>
      </b-select>
    </b-field>

    <b-field>
      <b-input v-model="name" placeholder="Value"></b-input>
    </b-field>
  </div>
</template>

<script>
export default {
  name: "NewRule",
  data() {
    return {
      value: "",
      operators: [
        { name: "Is", id: "is" },
        { name: "Contains", id: "contains" }
      ],
      operands: [
        {
          id: "environment",
          name: "Environment"
        }
      ]
    };
  }
};
</script>

<style>
</style>