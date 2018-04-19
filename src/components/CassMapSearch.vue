<template>
  <div class="map-search">
    <div class="input-wrapper">
      <input
        v-model="query"
        type="text"
        class="map-search"
        placeholder="Search for somewhere..."
      />

      <ul v-if="showResults" class="results">
        <li
          v-for="(result, index) in results"
          v-html="formatAddress(result.address)"
          :key="index"
          :class="{ active: navIndex === index }"
          @hover="setNavIndex(index)"
          @click="getPlace(result)"
        >index: {{index}}, navIndex: {{navIndex}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import config from '@/config';
import mock from '@/mocks/autocomplete-paris.mock';
import { debounce } from 'lodash/function';
import { get } from 'lodash/object';

const UP_ARROW = 38;
const DOWN_ARROW = 40;
const ENTER = 13;

export default {
  name: 'CassMapSearch',
  watch: {
    query(query) {
      if (query.length > 4) {
        this.enterPressed = false;
        document.addEventListener('keyup', this.keyboardNavigation);
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
        // window.setTimeout(() => resolve(mock), 300);
        fetch(this.autocompleteUrl(query))
          .then(res => res.json()
            .then(res => resolve(res.suggestions))
            .catch(reject)
          ).catch(reject);
      });
    },
    stripHTML(str) {
      return str.replace(/<\/?[^>]+(>|$)/g, '');
    },
    geocodeUrl(result) {
      return `http://geocoder.cit.api.here.com/6.2/geocode.json?locationid=${encodeURIComponent(result.locationId)}&jsonattributes=1&gen=9&app_id=${config.HERE_APP_ID}&app_code=${config.HERE_APP_CODE}`;
    },
    geocode(result) {
      return new Promise((resolve, reject) => {
        fetch(this.geocodeUrl(result))
          .then(res => res.json()
            .then(res => resolve(res))
            .catch(reject)
          ).catch(reject);
      });
    },
    searchPlaces: debounce(function (query) {
      this.autocomplete(encodeURIComponent(query)).then((json) => {
        if (this.enterPressed) {
          this.getPlace(json[0]);
        } else {
          this.showResults = true;
          this.results = json;
        }
      });
    }, 300),
    getPlace(result) {
      this.geocode(result).then((json) => {
        const place = get(json, 'response.view[0].result[0].location');
        if (place) this.$emit('place', place);
      });
    },
    keyboardNavigation(e) {
      if (e.keyCode === UP_ARROW && this.navIndex === null) this.navIndex = this.results.length;
      else if (e.keyCode === UP_ARROW && this.navIndex >= 0) this.navIndex--;
      else if (e.keyCode === DOWN_ARROW && this.navIndex === null) this.navIndex = 0;
      else if (e.keyCode === DOWN_ARROW && this.navIndex <= this.results.length) this.navIndex++;
      else if (e.keyCode === ENTER && this.showResults) this.getPlace(this.results[this.navIndex]);
      else if (e.keyCode === ENTER) this.enterPressed = true;
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
  },
  data() {
    return {
      query: '',
      results: [],
      navIndex: null,
      showResults: false,
      enterPressed: false,
      matchLevels: [
        'houseNumber',
        'intersection',
        'street',
        'district',
        'city',
        'county',
        'postalCode',
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
  margin-bottom: $space;
  .input-wrapper {
    position: relative;
    input {
      width: 100%;
      margin: $space 0 0 0;
      padding: $space-small;
      z-index: 1;
      @include placeholder() {
        font-style: italic;
        color: $grey;
        font-size: 12px;
      }
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
        top: 26px;
        &.active, &:hover {
          background-color: $highlight;
        }
      }
    }
  }
}
</style>
