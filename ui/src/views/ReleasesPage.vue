<template>
  <div class="container">
    <div class="release-wrapper">
      <div class="is-size-3 mar--b-xs">Releases</div>
      <div class="timeline" v-if="releases.length > 0">
        <div class="timeline-wrapper" v-for="release in releases" :key="release.id">
          <div>
            <p class="heading">
              {{release.created_at}}
              <b-icon icon="tag" size="is-small" />
            </p>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <p class="heading">{{release.name}}</p>
              <p>{{release.description}}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>No Releases Found</div>
      <b-modal :active.sync="isNewReleaseModalActive" :width="640">
        <NewRelease :branches="branches" :selectedBranch="''" />
      </b-modal>
    </div>
  </div>
</template>

<script>
import NewRelease from "@/components/modals/NewRelease.vue";

export default {
  name: "Releases",
  props: ["branches"],
  components: {
    NewRelease
  },
  data() {
    return {
      currentPage: 0,
      isNewReleaseModalActive: false
    };
  },
  computed: {
    releases() {
      return this.$store.state.releases || [];
    }
  },
  methods: {
    openNewReleaseModal() {
      this.isNewReleaseModalActive = true;
    }
  }
};
</script>

<style scoped lang="scss">
.timeline {
  border-top: 1px solid #dbdbdb;
  border-bottom: 1px solid #dbdbdb;
}

.timeline-wrapper {
  display: flex;
  align-items: baseline;

  div:first-child {
    flex-basis: 11%;
  }
}

.release-wrapper {
  margin: 80px 0 0 0;
}
</style>
