import Vue from 'vue';
import VueRouter from 'vue-router';

import HomePage from '@/components/HomePage';

const routerConf = {
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
  ],
};

Vue.use(VueRouter);

export default new VueRouter(routerConf);
