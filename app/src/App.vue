<template>
  <navigator />
  <router-view :key="$route.fullPath" class="container"></router-view>
  <notification />
</template>

<script>
import Navigator from './components/Navigator.vue';
import Notification from './components/Notification.vue';
import { GET_FROM_LOCAL_STORAGE } from './store/action-types';

export default {
  name: 'App',
  components: { Navigator, Notification },
  mounted: function () {
    this.$store.dispatch(GET_FROM_LOCAL_STORAGE, { callback: () => {} });
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
