import Vue from 'vue';
import VueRouter from 'vue-router';
import BranchPage from '@/views/BranchPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    name: 'BranchPage',
    path: '/',
    alias: '/tree/*',
    component: BranchPage,
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
