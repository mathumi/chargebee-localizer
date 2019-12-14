import Vue from 'vue';
import VueRouter from 'vue-router';
import BranchPage from '@/views/BranchPage.vue';
import CollectionDetail from '@/views/CollectionDetail.vue';

Vue.use(VueRouter);

const routes = [
  {
    name: 'BranchPage',
    path: '/',
    component: BranchPage,
    meta: {
      namespace: 'branch'
    }
  },
  {
    name: 'BranchPageTree',
    path: '/tree/*',
    component: BranchPage,
    meta: {
      namespace: 'branch'
    }
  },
  {
    path: '/:branch/collection/',
    name: 'CollectionDetail',
    component: CollectionDetail,
    meta: {
      namespace: 'collection-detail'
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
