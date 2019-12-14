<template>
  <div class="collection-detail">
    <!-- Collection Heading -->
    <h3 class="va-mid">
      Collections -
    </h3>
    <div class="va-top" style="padding-left:6px;">
      <h3 v-if="!editName">
        <a @click="openEdit()">{{ collectionName }}</a>
      </h3>
      <template v-else>
        <b-input
          class="mar--b-mi collection-detail__input"
          placeholder="Name of your collection"
          v-model="collectionInput"
          type="text"
        ></b-input>
        <b-button
          @click="updateCollectionName()"
          class="button is-twitter mar--r-mi"
          rounded
        >
          <b-icon icon="check"></b-icon
        ></b-button>
        <b-button @click="cancelUpdate()" class="button" rounded>
          <b-icon icon="close"></b-icon
        ></b-button>
      </template>
    </div>

    <!-- Keys-->
    <div class="collection-detail__keys mar--t-md">
      <h4 class="mar--b-sm">Keys</h4>
      <div class="columns">
        <div class="column is-half">
          <div class="collection-detail__cards">
            <template v-for="(data, index) of collectionData">
              <KeyCard :key="`key_${index}`" class="mar--b-md"/>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KeyCard from "@/components/branch/KeyCard.vue";
export default {
  components: {
    KeyCard
  },
  methods: {
    mounted() {
      this.collectionInput = this.collectionName;
    },
    openEdit: function() {
      this.editName = true;
    },
    closeEdit: function() {
      this.editName = false;
    },
    updateCollectionName: function() {
      this.closeEdit();
      this.collectionName = this.collectionInput;
    },
    cancelUpdate: function() {
      this.closeEdit();
      this.collectionInput = this.collectionName;
    }
  },

  data() {
    return {
      collectionName: "API Keys",
      collectionInput: "",
      editName: false,
      collectionData: [
        {
          name: "apikey_heading",
          locales: {
            en: {
              name: "en",
              version: 0,
              value: "API Keys Configuration",
              archived: false
            },
            fr: {
              name: "fr",
              version: 0,
              value: "Blah blha",
              archived: false
            }
          }
        },
        {
          name: "webhooks",
          locales: {
            en: {
              name: "en",
              version: 0,
              value: "Webhooks",
              archived: false
            },
            fr: {
              name: "fr",
              version: 0,
              value: "Blah blha",
              archived: false
            },
            in: {
              name: "in",
              version: 0,
              value: "Webhooks",
              archived: false
            }
          }
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.collection-detail {
  &__ {
    &input {
      min-width: 300px;
    }
  }
}
</style>
