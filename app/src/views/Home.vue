<template>
  <div class="container">
    <router-link class="btn" to="/login">Create your store now</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--nav-height));
}
.btn {
}
</style>
