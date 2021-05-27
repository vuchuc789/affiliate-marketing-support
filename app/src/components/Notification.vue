<template>
  <div class="notification">
    <div v-if="message !== ''" class="noti-message">{{ message }}</div>
    <div v-if="error !== ''" class="noti-error">{{ error }}</div>
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

<style scoped>
.notification {
  position: fixed;
  bottom: 0.5rem;
  left: 0.5rem;
  width: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
}

.notification > div {
  width: 100%;
  overflow: hidden;
  padding: 0.5rem;
  border-radius: 10px;
}

.notification > div:not(:last-child) {
  margin-bottom: 0.5rem;
}

.noti-message {
  background-color: #83ff83;
}

.noti-error {
  background-color: #ff7f7f;
}
</style>
