<template>
  <div>
    <section>
      <div class="block">
        <b-select v-model="selectedResource">
          <option
            v-for="filter in resourceFilters"
            :value="filter.id"
            :key="filter.id"
          >{{ filter.name }}</option>
        </b-select>
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
      selectedResource: "master",
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
          id: "feature/shipping_charges"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>