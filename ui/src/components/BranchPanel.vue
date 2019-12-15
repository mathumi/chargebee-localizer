<template>
  <div class="panel" v-if="data && data.length > 0">
    <p class="panel-heading" v-if="title">{{title}}</p>
    <a class="panel-block" v-for="item in data" :key="item.id">
      <div class="columns container ai-center">
        <div class="column is-one-third">
          <div class="flex ai-center">
            <b-icon icon="shield-lock" class="mar--r-xs" v-if="icon" />
            <div>
              <p class="fs-md" v-if="item.name">
                <router-link :to="`/tree/${item.name}`">{{ item.name }}</router-link>
              </p>
              <p class="fs-sm text-light" v-if="item.description">{{ item.description }}</p>
            </div>
          </div>
        </div>
        <div class="column is-half" v-if="item.updated_at">Updated {{ $time(item.updated_at) }}</div>
        <div class="column text-right">
          <b-icon icon="delete" @click.native="confirmDelete" class="cursor-pointer" />
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
          this.$success("Branch deleted!");
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