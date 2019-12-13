<template>
  <div class="collection-detail">
      <h3 class="va-mid">
        Collections -
      </h3>
       <div class="va-mid">
          <h3 v-if="!editName"><a @click="openEdit()">{{ collectionName }}</a></h3>
          <b-input
            v-else
            placeholder="Name of your collection"
            type="text"
          ></b-input>
        </div>
  </div>
</template>

<script>
export default {
  methods: {
    openEdit: function() {
      this.editName = true;
    }
  },

  data() {
    return {
      collectionName: "API Keys",
      editName: false
    };
  }
};
</script>

<style lang="scss" scoped></style>
