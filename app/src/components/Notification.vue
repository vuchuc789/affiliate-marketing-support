<template>
  <div>
    <div v-show="message !== ''">{{ message }}</div>
    <div v-show="error !== ''">{{ error }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Notification',
  computed: mapState({
    message: (state) => state.notification.message,
    error: (state) => state.notification.error,
  }),
};
</script>

<style>
h1 {
  font-size: 3rem;
}
</style>
