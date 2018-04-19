<template>
  <div class="map-wrapper">
    <div class="map" id="cassmap">
      <div v-if="currentPlace" class="current-place">{{ currentPlace.address.label }}</div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import { get } from 'lodash/object';
import config from '@/config';

export default {
  name: 'CassMap',
  methods: {
    addPlaceToMap(place) {
      this.$store.commit('addPlaceToActiveMap', place);
    },
    hidePlace() {
      this.$store.commit('setCurrentPlace', null);
    },
    setCurrentPlace(place) {
      this.$store.commit('setCurrentPlace', place);
    },
    reverseGeocoderUrl(prox) {
      return `https://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json
        ?mode=retrieveAddresses
        &prox=${prox}
        &app_id=${config.HERE_APP_ID}
        &app_code=${config.HERE_APP_CODE}`;
    },
    reverseGeocode(target) {
      this.setLoading(true);
      return new Promise((resolve, reject) => {
        fetch(this.reverseGeocoderUrl(`${target.latitude},${target.longitude}`))
          .then(response => response.json().then(res => resolve(res.Response)).catch(reject)).catch(reject);
      });
    },
    drawMap() {
      const mapElement = this.$el.querySelector('#cassmap');
      let pos = [48.8589507, 2.2770205]; // default Paris position
      this.map = L.map(mapElement).setView(pos, this.defaultZoom);
      L.tileLayer(config.LEAFLET_TILE_URL, this.tileParams).addTo(this.map);

      navigator.geolocation.getCurrentPosition((position) => {
        if (position && !this.currentPlace) {
          pos = [position.coords.latitude, position.coords.longitude];
          this.map.setView(pos, this.defaultZoom);
        }
      });
    },
    createNewPlacePopup(place) {
      return `<div class="popup__header"><h3>${place.address.label}</h3></div><div class="popup__footer><button id="add-to-map-button">Add to map</button></div>`;
    },
  },
  computed: {
    markers() {
      return get(this.$store.getters.activeMap, 'places', []);
    },
    currentPlace() {
      const cp = this.$store.getters.currentPlace;
      if (cp) {
        const pos = [cp.displayPosition.latitude, cp.displayPosition.longitude];
        this.map.setView(pos, this.defaultZoom);
        const m = L.marker(pos);
        m.addTo(this.map);

        const popup = L.DomUtil.create('div');
        L.DomUtil.create('div', 'popup__header', popup);
        L.DomUtil.create('div', 'popup__footer', popup);
        document.querySelector('.popup__header').innerHTML(cp.address.label);
        document.querySelector('.popup__footer').innerHTML('<button>Add to map</button>');
        document.querySelector('button').addEventListener('click', () => this.addPlaceToMap);

        m.bindPopup(popup).openPopup();
      }
    },
    currentPlaceIsNew() {
      return this.$store.getters.currentPlaceIsNew;
    },
  },
  data() {
    return {
      map: null,
      defaultZoom: 7,
      tileParams: {
        attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
        subdomains: '1234',
        mapID: 'newest',
        app_id: config.HERE_APP_ID,
        app_code: config.HERE_APP_CODE,
        apiVersion: 2.1,
        base: 'base',
        tileStyle: 'base',
        maxZoom: 20,
        type: 'maptile',
        language: 'en',
        format: 'png8',
        size: '256',
      },
    };
  },
  mounted() {
    this.drawMap();
  },
};
</script>

<style>
.map-wrapper {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  z-index: -5;
}

.current-place {
  display: none;
}

.map {
  width: 100%;
  height: 100%;
}
</style>
