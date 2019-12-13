<template>
  <div class="collections">
    <div class="collection">
      <b-table :data="collections.data">
        <template slot-scope="props">
          <b-table-column label="Collections">
            <!-- <img class="collection__img" src="@/assets/images/folder.png" /> -->
            <div class="collection__profile">
              <b-icon class="collection__img" icon="file-document-box"></b-icon>
              <span class="collection__name">{{ props.row.name }}</span>
            </div>
          </b-table-column>
          <b-table-column label="Locales">{{ props.row.locales }}</b-table-column>
          <b-table-column label="Last updated on" centered>{{ props.row.updated_at }}</b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "collections"
})
export default class App extends Vue {
  collections: any = {};
  mounted() {
    this.collections = {
      data: [
        {
          id: "1",
          name: "Customers",
          locales: "2",
          updated_at: "Sept 30, 2019"
        },
        {
          id: "2",
          name: "Subscriptions",
          locales: "3",
          updated_at: "Sept 20, 2019"
        },
        {
          id: "3",
          name: "Add-ons",
          locales: "4",
          updated_at: "Sept 10, 2019"
        }
      ],
    };
  }
}
</script>
<style lang="scss" scoped>
.collection {
  &__ {
    &profile {
      display: flex;
      align-items: center;
    }
    &img {
      margin-right: $space_ti;
    }
    &name {
      font-size: $fs_body;
    }
    &desc {
      font-size: $fs_caption;
    }
  }
}
</style>