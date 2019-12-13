<template>
  <div>
    <section>
      <div class="block">
        <!-- <b-select>
          <option
            v-for="option in data"
            :value="option.id"
            :key="option.id"
          >{{ option.user.first_name }}</option>
        </b-select> -->
      </div>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Collections" icon="package">
          <Collections />
        </b-tab-item>
        <b-tab-item label="Branches" icon="source-branch">
          <Branches />
        </b-tab-item>
        <b-tab-item label="Releases" icon="tag">
          <Releases />
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import Collections from "@/components/branch/tabs/Collections";
import Branches from "@/components/branch/tabs/Branches";
import Releases from "@/components/branch/tabs/Releases";

export default {
  components: {
    Collections,
    Branches,
    Releases
  },
  data() {
    return {
      activeTab: 0,
      showTabs: false,
      branches: [
        {
          name
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>