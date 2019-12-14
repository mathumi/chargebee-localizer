<template>
  <form action>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New Collection</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Collection Name">
          <b-input type="text" placeholder="Snap" required></b-input>
        </b-field>
        <b-field label="Description">
          <b-input type="textarea" placeholder="Super snappingly scalable"></b-input>
        </b-field>
        <b-field label="Collections">
          <b-upload drag-drop>
            <section class="section">
                <div class="content has-text-centered">
                    <p>
                        <b-icon
                            icon="upload"
                            size="is-large">
                        </b-icon>
                    </p>
                    <p>Drop your translation file here</p>
                </div>
            </section>
          </b-upload>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-primary">Create</button>
      </footer>
    </div>
  </form>
</template>

<script>
export default {
  name: "NewBranch",
  props: ["selectedResource", "resourceFilters"]
};
</script>

<style>
</style>