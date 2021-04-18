<template>
  <div>{{ error }}</div>
</template>

<script>
import { mapMutations } from 'vuex';
import { CLEAR_ERROR } from '../store/mutation-types';

export default {
  name: 'Error',
  data() {
    return {
      timeoutId: 0,
    };
  },
  computed: {
    error() {
      return this.$store.state.error;
    },
  },
  watch: {
    error(newVal) {
      if (this.timeoutId > 0) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }

      if (newVal) {
        this.timeoutId = setTimeout(
          function () {
            this.clearError();
          }.bind(this),
          1000
        );
      }
    },
  },
  methods: {
    ...mapMutations({
      clearError: CLEAR_ERROR,
    }),
  },
};
</script>

<style scoped>
div {
  position: fixed;
  bottom: 0.5rem;
  left: 0.5rem;
  background-color: red;
}
</style>
