<template>
  <div id="app">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item class="logo" tag="router-link" :to="{ path: '/' }">
          <img class="logo__img" src="@/assets/images/logo.png" />Localizer
        </b-navbar-item>
      </template>
    </b-navbar>
    <transition name="fade" mode="out-in">
      <div class="wrapper">
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.use(Buefy);

@Component({
  components: {}
})
export default class App extends Vue {}
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
