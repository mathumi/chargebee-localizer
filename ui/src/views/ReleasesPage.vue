<template>
  <div class="container">
    <div class="release-wrapper">
      <div class="is-size-3 mar--b-md">Releases</div>
      <div class="timeline" v-if="releases.length > 0">
        <div
          class="timeline-wrapper"
          v-for="release in releases"
          :key="release.id"
        >
          <div>
            <p class="heading">
              {{ $time(release.created_at) }}
              <b-icon icon="tag" size="is-small" />
            </p>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="flex ai-center">
                <div class="timeline-main">
                  <p class="heading">{{ release.name }}</p>
                  <p style="max-width:60%;">{{ release.description }}</p>
                </div>
                <b-button
                  type="is-primary "
                  class="mar--l-mi"
                  @click="openDeployModal"
                  >Deploy</b-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>No Releases Found</div>
      <b-modal :active.sync="isNewDeployModalActive" :width="640">
        <DeployModal />
      </b-modal>
    </div>
  </div>
</template>

<script>
import DeployModal from '@/components/modals/Deploy.vue';

export default {
  name: "Releases",
  props: ["branches"],
  components: {
    DeployModal
  },
  data() {
    return {
      currentPage: 0,
      isNewDeployModalActive: false
    };
  },
  computed: {
    releases() {
      return this.$store.state.releases || [];
    }
  },
  methods: {
    openDeployModal(){
      this.isNewDeployModalActive = true
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
  .timeline {
    &- {
      &item {
        flex: 1;
      }
      &content {
         flex: 1;
      }
      &main {
        flex: 1;
        flex-basis: 80%;
      }
    }
  }
}
</style>
