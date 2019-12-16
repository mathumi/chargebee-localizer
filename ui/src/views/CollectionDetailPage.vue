<template>
  <div>
    <!-- Collection Heading -->
    <DraftAlert :draft="isBranchInDraftMode" :branchId="branchData.id" />
    <div class="collection-detail">
      <template v-if="collectionData">
        <div class="collection-detail__block">
          <div class="level pad--b-st">
            <b-select v-model="selectedLocale" class="level-left">
              <option
                v-for="(locale, index) in locales"
                :value="locale.code"
                :key="locale.code"
              >{{ locale.name }}</option>
            </b-select>
            <!-- <p class="fs-sm">
            <b>Branch:</b> Master
            </p>-->
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
              <div class="va-top collection-name flex" style="padding-left:6px;">
                <div class="flex flex-grow ai-center">
                  <h3>
                    <!-- @click="openEdit()" -->
                    <a class="popover-trigger">{{ collectionData.name }}</a>
                  </h3>
                </div>

                <b-input
                  class="mar--r-sm collection-detail__input"
                  v-model="searchValue"
                  placeholder="Search Keys"
                  type="text"
                ></b-input>
                <add-or-update-key
                  v-if="isBranchInDraftMode"
                  :branchId="branchData.id"
                  :versionId="branchData.draft_version"
                  :collectionId="collectionData.id"
                  @reset="fetchKeys"
                />
                <transition name="fade">
                  <div class="card popover" v-if="editName">
                    <div class="card-content">
                      <b-input
                        class="mar--b-xs collection-detail__input"
                        placeholder="Name of your collection"
                        v-model="collectionInput"
                        type="text"
                      ></b-input>
                      <b-button
                        @click="updateCollectionName()"
                        class="button is-primary mar--r-mi"
                      >Update</b-button>

                      <b-button @click="cancelUpdate()" class="button">Cancel</b-button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div>
            <b>Branch:</b> Master
          </div>
          <div>
            <b>Total Keys:</b>
            {{ keys.length }}
          </div>
          <div v-if="collectionData.description">{{ collectionData.description }}</div>
          <div>{{ `Created on ${$time(collectionData.created_at)}` }}</div>
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
                      <p class="fs-sm text-light mar--t-ti">
                        {{
                        props.row.description ||
                        "This is a sample description"
                        }}
                      </p>
                    </b-table-column>
                    <b-table-column class="col_val">
                      <a
                        v-if="!props.row.showEdit"
                        @click="showEdit(props.row)"
                      >{{ props.row.value }}</a>
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
                          class="button is-primary mar--r-mi"
                        >Update</b-button>
                        <b-button @click="cancelUpdateKey(props.row)" class="button">Cancel</b-button>
                      </template>
                    </b-table-column>
                    <b-table-column
                      class="text-right cursor-pointer"
                      @click.native="confirmArchive(props.row.key)"
                      v-if="isBranchInDraftMode"
                    >
                      <b-icon v-if="!props.row.archived" icon="delete"></b-icon>
                      <span v-else class="text-light">Archived</span>
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
  </div>
</template>

<script>
import KeyCard from "@/components/branch/KeyCard.vue";
import { Vue } from "vue-property-decorator";
import AddOrUpdateKey from "@/components/modals/AddOrUpdateKey.vue";
import DraftAlert from "@/components/branch/DraftAlert.vue";
import UpdateCollection from "@/components/modals/UpdateCollection.vue";
import { keyService, textService } from "@/services";

export default {
  name: "CollectionDetailPage",
  components: {
    DraftAlert,
    AddOrUpdateKey,
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
    },
    updateKey(key) {
      this.closeUpdate(key);
      key.value = key.internalValue;
      textService
        .createOrUpdateText({
          ...key,
          branchId: this.branchData.id,
          collectionId: key.collection_id,
          versionId: this.branchData.draft_version
        })
        .then(() => {
          this.$success("Key updated!");
          this.fetchKeys();
        })
        .catch(this.$error);
    },
    confirmArchive(key) {
      const keysData = this.keys.find(k => k.key === key) || {};
      this.$buefy.dialog.confirm({
        title: "Archiving Key",
        message:
          "Are you sure you want to <b>archive</b> key? This action cannot be undone.",
        confirmText: "Archive",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          textService
            .createOrUpdateText({
              key,
              ...keysData,
              branchId: this.branchData.id,
              collectionId: keysData.collection_id,
              versionId: this.branchData.draft_version,
              archived: true
            })
            .then(() => {
              this.$success("Key Archived!");
              this.fetchKeys();
              this.$store.dispatch("init");
            })
            .catch(this.$error);
        }
      });
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
    },
    selectedLocale: {
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
  top: 40px;
  left: 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.02);
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
.level {
  border-bottom: 1px solid #dbdbdb;
}
</style>
