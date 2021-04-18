import { createStore } from 'vuex';
import {
  CAUSE_ERROR,
  SET_USER_ID,
  CLEAR_ERROR,
  CLEAR_USER_ID,
} from './mutation-types';
import { LOGIN, REGISTER } from './action-types';

export default createStore({
  state: {
    userId: '',
    accessToken: '',
    error: '',
  },
  getters: {
    isLoggedIn: (state) => () => !!state.userId,
  },
  mutations: {
    [SET_USER_ID](state, { userId, token }) {
      if (typeof userId === 'string' && typeof token === 'string') {
        state.userId = userId;
        state.accessToken = token;
      }
    },
    [CAUSE_ERROR](state, { error }) {
      state.error = error;
    },
    [CLEAR_ERROR](state) {
      state.error = '';
    },
    [CLEAR_USER_ID](state) {
      state.userId = '';
      state.accessToken = '';
    },
  },
  actions: {
    async [LOGIN]({ commit }, { username, password }) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_URI + '/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          }
        );
        const { id: userId, token, error } = await response.json();

        if (typeof userId === 'string' && typeof token === 'string') {
          commit(SET_USER_ID, { userId, token });
          commit(CLEAR_ERROR);
          return;
        }

        commit(CAUSE_ERROR, { error });
      } catch (e) {
        commit(CAUSE_ERROR, { error: e.message });
      }
    },
    async [REGISTER]({ commit }, { username, password, rePassword, callback }) {
      try {
        if (password !== rePassword) {
          commit(CAUSE_ERROR, { error: "Passwords aren't match" });
          return;
        }

        const response = await fetch(
          process.env.VUE_APP_API_URI + '/api/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          }
        );

        const { username: resUsername } = await response.json();

        if (resUsername === username) {
          callback();
          return;
        }

        commit(CAUSE_ERROR, { error: 'Register fail' });
      } catch (e) {
        commit(CAUSE_ERROR, { error: e.message });
      }
    },
  },
  modules: {},
});
