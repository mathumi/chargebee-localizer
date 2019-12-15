<template>
  <div id="app">
    <b-navbar class="header">
      <template slot="brand">
        <b-navbar-item class="logo" tag="router-link" :to="{ path: '/' }">
          <img class="logo__img" src="@/assets/images/logo.png" />Localizer
        </b-navbar-item>
        <b-navbar-item tag="router-link" to="/branches">Branches</b-navbar-item>
        <b-navbar-item tag="router-link" to="/releases">Releases</b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-dropdown label="User" right>
          <b-navbar-item href="/my_account">My Account</b-navbar-item>
          <b-navbar-item href="/logout">Logout</b-navbar-item>
        </b-navbar-dropdown>
      </template>
    </b-navbar>

    <router-view />

    <transition name="fade" mode="out-in">
      <div class="wrapper" :class="pageClass">
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script lang="js">
export default {
  computed: {
    pageClass() {
      return this.$route.meta.namespace ? `${this.$route.meta.namespace}-body`: '';
    }
  },

  data() {
    return {
      isEditMode: false,
      loaded: false
    }
  },
  mounted() {
    this.$store
    .dispatch('init')
    .finally(result => {
      this.loaded = true
    });
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
.navbar-item {
  padding-left: 0;
  &:not(:first-child) {
    padding-left: 20px;
  }
}

.header {
  height: 6em;
}
</style>
