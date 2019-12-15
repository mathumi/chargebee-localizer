<template>
  <div class="container">
    <div class="brach-nav">
      <b-tabs type="is-toggle">
        <b-tab-item label="All" class="mar--t-md">
          <BranchPanel :data="defaultBranch" title="Default Branch" :icon="true" />
          <BranchPanel class="mar--t-lg" :data="otherBranches" title="Other Branches" />
        </b-tab-item>
        <b-tab-item label="Published">
          <br />
          <BranchPanel v-if="publishedBranches.length" :data="publishedBranches" title="Published Branches" />
          <div v-else>No Published Found</div>
        </b-tab-item>
        <b-tab-item label="In Draft">
          <br />
          <BranchPanel :data="draftBranches" title="In Draft Branches" />
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import BranchPanel from "@/components/BranchPanel.vue";

export default {
  name: "Branches",
  components: {
    BranchPanel
  },
  data() {
    return {};
  },
  computed: {
    defaultBranch() {
      return this.allBranches.filter(branch => branch.name.toLowerCase() == "master");
    },
    otherBranches() {
      return this.allBranches.filter(branch => branch.name.toLowerCase() != "master");
    },
    allBranches() {
      return this.$store.state.branches || [];
    },
    draftBranches() {
      return this.allBranches.filter(branch => Boolean(branch.draft_version));
    },
    publishedBranches() {
      return this.allBranches.filter(branch => !Boolean(branch.draft_version));
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>

</style>
