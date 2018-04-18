<template>
  <div class="sidebar">
    <h1>All my Cassmaps</h1>

    <ul class="map-list">
      <li v-for="(map, index) in maps" :key="index" class="map-list__item">
        {{ map.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CassSidebar',
  computed: {
    maps() {
      console.log(this.$store);
      return this.$store.getters.maps;
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
    }
  }
}
</style>
