<template>
  <div class="map-search">
    <input
      v-model="query"
      type="text"
      class="map-search"
    />

    <ul v-if="showResults" class="results">
      <li
        v-for="(result, index) in results"
        v-html="formatAddress(result.address)"
        :key="index"
        :class="{ active: navIndex === index }"
        @hover="setNavIndex(index)"
        @click="emitPlace(result)"
      >index: {{index}}, navIndex: {{navIndex}}</li>
    </ul>
  </div>
</template>

<script>
import config from '@/config';
import mock from '@/mocks/autocomplete-paris.mock';
import { debounce } from 'lodash/function';

const UP_ARROW = 38;
const DOWN_ARROW = 40;
const ENTER = 13;

export default {
  name: 'CassMapSearch',
  watch: {
    query(query) {
      if (query.length > 4) {
        this.searchPlaces(query);
      }
    }
  },
  methods: {
    autocompleteUrl(query) {
      return `http://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json?app_id=${config.HERE_APP_ID}&app_code=${config.HERE_APP_CODE}&query=${query}&beginHighlight=<b>&endHighlight=</b>`;
    },
    autocomplete(query) {
      return new Promise((resolve, reject) => {
        resolve(mock);
        // fetch(this.autocompleteUrl(query))
        //   .then(res => res.json()
        //     .then(res => resolve(res.suggestions))
        //     .catch(reject)
        //   ).catch(reject);
      });
    },
    searchPlaces: debounce(function (query) {
      this.autocomplete(encodeURIComponent(query)).then((json) => {
        document.addEventListener('keyup', this.keyboardNavigation);
        this.showResults = true;
        this.results = json;
      });
    }, 300),
    keyboardNavigation(e) {
      if (e.keyCode === UP_ARROW && this.navIndex === null) this.navIndex = this.results.length;
      else if (e.keyCode === UP_ARROW && this.navIndex >= 0) this.navIndex--;
      else if (e.keyCode === DOWN_ARROW && this.navIndex === null) this.navIndex = 0;
      else if (e.keyCode === DOWN_ARROW && this.navIndex <= this.results.length) this.navIndex++;
      else if (e.keyCode === ENTER) this.emitPlace(this.results[this.navIndex]);
    },
    formatAddress(address) {
      const arr = [];
      this.matchLevels.forEach(level => {
        if (address[level]) arr.push(address[level]);
      });
      return arr.join(', ');
    },
    setNavIndex(index) {
      this.navIndex = index;
    },
    emitPlace(result) {
      console.log(`result selected: ${this.formatAddress(result.address)}`);
      document.removeEventListener('keyup', this.keyboardNavigation);
      this.showResults = false;
      this.query = '';
      this.$emit('place', result);

    },
  },
  data() {
    return {
      query: '',
      results: [],
      navIndex: null,
      showResults: false,
      matchLevels: [
        'houseNumber',
        'intersection',
        'street',
        'postalCode',
        'district',
        'city',
        'county',
        'state',
        'country',
      ],
    };
  },
};
</script>

<style lang="scss">
@import '~@/css/mixins';
@import '~@/css/variables';

.map-search {
  position: relative;
  input {
    height: 30px;
    width: 100%;
    margin-top: $space;
    padding: $space-small;
    z-index: 1;
  }
  ul.results {
    position: absolute;
    background-color: $white;
    left: 0;
    right: 0;
    border-left: 1px solid $grey;
    border-right: 1px solid $grey;
    @include shadow(1);
    z-index: 0;
    li {
      padding: $space-small;
      border-bottom: 1px solid $grey;
      top: 30px;
      &.active, &:hover {
        background-color: $highlight;
      }
    }
  }
}
</style>
