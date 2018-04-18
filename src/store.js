import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

Vue.use(Vuex);

const store = {
  state: {
    maps: [
      {
        id: '1',
        name: 'Europe map',
        dateCreated: '',
        dateUpdated: '',
        places: [],
      },
      {
        id: '2',
        name: 'Asia map',
        dateCreated: '',
        dateUpdated: '',
        places: [],
      },
    ],
  },
  actions: {},
  mutations: {},
  getters: {
    maps: state => state.maps,
  },
};

export default new Vuex.Store(store);