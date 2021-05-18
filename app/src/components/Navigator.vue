<template>
  <div class="navbar">
    <router-link to="/" class="nav-logo">Logo</router-link>
    <a class="drop-btn" @click="hideDrop"></a>
    <div class="drop-menu" :class="{ 'drop-hide': !showed }">
      <a v-for="{ title, url } in items" :key="{ title }" @click="goTo(url)">{{
        title
      }}</a>
    </div>
  </div>
</template>

<script>
import { LOGOUT } from '../store/action-types';

export default {
  name: 'Navigator',
  data() {
    return {
      showed: false,
      items: [],
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated();
    },
  },
  watch: {
    isAuthenticated(authenticated) {
      this.setItems(authenticated);
    },
  },
  methods: {
    hideDrop() {
      this.showed = !this.showed;
    },
    goTo(link) {
      if (link === '/logout') {
        this.$store.dispatch(LOGOUT, {
          callback: () => {
            this.$router.push('/');
          },
        });
      } else {
        this.$router.push(link);
      }

      this.showed = false;
    },
    setItems(authenticated) {
      if (!authenticated) {
        this.items = [
          { title: 'login', url: '/login' },
          { title: 'register', url: '/register' },
        ];
      } else {
        this.items = [{ title: 'logout', url: '/logout' }];
      }
    },
  },
  created() {
    this.setItems(this.isAuthenticated);
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
  background-color: #ff6868;
  top: 0;
  width: 100vw;
  height: var(--nav-height);
  user-select: none;
  z-index: 1000;
}

.nav-logo {
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 2em;
  letter-spacing: 2px;
  color: #fff;
}

.drop-btn,
.drop-btn::before,
.drop-btn::after {
  cursor: pointer;
  width: 1.8rem;
  height: 0.3rem;
  border-radius: 1rem;
  background-color: #fff;
}

.drop-btn {
  position: relative;
}

.drop-btn::before,
.drop-btn::after {
  position: absolute;
  content: '';
}

.drop-btn::before {
  transform: translateY(0.5rem);
}

.drop-btn::after {
  transform: translateY(-0.5rem);
}

.drop-menu {
  position: absolute;
  right: 0;
  top: var(--nav-height);
  background-color: #ffbcbc;
  width: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  margin: 0.2rem;
  border-radius: 0.5rem;
}

.drop-hide {
  display: none;
}

.drop-menu > a {
  cursor: pointer;
  color: #3c2f2f;
  width: 100%;
  text-align: center;
  padding: 0.3rem;
  font-size: 1rem;
}

.drop-menu > a:not(:last-child) {
  border-bottom: 1px solid #3c2f2f;
}
</style>
