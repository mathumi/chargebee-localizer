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
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script lang="js">
export default {
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
