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
          <cass-map-search @place="displayPlace" />

          <ul>
            <li v-for="(place, index) in map.places"
              :key="index"
              class="map-entry"
              :class="{ active: currentPlaceId === place.id }"
              @click="displayPlace(place)"
            >
              {{ place.name }}
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import config from '@/config';
import { get } from 'lodash/object';
import CassMapSearch from '@/components/CassMapSearch';

export default {
  name: 'CassSidebar',
  components: {
    CassMapSearch,
  },
  computed: {
    maps() {
      return this.$store.getters.maps;
    },
    activeMapId() {
      return this.$store.getters.activeMapId;
    },
    currentPlaceId() {
      return get(this.$store.getters.currentPlace, 'id');
    },
  },
  methods: {
    setActiveMap(id) {
      if (this.activeMapId !== id) this.$store.commit('setActiveMapId', id);
    },
    displayPlace(place) {
      console.log(JSON.stringify(place, null, 2));;
      this.$store.commit('setCurrentPlace', place);
    },
  },
};
</script>

<style lang="scss">
@import '~@/css/variables';
@import '~@/css/mixins';

.sidebar {
  width: 300px;
  background-color: $white;
  border: 1px solid $grey-light;
  margin: $space;
  position: absolute;
  @include shadow(1);

  h1 {
    margin: $space;
  }

  .map-list {
    border-top: 1px solid $grey;

    .map-list__item {
      border-bottom: 1px solid $grey;
      padding: $space;
      cursor: pointer;
      &:hover {
        background-color: $grey-light;
      }
      &.active {
        background-color: $grey-light;
      }
    }
  }

  .map-entry {
    margin-bottom: $space;
    &.active {
      color: $blue;
    }
  }
}
</style>
