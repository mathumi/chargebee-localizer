<template>
  <div>
    <section>
      <div class="block">
        <!-- <b-switch v-model="showTabs">Show Books item</b-switch> -->
      </div>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Collections" icon="package">Lorem ipsum dolor sit amet.</b-tab-item>
        <b-tab-item label="Branches" icon="source-branch">
          What light is light, if Silvia be not seen?
          <br />What joy is joy, if Silvia be not by—
          <br />Unless it be to think that she is by
          <br />And feed upon the shadow of perfection?
          <br />Except I be by Silvia in the night,
          <br />There is no music in the nightingale.
        </b-tab-item>
        <b-tab-item label="Releases" icon="tag">
          Lorem
          <br />ipsum
          <br />dolor
          <br />sit
          <br />amet.
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      showTabs: false
    };
  }
};
</script>

<style lang="scss" scoped>
</style>