import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import Buefy from 'buefy';
import Toast from '@/utils/toast';

Vue.use(Buefy);

Vue.use(Toast);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
