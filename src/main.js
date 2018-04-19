import Vue from 'vue';
import Vuefire from 'vuefire';
import Firebase from 'firebase';

import router from './router.js';
import store from './store.js';
import config from './config';

import App from './components/App.vue';
Vue.use(Vuefire)

Firebase.initializeApp({
  apiKey: 'AIzaSyBYZdBva6Q9mseaTXRvvrsHWuB0Rxmdf8g',
  authDomain: 'cass-map.firebaseapp.com',
  databaseURL: 'https://cass-map.firebaseio.com',
  projectId: 'cass-map',
  // storageBucket: 'cass-map.appspot.com',
  // messagingSenderId: '305355822055'
});

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');
