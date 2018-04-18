import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

import europeMock from '@/mocks/europe-places.mock';
import asiaMock from '@/mocks/asia-places.mock';

Vue.use(Vuex);

const store = {
  state: {
    activeMapId: null,
    currentPlace: null,
    maps: [
      {
        id: '1',
        name: 'Europe map',
        dateCreated: '',
        dateUpdated: '',
        places: europeMock,
      },
      {
        id: '2',
        name: 'Asia map',
        dateCreated: '',
        dateUpdated: '',
        places: asiaMock,
      },
    ],
  },
  actions: {},
  mutations: {
    setActiveMapId: (state, id) => state.activeMapId = id,
    addPlaceToActiveMap: (state, place) => state.maps.find(map => map.id === state.activeMapId).places.push(place),
    setCurrentPlace: (state, place) => {
      state.currentPlace = place;
      console.log(`changed current place to ${place.name}!`);
    },
    // setMap: (state, map) => {
    //   const index = state.maps.findIndex(m => m.id === map.id);
    //   if (index >= 0) state.maps.index = map;
    //   else state.maps.push(map);
    // },
  },
  getters: {
    maps: state => state.maps,
    activeMapId: state => state.activeMapId,
    activeMap: state => state.maps.find(map => map.id === state.activeMapId),
    currentPlace: state => state.currentPlace,
  },
};

export default new Vuex.Store(store);