<template>
  <div class="map-wrapper">
    <gmap-map
      class="map"
      :center="{ lat: 48, lng: 2 }"
      :zoom="3"
    >
      <gmap-marker v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
      />

      <gmap-marker v-if="currentPlace"
        key="current-place"
        :position="currentPlace.position"
      />

      <gmap-info-window v-if="infoWindowOpen"
        :position="infoWindowPos"
        :opened="infoWindowOpen"
        :options="infoWindowOptions"
        @closeclick="hidePlace"
      >
        <div class="iw-header">
          {{ infoWindowContent }}
        </div>
        <div class="iw-body">
        </div>
        <div class="iw-footer">
          <button @click="persistPlace(currentPlace)">Add to map</button>
        </div>
      </gmap-info-window>
    </gmap-map>
  </div>
</template>

<script>
import { get } from 'lodash/object';

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
      console.log(JSON.stringify(place, null, 2));
      place.position = this.getLatLng(place);
      this.$store.commit('addPlaceToActiveMap', place);
    },
    hidePlace() {
      this.infoWindowOpen = false;
      this.infoWindowPos = null;
      this.infoWindowContent = null;
      this.$store.commit('setCurrentPlace', null);
    },
  },
  computed: {
    markers() {
      return get(this.$store.getters.activeMap, 'places', []);
    },
    currentPlace() {
      const cp = this.$store.getters.currentPlace;
      if (cp) {
        console.log(`Found the new current place (${cp.name})`);
        console.log(cp.position);
        this.infoWindowPos = cp.position;
        this.infoWindowContent = cp.name;
        this.infoWindowOpen = true;
      } else {
        this.infoWindowOpen = false;
        this.infoWindowPos = null;
        this.infoWindowContent = null;
      }
      return cp;
    },
  },
  data() {
    return {
      infoWindowPos: null,
      infoWindowContent: '',
      infoWindowOpen: false,
      infoWindowOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
    };
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
