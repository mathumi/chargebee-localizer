<template>
  <div class="panel" v-if="data && data.length > 0">
    <p class="panel-heading" v-if="title">{{title}}</p>
    <a class="panel-block" v-for="item in data" :key="item.id">
      <div class="columns container">
        <div class="column is-one-third flex">
          <b-icon icon="shield-lock" class="mar--r-xs" v-if="icon" />
          <span v-if="item.name">{{ item.name }}</span>
        </div>
        <div class="column is-half" v-if="item.description">{{ item.description }}</div>
        <div class="column">
          <b-icon icon="delete" @click.native="confirmDelete" />
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "Panel",
  props: ["data", "title", "icon"],
  methods: {
    confirmDelete() {
      this.$buefy.dialog.confirm({
        title: "Deleting Branch",
        message:
          "Are you sure you want to <b>delete</b> branch? This action cannot be undone.",
        confirmText: "Delete Branch",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.$buefy.toast.open("Branch deleted!");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-heading {
  font-weight: 500;
  font-size: 16px;
}
</style>