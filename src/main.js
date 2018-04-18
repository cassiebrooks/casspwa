import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import router from './router.js';
import store from './store.js';
import config from './config';
import App from './components/App.vue';

Vue.use(VueGoogleMaps, {
  load: {
    key: config.GOOGLE_MAPS_TOKEN,
    libraries: 'places',
  },
});

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');
