<template>
  <div class="collections">
    <div class="collection">
      <b-table :data="data">
        <template slot-scope="props">
          <b-table-column label="Collections">
            <!-- <img class="collection__img" src="@/assets/images/folder.png" /> -->
            <router-link
              :to="`/blob/${branchName}/${props.row.handle}`"
              class="collection__profile"
            >
              <b-icon class="collection__img" icon="file-document-box"></b-icon>
              <div class="collection__name">{{ props.row.name }}</div>
            </router-link>
          </b-table-column>
          <b-table-column label="Description">{{ props.row.description }}</b-table-column>
          <b-table-column label="No of Keys">{{ props.row.keyCount }}</b-table-column>
          <b-table-column label="Last updated on" centered>{{ props.row.createdAt }}</b-table-column>
        </template>
      </b-table>
      <div v-if="data.length === 0">No collections found.</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data", "branchName"],
  data() {
    return {};
  },
  computed: {}
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
