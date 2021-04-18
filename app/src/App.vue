<template>
  <Navigator />
  <router-view :key="$route.fullPath" class="container"></router-view>
  <Error />
</template>

<script>
import Navigator from './components/Navigator.vue';
import Error from './components/Error.vue';

export default {
  name: 'App',
  components: { Navigator, Error },
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
