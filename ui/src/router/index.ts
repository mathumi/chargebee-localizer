import Vue from 'vue';
import VueRouter from 'vue-router';
import BranchPage from '@/views/BranchPage.vue';
import CollectionDetail from '@/views/CollectionDetail.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'BranchPage',
    component: BranchPage,
  },
  {
    path: '/:branch/collection/',
    name: 'CollectionDetail',
    component: CollectionDetail,
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
