<template>
  <div class="container">
    <form @keyup.enter="submit">
      <label for="username">username</label>
      <input type="text" name="username" id="username" v-model="username" />
      <label for="password">password</label>
      <input type="password" name="password" id="password" v-model="password" />
      <label v-if="isRegisterForm" for="re-password">re-password</label>
      <input
        v-if="isRegisterForm"
        type="password"
        name="re-password"
        id="re-password"
        v-model="rePassword"
      />
      <div @click="submit" class="submit-btn">
        {{ isRegisterForm ? 'Register' : 'Login' }}
      </div>
    </form>
  </div>
</template>

<script>
import { LOGIN, REGISTER } from '../store/action-types';

export default {
  name: 'Login',
  props: {
    register: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      username: '',
      password: '',
      rePassword: '',
      isRegisterForm: this.register,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn();
    },
  },
  watch: {
    isLoggedIn(newVal) {
      if (newVal) {
        this.redirect();
      }
    },
  },
  methods: {
    submit() {
      const { username, password, rePassword, goToLogin } = this;

      if (this.isRegisterForm) {
        this.$store.dispatch(REGISTER, {
          username,
          password,
          rePassword,
          callback: goToLogin,
        });

        return;
      }

      this.$store.dispatch(LOGIN, {
        username,
        password,
      });
    },
    redirect() {
      this.$router.push('/');
    },
    goToLogin() {
      if (this.isRegisterForm) {
        this.$router.push('/login');
      }
    },
  },
  beforeMount() {
    if (this.isLoggedIn) {
      this.redirect();
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--nav-height));
  background-color: gray;
}

form {
  display: grid;
}

.submit-btn {
  cursor: pointer;
}
</style>
