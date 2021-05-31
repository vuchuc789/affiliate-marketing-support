<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import { mapMutations } from 'vuex';
import { GET_FROM_LOCAL_STORAGE } from './store/action-types';
import { ADD_TO_DROPDOWN } from './store/mutation-types';
import { dropDownItems } from './store/navigation';

export default {
  name: 'App',
  methods: mapMutations({
    addToDropdown: ADD_TO_DROPDOWN,
  }),
  created: function () {
    const { login, register } = dropDownItems;
    this.addToDropdown({ items: [login, register] });

    this.$store.dispatch(GET_FROM_LOCAL_STORAGE);
  },
};
</script>

<style>
:root {
  --nav-height: 3rem;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 100%;
  line-height: 1.6;
}

.container {
  margin-top: var(--nav-height) !important;
}
</style>
