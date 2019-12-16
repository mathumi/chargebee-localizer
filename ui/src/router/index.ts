import Vue from 'vue';
import VueRouter from 'vue-router';
import BranchPage from '@/views/BranchPage.vue';
import BranchesPage from '@/views/BranchesPage.vue';
import ReleasesPage from '@/views/ReleasesPage.vue';
import DeploymentsPage from '@/views/DeploymentsPage.vue';
import CollectionDetailPage from '@/views/CollectionDetailPage.vue';

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
    path: '/tree/:branchName',
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
    name: 'Deployments',
    path: '/deployments',
    component: DeploymentsPage
  },
  {
    name: 'CollectionDetail',
    path: '/blob/:branchName/:handle',
    component: CollectionDetailPage,
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
