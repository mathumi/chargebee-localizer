<template>
  <div class="collection-detail">
    <!-- Collection Heading -->
    <div class="columns ai-center collection-detail__block">
      <div class="column ai-center">
        <h3 class="va-mid">Collections -</h3>
        <!-- <p class="fs-sm"><b>Branch:</b> Master</p> -->
        <div class="va-top collection-name flex" style="padding-left:6px;">
          <div class="flex flex-grow ai-center">
            <h3>
              <a @click="openEdit()" class="popover-trigger">
                {{
                collectionName
                }}
              </a>
            </h3>
            <b-select value="en" class="mar--l-st">
              <option
                v-for="(locale, index) in locales"
                :value="locale.code"
                :key="locale.code"
              >{{ locale.name }}</option>
            </b-select>
          </div>
          <b-input class="mar--r-sm collection-detail__input" placeholder="Search Keys" type="text"></b-input>
          <b-button
            class="float-right"
            type="is-primary"
            outlined
            icon-left="key-variant"
            @click="openAddKeyModal"
          >Add Key</b-button>
          <transition name="fade">
            <div class="card popover" v-if="editName">
              <div class="card-content">
                <b-input
                  class="mar--b-mi collection-detail__input"
                  placeholder="Name of your collection"
                  v-model="collectionInput"
                  type="text"
                ></b-input>
                <b-button @click="updateCollectionName()" class="button is-twitter mar--r-mi">Update</b-button>

                <b-button @click="cancelUpdate()" class="button" rounded>Cancel</b-button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Keys-->
    <div class="collection-detail__keys mar--t-md">
      <div class="columns">
        <div class="column">
          <div class="collection-detail__cards">
            <!-- <KeyCard :key="`key_${index}`" class="mar--b-md"/> -->
            <b-table :data="collectionData">
              <template slot-scope="props">
                <b-table-column class="col_key">
                  <b>{{ props.row.key }}:</b>
                  <p class="fs-sm text-light mar--t-ti">
                    Heading of the API Keys page Heading of the API Keys page
                    Heading of the API Keys page
                  </p>
                </b-table-column>
                <b-table-column class="col_val">
                  <a v-if="!props.row.showEdit" @click="showEdit(props.row)">
                    {{
                    props.row.value
                    }}
                  </a>
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
                    >Update</b-button>
                    <b-button @click="cancelUpdateKey(props.row)" class="button" rounded>Cancel</b-button>
                  </template>
                </b-table-column>
                <b-table-column class="text-right">
                  <b-icon v-if="!props.row.archived" type="is-danger" size="is-small" icon="delete"></b-icon>
                  <span v-else class="text-danger">Archived</span>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
    <b-modal :active.sync="isNewKeyModalActive" :width="640">
      <NewKey />
    </b-modal>
  </div>
</template>

<script>
import KeyCard from "@/components/branch/KeyCard.vue";
import { Vue } from "vue-property-decorator";
import NewKey from "@/components/modals/NewKey.vue";
export default {
  components: {
    NewKey
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
    },
    openAddKeyModal() {
      this.isNewKeyModalActive = true;
    }
  },

  data() {
    return {
      collectionName: "API Keys",
      collectionInput: "",
      editName: false,
      isNewKeyModalActive: false,
      locales: [
        {
          name: "en",
          code: "en"
        },
        {
          name: "fr",
          code: "fr"
        }
      ],
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
.popover {
  position: absolute;
  top: 30px;
  left: 0;
}
.collection-name {
  padding-left: 6px;
  position: relative;
  flex: 1;
  border-radius: 4px;
}
.collection-detail {
  margin-top: 32px;
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
        td:first-child {
          padding-left: 0;
        }
        td:last-child {
          padding-right: 0;
        }
      }
    }
    &block {
      border-bottom: 1px solid #dbdbdb;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
  }
}

.navbar-secondary {
  margin-top: 1px;
  box-shadow: none;
  padding: 4px 16px;
  align-items: center !important;
  z-index: 1 !important;
  .tab-content {
    padding-left: 0;
    padding-right: 0;
  }
}

.navbar-warning {
  background: #fff3da !important;
  border-bottom: 1px solid #ffeab8;
}

.navbar-info {
  background-color: #f1f8ff !important;
  border-bottom: 1px solid #c8e1ff;
}
</style>
