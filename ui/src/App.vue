<template>
  <div id="app">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item class="logo" tag="router-link" :to="{ path: '/' }">
          <img class="logo__img" src="@/assets/images/logo.png" />Localizer
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-dropdown label="User" right>
          <b-navbar-item href="/my_account">My Account</b-navbar-item>
          <b-navbar-item href="/logout">Logout</b-navbar-item>
        </b-navbar-dropdown>
      </template>
    </b-navbar>

    <transition name="fade" mode="out-in">
      <div class="wrapper">
        <b-navbar
          class="navbar-secondary"
          :class="[isEditMode ? 'navbar-warning' : 'navbar-info']"
        >
          <template slot="brand">
            <div style="display:flex;align-items:center;">
              <p class="fs-st" v-if="isEditMode">
                You have some unpublished changes which are saved as draft.
              </p>
              <p class="fs-st" v-else>
                You are in View-only mode. <a>Click here to edit</a>
              </p>
            </div>
          </template>
          <template slot="end" v-if="isEditMode">
            <b-button
              type="is-text"
              class="mar--r-mi"
             
              >Discard</b-button
            >
            <b-button type="is-primary"
              >Publish</b-button
            >
          </template>
        </b-navbar>
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script lang="js">
export default {
  data() {
    return {
      isEditMode: false
    }
  },
  mounted() {
    this.$store.dispatch('mockInit');
  }
}
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
</style>
