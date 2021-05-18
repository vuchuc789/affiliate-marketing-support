<template>
  <div class="container">
    <form @keyup.enter="submit">
      <label for="email">email</label>
      <input type="text" id="username" v-model="email" />
      <label for="password">password</label>
      <input type="password" id="password" v-model="password" />
      <label v-if="type === 'register'" for="re-password">re-password</label>
      <input
        v-if="type === 'register'"
        type="password"
        id="re-password"
        v-model="rePassword"
      />
      <div v-if="formType === 'register'" @click="submit" class="submit-btn">
        Signup
      </div>
      <div v-else-if="formType === 'login'" @click="submit" class="submit-btn">
        Login
      </div>
    </form>
  </div>
</template>

<script>
import { LOGIN, REGISTER } from '../store/action-types';

export default {
  name: 'Auth',
  props: {
    type: {
      type: String,
      default: 'login',
    },
  },
  data: function () {
    return {
      email: '',
      password: '',
      rePassword: '',
      formType: this.type,
    };
  },
  methods: {
    submit: function () {
      const { email, password, rePassword } = this;

      switch (this.type) {
        case 'login':
          this.$store.dispatch(LOGIN, {
            email,
            password,
            callback: () => {
              this.$router.push('/');
            },
          });
          break;
        case 'register':
          this.$store.dispatch(REGISTER, {
            email,
            password,
            rePassword,
            callback: () => {
              this.$router.push('/login');
            },
          });
          break;
      }
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
  background-color: gray;
}

form {
  display: grid;
}

.submit-btn {
  cursor: pointer;
}
</style>
