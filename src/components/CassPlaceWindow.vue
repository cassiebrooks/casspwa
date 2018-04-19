<template>
  <gmap-info-window
    :position="place.position"
    :opened="!!place"
    :options="options"
    @closeclick="$emit('closeclick')"
  >
    <div class="iw-header">
      <slot name="header"></slot>
    </div>
    <div class="iw-body">
      <slot name="body"></slot>
    </div>
    <div class="iw-footer">
      <slot name="footer"></slot>
    </div>
  </gmap-info-window>
</template>

<script>
export default {
  name: 'CassPlaceWindow',
  props: {
    place: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      options: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
    };
  },
};
</script>

<style lang="scss">
</style>
