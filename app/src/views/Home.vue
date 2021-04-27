<template>
  <div class="container">
    <router-link class="btn" :to="isLoggedIn ? '/editor' : '/login'"
      >Create your store now</router-link
    >
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn();
    },
  },
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
