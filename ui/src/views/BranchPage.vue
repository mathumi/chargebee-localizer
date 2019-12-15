<template>
  <div v-if="selectedBranchData">
    <DraftAlert :draft="isBranchInDraftMode" :branchId="selectedBranchData.id" />
    <section>
      <div>
        <div class="nav-block">
          <div class="flex ai-center">
            <b-select
              :value="selectedBranchName"
              @input="updateSelectedBranch"
              icon="source-branch"
            >
              <option
                v-for="branch in branches"
                :value="branch.name"
                :key="branch.id"
              >{{ branch.name }}</option>
            </b-select>
            <b-button
              type="is-primary"
              class="mar--l-xs"
              icon-left="source-branch"
              @click="openNewBranchModal"
            >New Branch</b-button>
          </div>
          <div class="float-right">
            <b-button
              class="mar--r-mi"
              type="is-primary"
              outlined
              icon-left="file-document-box-plus-outline"
              @click="openReviewModal"
            >Merge with master</b-button>
            <b-button
              class="float-right"
              type="is-primary"
              outlined
              icon-left="file-document-box-plus-outline"
              @click="openNewCollectioModal"
            >Add Collection</b-button>
          </div>
        </div>
        <Collections v-if="selectedBranchData" :data="selectedBranchData.collections" />
      </div>
    </section>
    <b-modal :active.sync="isNewBranchModalActive" :width="640">
      <NewBranch :branches="branches" :selectedBranchData="selectedBranchData" />
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
import Review from "@/components/modals/Review.vue";
import DraftAlert from "@/components/branch/DraftAlert.vue";

export default {
  components: {
    Collections,
    NewBranch,
    NewCollection,
    Review,
    DraftAlert
  },
  data() {
    return {
      // activeTab: 0,
      showTabs: false,
      selectedBranchName: "master",
      isNewBranchModalActive: false,
      isNewCollectionModalActive: false,
      isReviewModalActive: false
    };
  },
  computed: {
    branches() {
      return this.$store.state.branches;
    },
    selectedBranchData() {
      return this.$store.state.branches.find(
        branch => branch.name === this.selectedBranchName
      );
    },
    isBranchInDraftMode() {
      return (
        this.selectedBranchData &&
        Boolean(this.selectedBranchData.draft_version)
      );
    }
  },
  mounted() {
    const urlPaths = window.location.href.split("tree");
    if (urlPaths.length === 2) {
      this.selectedBranchName = urlPaths[1].slice(1);
    }
    this.sanityResCheck();
  },
  methods: {
    sanityResCheck() {
      if (
        this.branches.findIndex(
          branch => branch.name === this.selectedBranchName
        ) === -1
      ) {
        this.selectedBranchName = "master";
      }
    },

    openReviewModal() {
      this.isReviewModalActive = true;
    },

    updateSelectedBranch(newValue) {
      if (newValue) {
        this.selectedBranchName = newValue;
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

.navbar-secondary {
  border-radius: 4px;
}
</style>
