<template>
  <div>
    <!-- <section class="columns">
      <div class="column"></div>
      <div class="column"></div>
      <b-button
        type="is-primary"
        icon-left="source-branch"
        @click="openNewBranchModal"
        >New Branch</b-button
      >
      <b-modal :active.sync="isNewBranchModalActive" :width="640">
        <NewBranch
          :resourceBranches="resourceBranches"
          :selectedBranchId="selectedBranchId"
        />
      </b-modal>
    </section>-->

    <section>
      <b-tabs v-model="activeTab">
        <div class="nav-block">
          <div class="flex ai-center">
            <b-select
              :value="selectedBranchId"
              @input="updateselectedBranchId"
              icon="source-branch"
            >
              <option
                v-for="filter in resourceBranches"
                :value="filter.id"
                :key="filter.id"
              >{{ filter.name }}</option>
            </b-select>
            <b-button
              type="is-primary"
              class="mar--l-xs"
              icon-left="source-branch"
              @click="openNewBranchModal"
            >New Branch</b-button>
          </div>
          <b-button
            class="float-right"
            type="is-primary"
            outlined
            icon-left="file-document-box-plus-outline"
            @click="openNewCollectioModal"
          >Add Collection</b-button>
        </div>
        <Collections :branchId="selectedBranchId" />
      </b-tabs>
    </section>
    <b-modal :active.sync="isNewBranchModalActive" :width="640">
      <NewBranch :resourceBranches="resourceBranches" :selectedBranchId="selectedBranchId" />
    </b-modal>
    <b-modal :active.sync="isNewCollectionModalActive" :width="640">
      <NewCollection />
    </b-modal>
  </div>
</template>

<script>
import Collections from "@/components/branch/tabs/Collections";
import NewBranch from "@/components/modals/NewBranch.vue";
import NewCollection from "@/components/modals/NewCollection.vue";

export default {
  components: {
    Collections,
    NewBranch,
    NewCollection
  },
  data() {
    return {
      activeTab: 0,
      showTabs: false,
      selectedBranchId: 10,
      isNewBranchModalActive: false,
      isNewCollectionModalActive: false
    };
  },
  computed: {
    resourceBranches() {
      return this.$store.state.branches;
    },
    selectedBranchData() {
      return this.$store.state.branches.find(
        branch => branch.id === this.selectedBranchId
      );
    }
  },
  mounted() {
    const urlPaths = window.location.href.split("tree");
    if (urlPaths.length === 2) {
      this.selectedBranchId = urlPaths[1].slice(1);
    }
    this.sanityResCheck();
  },
  methods: {
    sanityResCheck() {
      if (
        this.resourceBranches.findIndex(f => f.id === this.selectedBranchId) ===
        -1
      ) {
        this.selectedBranchId = 10;
      }
    },

    updateselectedBranchId(newValue) {
      if (newValue) {
        this.$router.replace(`/tree/${newValue}`);
      }
    },
    openNewBranchModal() {
      this.isNewBranchModalActive = true;
    },
    openNewCollectioModal() {
      this.isNewCollectionModalActive = true;
    }
  }
};
</script>

<style lang="scss">
.button.is-text:hover {
  background-color: transparent !important;
}
.nav-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin: 10px 0 30px;
  border-bottom: 1px solid #dbdbdb;
  padding-bottom: 30px;
}

.notification {
  i:before {
    font-size: 24px !important;
  }
  padding: 8px 20px;
  width: 100%;
  font-size: 14px;
}
</style>
