<template>
  <transition name="fade" mode="out-in">
    <b-navbar class="mar--t-sm mar--b-md navbar-secondary" :type="draft ? 'is-warning': 'is-info'">
      <template slot="brand">
        <div style="display:flex;align-items:center;">
          <p class="fs-st" v-if="draft">You have some unpublished changes which are saved as draft.</p>
          <p class="fs-st has-text-white flex ai-center" v-else>
            You are in View-only mode.
            <b-button
              type="is-text"
              class="mar--r-mi"
              :loading="editModeLoader"
              @click="enableEditMode"
            >
              <span>Click here to edit</span>
            </b-button>
          </p>
        </div>
      </template>
      <template slot="end" v-if="draft">
        <b-button
          type="is-text"
          class="mar--r-mi"
          :loading="discardLoader"
          @click="confirmDiscardDraft"
        >Discard</b-button>
        <b-button type="is-primary" :loading="publishLoader" @click="openNewReleaseModal">Publish</b-button>
        <b-modal :active.sync="isNewReleaseModalActive" :width="640">
          <new-release :branchId="branchId" />
        </b-modal>
      </template>
    </b-navbar>
  </transition>
</template>

<script>
import NewRelease from "@/components/modals/NewRelease";
import { branchService } from "@/services";

export default {
  props: ["draft", "branchId"],
  components: {
    NewRelease
  },
  data() {
    return {
      discardLoader: false,
      publishLoader: false,
      editModeLoader: false,
      isNewReleaseModalActive: false
    };
  },
  methods: {
    confirmDiscardDraft() {
      this.discardLoader = true;
      this.$buefy.dialog.confirm({
        title: "Discard Draft",
        message:
          "Are you sure you want to <b>discard</b> changes? This action cannot be undone.",
        confirmText: "Yes",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.discard();
        },
        onCancel: () => {
          this.discardLoader = false;
        }
      });
    },
    discard() {
      this.$store
        .dispatch("discardDraftBranch", this.branchId)
        .then(() => {
          this.$success("Draft discarded");
        })
        .catch(this.$error)
        .finally(() => {
          this.discardLoader = false;
        });
    },
    openNewReleaseModal() {
      this.isNewReleaseModalActive = true;
    },
    enableEditMode() {
      this.editModeLoader = true;
      branchService
        .enableDraftMode(this.branchId)
        .then(() => this.$store.dispatch("init"))
        .catch(this.$error)
        .finally(() => {
          this.editModeLoader = false;
        });
    }
  }
};
</script>

<style>
</style>