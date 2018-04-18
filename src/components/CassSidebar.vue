<template>
  <div class="sidebar">
    <h1>All my Cassmaps</h1>

    <ul class="map-list">
      <li v-for="(map, index) in maps"
        :key="index"
        class="map-list__item"
        :class="{ active: activeMapId === map.id }"
        @click="setActiveMap(map.id)"
      >
        <h2>{{ map.name }}</h2>

        <template v-if="activeMapId === map.id">
          <label class="map-search">
            <gmap-autocomplete
              selectFirstOnEnter
              @place_changed="displayPlace"
            />
          </label>

          <ul>
            <li v-for="(place, index) in map.places" :key="index" class="map-entry">
              {{ place.name }}
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CassSidebar',
  computed: {
    maps() {
      return this.$store.getters.maps;
    },
    activeMapId() {
      return this.$store.getters.activeMapId;
    },
  },
  methods: {
    getLatLng(place) {
      return place ? {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      } : null;
    },
    setActiveMap(id) {
      if (this.activeMapId !== id) this.$store.commit('setActiveMapId', id);
    },
    displayPlace(place) {
      place.position = this.getLatLng(place);
      this.$store.commit('setCurrentPlace', place);
    },
  },
};
</script>

<style lang="scss">
.sidebar {
  width: 300px;
  background-color: white;
  border: 1px solid lightgray;
  margin: 10px;

  h1 {
    margin: 10px;
  }

  .map-list {
    border-top: 1px solid lightgray;
    .map-list__item {
      border-bottom: 1px solid lightgray;
      padding: 10px;
      cursor: pointer;
      &:hover {
        background-color: #f2f2f2;
      }
      &.active {
        background-color: #f2f2f2;
      }
    }
  }

  .map-search input {
    margin: 10px 0;
    padding: 5px;
    width: 100%;
  }

  .map-entry {
    background-color: white;
    padding: 5px;
    margin-bottom: 10px;
  }
}
</style>
