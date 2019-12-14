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
          :selectedBranch="selectedBranch"
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
        <div class="nav-block">
          <div class="flex ai-center">
          <b-select
            :value="selectedResource"
            @input="updateSelectedResource"
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
            >New Branch</b-button
          >
          </div>
          <b-button
            class="float-right"
            type="is-primary"
            outlined
            icon-left="file-document-box-plus-outline"
            @click="openNewCollectioModal"
            >Add Collection</b-button
          >
        </div>
        <Collections />
      </b-tabs>
    </section>
    <b-modal :active.sync="isNewBranchModalActive" :width="640">
      <NewBranch :resourceBranches="resourceBranches" :selectedBranch="selectedBranch" />
    </b-modal>
    <b-modal :active.sync="isNewCollectionModalActive" :width="640">
      <NewCollection

      />
    </b-modal>
  </div>
</template>

<script>
import Collections from "@/components/branch/tabs/Collections";
import Branches from "@/components/branch/tabs/Branches";
import Releases from "@/components/branch/tabs/Releases";
import NewBranch from "@/components/modals/NewBranch.vue";
import NewCollection from "@/components/modals/NewCollection.vue";

export default {
  components: {
    Collections,
    Branches,
    Releases,
    NewBranch,
    NewCollection
  },
  data() {
    return {
      activeTab: 0,
      showTabs: false,
      selectedResource: "master",
      isNewBranchModalActive: false,
      isNewCollectionModalActive: false,
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
  computed: {
    resourceBranches() {
      return this.$store.getters.branches;
    }
  },
  mounted() {
    const urlPaths = window.location.href.split("tree");
    if (urlPaths.length === 2) {
      this.selectedBranch = urlPaths[1].slice(1);
    }
    this.sanityResCheck();
  },
  methods: {
    sanityResCheck() {
      if (
        this.resourceBranches.findIndex(f => f.id === this.selectedBranch) ===
        -1
      ) {
        this.selectedBranch = "master";
      }
    },

    updateselectedBranch(newValue) {
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
    font-size: $fs_h3 !important;
  }
  padding: $space_mi $space_st;
  width: 100%;
  font-size: $fs_body;
}
</style>
