<template>
  <cass-place-window :place="place">
    <template slot="header">
      {{ place.name }}
    </template>

    <template slot="body">
    </template>

    <template slot="footer">
      <button @click="persistPlace(currentPlace)">Add to map</button>
    </template>
  </cass-place-window>
</template>

<script>
import CassPlaceWindow from '@/components/CassPlaceWindow';

export default {
  name: 'CassNewPlaceWindow',
  props: {
    place: {
      type: Object,
      required: true,
    },
  },
  components: {
    CassPlaceWindow,
  },
};
</script>

<style lang="scss">
</style>
