<template>
  <div class="card keycard">
    <div class="card-content">
      <div class="content">
        <div class="columns">
          <div class="column is-one-quarter">
            <b>{{ keyObj.name }}</b>
          </div>
          <div class="column">
            <div
              v-for="(locale, index) in locales"
              class="columns"
              :key="`key_${index}`"
            >
              <span class="column keycard__locale">{{ locale }}:</span>
              <span class="column" v-if="!keyObj.locales[locale]">-</span>
              <a
                class="column"
                @click="showEdit(keyObj.locales[locale])"
                v-else-if="!keyObj.locales[locale].showEdit"
                >{{ keyObj.locales[locale].value }}</a
              >
              <b-input
                v-else
                class="mar--b-mi collection-detail__input column"
                :placeholder="`Enter text for ${locale}`"
                v-model="keyObj.locales[locale].internalValue"
                type="text"
              ></b-input>
              <template v-if="keyObj.locales[locale] && keyObj.locales[locale].showEdit">
                <b-button
                  @click="updateKey(keyObj.locales[locale])"
                  class="button is-twitter mar--r-mi"
                  rounded
                >
                  <b-icon icon="check"></b-icon
                ></b-button>
                <b-button
                  @click="cancelUpdateKey(keyObj.locales[locale])"
                  class="button"
                  rounded
                >
                  <b-icon icon="close"></b-icon
                ></b-button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue } from "vue-property-decorator";
export default {
  props: [],
  methods: {
    showEdit: function(keyLocaleObj) {
      Vue.set(keyLocaleObj, "showEdit", !keyLocaleObj.showEdit);
      Vue.set(keyLocaleObj, "internalValue", keyLocaleObj.value);
    },
    updateKey: function(keyLocaleObj) {
      this.closeUpdate(keyLocaleObj);
      keyLocaleObj.value = keyLocaleObj.internalValue;
    },
    cancelUpdateKey: function(keyLocaleObj) {
      this.closeUpdate(keyLocaleObj);
      keyLocaleObj.internalValue = keyLocaleObj.value;
    },
    closeUpdate: function(keyLocaleObj) {
      keyLocaleObj.showEdit = false;
    }
  },
  data() {
    return {
      locales: ["en", "fr", "in", "ca"],
      keyObj: {
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
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.keycard {
  &__ {
    &locale {
      max-width: 30px;
    }
  }
}
</style>
