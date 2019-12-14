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
    <b-navbar class="navbar-secondary navbar-warning">
      <template slot="brand">
        <b-navbar-item class="fs-st">You have some unpublished changes which are saved as draft.</b-navbar-item>
      </template>
      <template slot="end">
        <b-button type="is-text" class="mar--r-mi" @click="openNewBranchModal">Discard</b-button>
        <b-button type="is-primary" @click="openNewBranchModal">Publish</b-button>
      </template>
    </b-navbar>

    <section>
      <b-tabs v-model="activeTab">
        <div class="block">
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
            class="float-right"
            type="is-primary"
            outlined
            icon-left="file-document-box-plus-outline"
            @click="openNewBranchModal"
          >Add Collection</b-button>
        </div>
        <Collections :branchId="selectedBranchId" />
      </b-tabs>
    </section>
    <b-modal :active.sync="isNewBranchModalActive" :width="640">
      <NewBranch :resourceBranches="resourceBranches" :selectedBranchId="selectedBranchId" />
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
      selectedBranchId: 10,
      isNewBranchModalActive: false
    };
  },
  computed: {
    resourceBranches() {
      return this.$store.getters.branches;
    },
    selectedBranchData() {
      return this.$store.getters.branches.find(
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
        this.resourceBranches.findIndex(
          f => f.id === this.selectedBranchId
        ) === -1
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
.navbar-secondary {
  margin-top: 1px;
  background-color: #f1f8ff !important;
  border-bottom: 1px solid #c8e1ff;
  box-shadow: none;
  padding: 4px 8px;
  align-items: center !important;
}

.navbar-warning {
  background: $warning;
}
.notification {
  i:before {
    font-size: $fs_h3 !important;
  }
  padding: $space_mi $space_st;
  width: 100%;
  font-size: $fs_body;
}
</style>
