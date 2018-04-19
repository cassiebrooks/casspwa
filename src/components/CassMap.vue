<template>
  <div class="map-wrapper">
    <div class="map" id="cassmap"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import { get } from 'lodash/object';
import config from '@/config';

export default {
  name: 'CassMap',
  methods: {
    getLatLng(place) {
      return place ? {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      } : null;
    },
    persistPlace(place) {
      place.position = this.getLatLng(place);
      this.$store.commit('addPlaceToActiveMap', place);
    },
    hidePlace() {
      this.$store.commit('setCurrentPlace', null);
    },
    setCurrentPlace(place) {
      this.$store.commit('setCurrentPlace', place);
    },

    autocompleteUrl(query) {
      return `http://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json
        ?app_id=${config.HERE_APP_ID}
        &app_code=${config.HERE_APP_CODE}
        &query=${query}
        &beginHighlight=<b>
        &endHighlight=</b>`;
    },
    geocoderUrl(query) {
      return `https://geocoder.cit.api.here.com/6.2/geocode.json
        ?searchtext=${query}
        &app_id=${config.HERE_APP_ID}
        &app_code=${config.HERE_APP_CODE}
        &gen=8`;
    },
    reverseGeocoderUrl(prox) {
      return `https://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json
        ?mode=retrieveAddresses
        &prox=${prox}
        &app_id=${config.HERE_APP_ID}
        &app_code=${config.HERE_APP_CODE}`;
    },
    autocomplete(query) {
      return new Promise((resolve, reject) => {
        fetch(this.autocompleteUrl(query))
          .then(res => res.json()
            .then(res => resolve(res.Response))
            .catch(reject)
          ).catch(reject);
      });
    },
    geocode(target) {
      return new Promise((resolve, reject) => {
        if (target.address !== '') {
          this.setLoading(true);
          fetch(this.geocoderUrl(target.address))
          .then(response => response.json().then(res => resolve(res.Response)).catch(reject)).catch(reject);
        }
      });
    },
    reverseGeocode(target) {
      this.setLoading(true);
      return new Promise((resolve, reject) => {
        fetch(this.reverseGeocoderUrl(`${target.latitude},${target.longitude}`))
          .then(response => response.json().then(res => resolve(res.Response)).catch(reject)).catch(reject);
      });
    },


    drawMap() {
      // this.geoJSONOptions = {
      //   style: feature => ({
      //     ...feature.properties.style,
      //     color: colors.red,
      //   }),
      //   pointToLayer: (feature, latlng) => L.circle(latlng, feature.properties.style),
      //   onEachFeature: (feature, layer) => {
      //     if (feature.geometry.type === 'Point') {
      //       layer.on('mousedown', this.startEditingCircle);
      //       layer.on('mouseup', this.endEditingCircle);
      //     }
      //   },
      // };

      const mapElement = this.$el.querySelector('#cassmap');
      let pos = [48.8589507, 2.2770205]; // default Paris position
      this.map = L.map(mapElement).setView(pos, this.defaultZoom);
      L.tileLayer(config.LEAFLET_TILE_URL, this.tileParams).addTo(this.map);

      // navigator.geolocation.getCurrentPosition((position) => {
      //   pos = [position.coords.latitude, position.coords.longitude];
      //   this.map.setView(pos, this.defaultZoom);

      //   this.markers.push(L.marker([t.latitude, t.longitude]));
      //   this.markers.forEach(m => m.addTo(this.map));

      // }, () => {
      //   console.error('no geolocation found');
      // });
    },
  },
  computed: {
    markers() {
      return get(this.$store.getters.activeMap, 'places', []);
    },
    currentPlace() {
      return this.$store.getters.currentPlace;
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

.map {
  width: 100%;
  height: 100%;
}
</style>
