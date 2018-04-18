<template>
  <div class="map-wrapper">
    <label>
      <gmap-autocomplete
        selectFirstOnEnter
        @place_changed="displayPlace"
      />
    </label>

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
        :icon="currentPlaceIcon"
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
          <button @click="persistPlace(currentPlace)">Persist place</button>
        </div>
      </gmap-info-window>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: 'CassMap',
  methods: {
    getLatLng(place) {
      console.log(place);
      return place ? {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      } : null;
    },
    displayPlace(place) {
      console.log(place);
      console.log('displaying place!');
      place.position = this.getLatLng(place);
      this.currentPlace = place;
      this.infoWindowPos = place.position;
      this.infoWindowContent = place.name;
      this.infoWindowOpen = true;
    },
    hidePlace() {
      console.log('hide place');
      this.infoWindowOpen = false;
      this.infoWindowPos = null;
      this.infoWindowContent = '';
      this.currentPlace = null;
    },
    persistPlace(place) {
      console.log(place);
      place.position = this.getLatLng(place);
      this.markers.push(place);
    },
  },
  data() {
    return {
      markers: [],
      currentPlace: null,
      infoWindowPos: null,
      infoWindowContent: '',
      infoWindowOpen: false,
      infoWindowOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      currentPlaceIcon: {
        url: 'https://cdn2.iconfinder.com/data/icons/toolbar-signs-2/512/map_marker_base-128.png',
        size: { width: 20, height: 32, f: 'px', b: 'p' },
        anchor: { x: 0, y: 0 },
        origin: { x: 0, y: 0 },
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
