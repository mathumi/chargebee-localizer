<template>
  <div class="panel" v-if="data">
    <p class="panel-heading" v-if="title">{{title}}</p>
    <a class="panel-block">
      <div class="columns container">
        <div class="column is-one-third flex">
          <b-icon icon="shield-lock" class="mar--r-xs" />
          <span v-if="data.name">{{ data.name }}</span>
        </div>
        <div class="column is-half" v-if="data.description">{{ data.description }}</div>
        <div class="column">
          <b-icon icon="delete" />
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "Panel",
  props: ["data", "title"]
};
</script>

<style lang="scss" scoped>
.panel-heading {
  font-weight: 500;
  font-size: 16px;
}
</style>