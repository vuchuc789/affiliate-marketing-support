<template>
  <Navigator />
  <router-view></router-view>
</template>

<script>
import Navigator from './components/Navigator.vue';

export default {
  name: 'App',
  components: { Navigator },
};
</script>

<style>
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
</style>
