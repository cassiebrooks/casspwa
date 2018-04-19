import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

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
  mutations: {
    setActiveMapId: (state, id) => {
      state.activeMapId = id;
      state.currentPlace = null;
    },
    addPlaceToActiveMap: (state, place) => state.maps.find(map => map.id === state.activeMapId).places.push(place),
    setCurrentPlace: (state, place) => {
      console.log('IN setCurrentPlace FROM STORE', place);
      state.currentPlace = place;
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
    currentPlaceIsNew: (state) => {
      const activeMap = state.maps.find(map => map.id === state.activeMapId);
      return !activeMap || !state.currentPlace || !activeMap.places.find(p => p.id === state.currentPlace.id);
    },
  },
};

export default new Vuex.Store(store);