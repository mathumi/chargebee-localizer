<template>
  <div>
    <div class="timeline">
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
      <!-- <div class="timeline-header">
        <span class="tag is-medium is-primary">End</span>
      </div>-->
    </div>
    <b-pagination
      :total="releases.length"
      :current.sync="currentPage"
      range-before="3"
      :per-page="5"
      :icon-prev="'chevron-left'"
      :icon-next="'chevron-right'"
    ></b-pagination>
  </div>
</template>

<script>
export default {
  name: "Releases",
  data() {
    return {
      currentPage: 0,
      releases: [
        {
          id: 0,
          name: "summer_release",
          description: "This is a summer release",
          created_at: "12 days ago"
        },
        {
          id: 1,
          name: "winter_release",
          description: "This is a summer release",
          created_at: "22 days ago"
        },
        {
          id: 2,
          name: "fall_release",
          description: "This is a summer release",
          created_at: "2 months ago"
        },
        {
          id: 3,
          name: "spring_release",
          description: "This is a summer release",
          created_at: "1 year ago"
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.timeline-wrapper {
  display: flex;
  align-items: baseline;

  div:first-child {
    flex-basis: 16%;
  }
}
</style>
