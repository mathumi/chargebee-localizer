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
        <div class="column">
          <div class="collection-detail__cards">
            <!-- <KeyCard :key="`key_${index}`" class="mar--b-md"/> -->
            <b-table :data="collectionData">
              <template slot-scope="props">
                <b-table-column class="col_key"
                  ><b>{{ props.row.key }}:</b>
                  <p class="fs-sm text-light mar--t-ti">
                    Heading of the API Keys page Heading of the API Keys page
                    Heading of the API Keys page
                  </p>
                </b-table-column>
                <b-table-column class="col_val">
                  <a v-if="!props.row.showEdit" @click="showEdit(props.row)">{{
                    props.row.value
                  }}</a>
                  <b-input
                    v-else
                    class="mar--b-xs pad-0 collection-detail__input column"
                    :placeholder="`Enter text for ${props.row.key}`"
                    v-model="props.row.internalValue"
                    rows="1"
                    type="textarea"
                  ></b-input>
                  <template v-if="props.row.showEdit">
                    <b-button
                      @click="updateKey(props.row)"
                      class="button is-twitter mar--r-mi"
                      rounded
                    >
                      Update</b-button
                    >
                    <b-button
                      @click="cancelUpdateKey(props.row)"
                      class="button"
                      rounded
                    >
                      Cancel</b-button
                    ></template
                  ></b-table-column
                >
                <b-table-column class="text-right">
                  <b-icon
                    v-if="!props.row.archived"
                    type="is-danger"
                    size="is-small"
                    icon="delete"
                  ></b-icon>
                  <span v-else class="text-danger">Archived</span>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KeyCard from "@/components/branch/KeyCard.vue";
import { Vue } from "vue-property-decorator";
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
    },

    showEdit: function(key) {
      Vue.set(key, "showEdit", !key.showEdit);
      Vue.set(key, "internalValue", key.value);
    },
    updateKey: function(key) {
      this.closeUpdate(key);
      key.value = key.internalValue;
    },
    cancelUpdateKey: function(key) {
      this.closeUpdate(key);
      key.internalValue = key.value;
    },
    closeUpdate: function(key) {
      key.showEdit = false;
    }
  },

  data() {
    return {
      collectionName: "API Keys",
      collectionInput: "",
      editName: false,
      collectionData: [
        {
          key: "apikey_heading",
          version: 0,
          value: "API Keys Configuration",
          archived: true
        },
        {
          key: "webhooks",
          version: 0,
          value: "Webhooks",
          archived: false
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
    &keys {
      table {
        thead {
          display: none;
        }
        td.col_key {
          width: 35%;
        }
        td.col_value {
          width: 60%;
        }
      }
    }
  }
}
</style>
