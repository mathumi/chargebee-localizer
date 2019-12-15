import Vue from 'vue';
import VueRouter from 'vue-router';
import BranchPage from '@/views/BranchPage.vue';
import BranchesPage from '@/views/BranchesPage.vue';
import ReleasesPage from '@/views/ReleasesPage.vue';
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
    name: 'Branches',
    path: '/branches',
    component: BranchesPage,
  },
  {
    name: 'Releases',
    path: '/releases',
    component: ReleasesPage
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
