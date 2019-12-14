<template>
  <div class="collections">
    <div class="collection">
      <b-table :data="collections">
        <template slot-scope="props">
          <b-table-column label="Collections">
            <!-- <img class="collection__img" src="@/assets/images/folder.png" /> -->
            <router-link to="/master/collection" class="collection__profile">
              <b-icon class="collection__img" icon="file-document-box"></b-icon>
              <div class="collection__name">{{ props.row.name }}</div>
            </router-link>
          </b-table-column>
          <b-table-column label="No of Keys">{{ props.row.keysCount }}</b-table-column>
          <b-table-column label="Last updated on" centered>{{ props.row.createdAt }}</b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["branchId"],
  data() {
    return {};
  },
  computed: {
    collections() {
      return this.$store.getters.branchCollections(this.branchId);
    }
  }
};
</script>
<style lang="scss" scoped>
.collection {
  &__ {
    &profile {
      display: flex;
      align-items: center;
    }
    &img {
      margin-right: 4px;
    }
    &name {
      font-size: 14px;
    }
    &desc {
      font-size: 12px;
    }
  }
}
</style>

<style lang="scss">
.collection table {
  //border: 1px solid#dbdbdb;
  th {
    //border-width: 1px !important;
  }
}
</style>
