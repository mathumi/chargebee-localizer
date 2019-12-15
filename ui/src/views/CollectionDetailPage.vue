<template>
  <div class="collection-detail">
    <template v-if="collectionData">
      <!-- Collection Heading -->
      <DraftAlert :draft="isBranchInDraftMode" :branchId="branchData.id" />
      <div class="collection-detail__block">
        <div class="level">
          <b-select v-model="selectedLocale" class="mar--b-st level-left">
            <option
              v-for="(locale, index) in locales"
              :value="locale.code"
              :key="locale.code"
            >{{ locale.name }}</option>
          </b-select>
          <div class="level-right" v-if="isBranchInDraftMode">
            <b-button
              class="float-right"
              type="is-primary"
              icon-left="upload"
              @click="openUpdateCollectionModal"
            >Update Collection</b-button>
          </div>
        </div>
        <div class="columns ai-center" v-if="collectionData">
          <div class="column ai-center">
            <h3 class="va-mid">Collections -</h3>
            <!-- <p class="fs-sm"><b>Branch:</b> Master</p> -->
            <div class="va-top collection-name flex" style="padding-left:6px;">
              <div class="flex flex-grow ai-center">
                <h3>
                  <a @click="openEdit()" class="popover-trigger">
                    {{
                    collectionData.name
                    }}
                  </a>
                </h3>
                <div class="mar--l-xs">Total Keys : {{ keys.length }}</div>
              </div>

              <b-input
                class="mar--r-sm collection-detail__input"
                v-model="searchValue"
                placeholder="Search Keys"
                type="text"
              ></b-input>
              <add-key />
              <transition name="fade">
                <div class="card popover" v-if="editName">
                  <div class="card-content">
                    <b-input
                      class="mar--b-mi collection-detail__input"
                      placeholder="Name of your collection"
                      v-model="collectionInput"
                      type="text"
                    ></b-input>
                    <b-button
                      @click="updateCollectionName()"
                      class="button is-twitter mar--r-mi"
                    >Update</b-button>

                    <b-button @click="cancelUpdate()" class="button" rounded>Cancel</b-button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="level">
          <div class="level-left" v-if="collectionData.description">{{collectionData.description}}</div>
          <div class="level-right">{{`Created on ${$time(collectionData.created_at)}`}}</div>
        </div>
      </div>
      <!-- Keys-->
      <div class="collection-detail__keys mar--t-md">
        <div class="columns">
          <div class="column">
            <div class="collection-detail__cards">
              <!-- <KeyCard :key="`key_${index}`" class="mar--b-md"/> -->
              <div v-if="visibleKeys.length === 0">No keys found.</div>
              <b-table :data="visibleKeys" v-else>
                <template slot-scope="props">
                  <b-table-column class="col_key">
                    <b>{{ props.row.key }}:</b>
                    <p
                      class="fs-sm text-light mar--t-ti"
                    >{{ props.row.description || 'This is a sample description' }}</p>
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
    </template>
    <b-modal :active.sync="isUpdateCollectionModalActive" :width="640">
      <update-collection :collectionData="collectionData" :selectedBranchData="branchData" />
    </b-modal>
  </div>
</template>

<script>
import KeyCard from "@/components/branch/KeyCard.vue";
import { Vue } from "vue-property-decorator";
import NewKey from "@/components/modals/NewKey.vue";
import DraftAlert from "@/components/branch/DraftAlert.vue";
import AddKey from "@/components/collection/AddKey.vue";
import UpdateCollection from "@/components/modals/UpdateCollection.vue";
import { keyService } from "@/services";

export default {
  name: "CollectionDetailPage",
  components: {
    DraftAlert,
    AddKey,
    UpdateCollection
  },
  data() {
    return {
      selectedLocale: "en",
      searchValue: "",
      keys: [],
      collectionInput: "",
      editName: false,
      isUpdateCollectionModalActive: false
    };
  },
  computed: {
    visibleKeys() {
      return this.searchValue
        ? this.keys.filter(key => key.value.includes(this.searchValue))
        : this.keys;
    },
    locales() {
      return this.$store.state.locales;
    },
    collectionHandle() {
      return this.$route.params.handle;
    },
    branchName() {
      return this.$route.params.branchName;
    },
    branchData() {
      return this.$store.getters.branchWithName(this.branchName) || {};
    },
    collections() {
      return this.branchData.collections || [];
    },
    collectionData() {
      return this.collections.find(
        collection => collection.handle === this.collectionHandle
      );
    },
    isBranchInDraftMode() {
      return this.branchData && Boolean(this.branchData.draft_version);
    }
  },
  mounted() {
    this.collectionInput = this.collectionName;
  },
  methods: {
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
    async fetchKeys() {
      const version =
        this.branchData.draft_version || this.branchData.published_version;
      this.keys = await keyService.getKeys(
        this.branchData.id,
        version,
        this.collectionData.id,
        this.selectedLocale
      );
    },
    openUpdateCollectionModal() {
      this.isUpdateCollectionModalActive = true;
    }
  },
  watch: {
    collectionData: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.fetchKeys();
        }
      }
    }
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

