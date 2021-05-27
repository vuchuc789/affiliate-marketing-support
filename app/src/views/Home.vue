<template>
  <navigator />
  <div class="container">
    <router-link class="btn" to="/editor">Create your store now</router-link>
  </div>
  <notification />
</template>

<script>
import Navigator from '../components/Navigator.vue';
import Notification from '../components/Notification.vue';

export default {
  name: 'Home',
  components: { Navigator, Notification },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--nav-height));
}
</style>
