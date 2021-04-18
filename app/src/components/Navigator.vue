<template>
  <div class="navbar">
    <router-link to="/">Logo</router-link>
    <div class="drop-btn" @click="hideDrop">drop menu</div>
    <div class="drop-menu" :class="{ 'drop-hide': !showed }">
      <span
        v-for="{ title, url } in items"
        :key="{ title }"
        @click="goTo(url)"
        >{{ title }}</span
      >
    </div>
  </div>
</template>

<script>
import { CLEAR_USER_ID } from '../store/mutation-types';

export default {
  name: 'Navigator',
  data() {
    return {
      showed: false,
      items: [
        { title: 'login', url: '/login' },
        { title: 'register', url: '/register' },
      ],
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn();
    },
  },
  watch: {
    isLoggedIn(loggedIn) {
      if (!loggedIn) {
        this.items = [
          { title: 'login', url: '/login' },
          { title: 'register', url: '/register' },
        ];
        return;
      }

      this.items = [{ title: 'logout', url: '/logout' }];
    },
  },
  methods: {
    hideDrop() {
      this.showed = !this.showed;
    },
    goTo(link) {
      if (link === '/logout') {
        this.$store.commit(CLEAR_USER_ID);
        this.hideDrop();
        console.log(this.$store.state);

        return;
      }

      this.$router.push(link);
      this.showed = false;
    },
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: hsl(212, 80%, 50%);
  top: 0;
  width: 100vw;
  height: var(--nav-height);
  user-select: none;
  z-index: 1000;
}

.drop-btn {
  cursor: pointer;
}

.drop-menu {
  position: absolute;
  right: 0;
  top: var(--nav-height);
  background-color: red;
  width: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
}

.drop-hide {
  display: none;
}

.drop-menu > span {
  margin: 0.3rem;
  cursor: pointer;
}
</style>
