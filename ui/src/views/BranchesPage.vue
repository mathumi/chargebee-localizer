<template>
  <div class="container">
    <div class="mar--t-lg">
      <b-tabs type="is-toggle">
        <b-tab-item label="All"></b-tab-item>
        <b-tab-item label="Published"></b-tab-item>
        <b-tab-item label="In Draft"></b-tab-item>
      </b-tabs>
      <Panel :data="defaultBranch" title="Default Branch" />
    </div>
  </div>
</template>

<script>
import Panel from "@/components/Panel.vue";
export default {
  name: "Branches",
  components: {
    Panel
  },
  computed: {
    defaultBranch() {
      return {
        name: "master",
        description: "This is a base branch",
        publised_version: null,
        draft_version: "1000",
        created_at: "2019-12-14T18:48:08.000Z",
        updated_at: "2019-12-14T13:18:08.000Z",
        id: 1
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-heading {
  font-weight: 500;
  font-size: 16px;
}
</style>
