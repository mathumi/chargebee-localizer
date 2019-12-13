import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Collections from '../views/Collections.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'collections',
    component: Collections,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
