<template>
  <div>
    <section>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Collections" icon="package">
          <div class="block">
            <b-select
              :value="selectedResource"
              @input="updateSelectedResource"
              icon="source-branch"
            >
              <option
                v-for="filter in resourceFilters"
                :value="filter.id"
                :key="filter.id"
              >{{ filter.name }}</option>
            </b-select>

            <b-button
              type="is-primary"
              icon-left="source-branch"
              @click="openNewBranchModal"
            >New Branch</b-button>
          </div>
          <Collections />
        </b-tab-item>
        <b-tab-item label="Branches" icon="source-branch">
          <Branches />
        </b-tab-item>
        <b-tab-item label="Releases" icon="tag">
          <Releases :branches="resourceFilters" />
        </b-tab-item>
      </b-tabs>
    </section>
    <b-modal :active.sync="isNewBranchModalActive" :width="640">
      <NewBranch :resourceFilters="resourceFilters" :selectedResource="selectedResource" />
    </b-modal>
  </div>
</template>

<script>
import Collections from "@/components/branch/tabs/Collections";
import Branches from "@/components/branch/tabs/Branches";
import Releases from "@/components/branch/tabs/Releases";
import NewBranch from "@/components/modals/NewBranch.vue";

export default {
  components: {
    Collections,
    Branches,
    Releases,
    NewBranch
  },
  data() {
    return {
      activeTab: 0,
      showTabs: false,
      selectedResource: "master",
      isNewBranchModalActive: false,
      resourceFilters: [
        {
          name: "master",
          id: "master"
        },
        {
          name: "feature/shipping_charges",
          id: "feature/shipping_charges"
        },
        {
          name: "feature/salesforce",
          id: "feature/salesforce"
        }
      ]
    };
  },
  mounted() {
    const urlPaths = window.location.href.split("tree");
    if (urlPaths.length === 2) {
      this.selectedResource = urlPaths[1].slice(1);
    }
    this.sanityResCheck();
  },
  methods: {
    sanityResCheck() {
      if (
        this.resourceFilters.findIndex(f => f.id === this.selectedResource) ===
        -1
      ) {
        this.selectedResource = "master";
      }
    },

    updateSelectedResource(newValue) {
      if (newValue) {
        this.$router.replace(`/tree/${newValue}`);
      }
    },
    openNewBranchModal() {
      this.isNewBranchModalActive = true;
    }
  }
};
</script>

<style lang="scss">
.block {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>