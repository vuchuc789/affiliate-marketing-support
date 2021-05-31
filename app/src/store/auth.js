import {
  SET_AUTHENTICATING,
  SET_ACCESS_TOKEN,
  SET_REFRESH_INTERVAL_ID,
  SET_REFRESH_TOKEN,
} from './mutation-types';
import {
  GET_FROM_LOCAL_STORAGE,
  LOGIN,
  LOGOUT,
  PERIODICALLY_REFRESH_TOKEN,
  POP_UP_ERROR,
  POP_UP_MESSAGE,
  REFRESH_TOKEN,
  REGISTER,
} from './action-types';
import { register, login, refreshAccessToken } from '../api/auth';

const refreshFailureTimeout = 60 * 1000;
const refreshTokenInterval = 60 * 60 * 1000;

const authModule = {
  state: {
    accessToken: '',
    refreshToken: '',
    refreshIntervalId: 0,
    isAuthenticating: false,
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.refreshToken,
  },
  mutations: {
    [SET_ACCESS_TOKEN]: (state, { accessToken }) => {
      state.accessToken = accessToken;
    },
    [SET_REFRESH_TOKEN]: (state, { refreshToken }) => {
      state.refreshToken = refreshToken;

      if (!window.localStorage) {
        return;
      }

      if (refreshToken === '') {
        window.localStorage.removeItem('refresh_token');
        return;
      }

      window.localStorage.setItem('refresh_token', refreshToken);
    },
    [SET_REFRESH_INTERVAL_ID]: (state, { id }) => {
      if (typeof id !== 'number') {
        return;
      }

      if (state.refreshIntervalId > 0) {
        clearInterval(state.refreshIntervalId);
      }

      state.refreshIntervalId = id;
    },
    [SET_AUTHENTICATING]: (state, { isAuthenticating }) => {
      state.isAuthenticating = isAuthenticating;
    },
  },
  actions: {
    [GET_FROM_LOCAL_STORAGE]: ({ dispatch, commit }, { callback } = {}) => {
      if (!window.localStorage) {
        return;
      }

      commit(SET_AUTHENTICATING, { isAuthenticating: true });

      const refreshToken = window.localStorage.getItem('refresh_token');

      if (!refreshToken) {
        commit(SET_AUTHENTICATING, { isAuthenticating: false });

        return;
      }

      commit(SET_REFRESH_TOKEN, { refreshToken });
      dispatch(REFRESH_TOKEN, { callback });
      dispatch(PERIODICALLY_REFRESH_TOKEN);

      commit(SET_AUTHENTICATING, { isAuthenticating: false });
    },
    [REGISTER]: async (
      { commit, dispatch, state },
      { email, password, rePassword, callback }
    ) => {
      try {
        if (state.isAuthenticating) {
          dispatch(POP_UP_ERROR, {
            error: 'You are in another authenticating process',
          });

          return;
        }

        commit(SET_AUTHENTICATING, { isAuthenticating: true });

        if (
          typeof email !== 'string' ||
          typeof password !== 'string' ||
          typeof rePassword !== 'string'
        ) {
          dispatch(POP_UP_ERROR, { error: 'Wrong input type' });
          commit(SET_AUTHENTICATING, { isAuthenticating: false });
          return;
        }

        if (password !== rePassword) {
          dispatch(POP_UP_ERROR, { error: 'Password not matched' });
          commit(SET_AUTHENTICATING, { isAuthenticating: false });
          return;
        }

        const { message, user_id: userId } = await register(email, password);

        if (!userId) {
          dispatch(POP_UP_ERROR, { error: message || 'Register failure' });
          commit(SET_AUTHENTICATING, { isAuthenticating: false });
          return;
        }

        if (typeof callback === 'function') {
          callback();
        }

        commit(SET_AUTHENTICATING, { isAuthenticating: false });
        dispatch(POP_UP_MESSAGE, {
          message: message || 'Register successfully',
        });
      } catch (error) {
        dispatch(POP_UP_ERROR, { error: error.message });
      }
    },
    [LOGIN]: async (
      { dispatch, commit, state },
      { email, password, callback }
    ) => {
      try {
        if (state.isAuthenticating) {
          dispatch(POP_UP_ERROR, {
            error: 'You are in another authenticating process',
          });

          return;
        }

        commit(SET_AUTHENTICATING, { isAuthenticating: true });

        if (typeof email !== 'string' || typeof password !== 'string') {
          dispatch(POP_UP_ERROR, { error: 'Wrong input type' });
          commit(SET_AUTHENTICATING, { isAuthenticating: false });
          return;
        }

        const {
          message,
          access_token: accessToken,
          refresh_token: refreshToken,
        } = await login(email, password);

        if (!accessToken || !refreshToken) {
          dispatch(POP_UP_ERROR, { error: message || 'Something went wrong' });
          commit(SET_AUTHENTICATING, { isAuthenticating: false });
          return;
        }

        commit(SET_REFRESH_TOKEN, { refreshToken });
        commit(SET_ACCESS_TOKEN, { accessToken });
        dispatch(PERIODICALLY_REFRESH_TOKEN);

        if (typeof callback === 'function') {
          callback();
        }

        commit(SET_AUTHENTICATING, { isAuthenticating: false });
        dispatch(POP_UP_MESSAGE, { message: message || 'Login successfully' });
      } catch (error) {
        dispatch(POP_UP_ERROR, { error: error.message });
      }
    },
    [REFRESH_TOKEN]: async ({ dispatch, commit, state }, { callback } = {}) => {
      if (!state.refreshToken) {
        setTimeout(() => {
          dispatch(REFRESH_TOKEN, { callback });
        }, refreshFailureTimeout);

        return;
      }

      const { access_token: accessToken } = await refreshAccessToken(
        state.refreshToken
      );

      if (!accessToken) {
        setTimeout(() => {
          dispatch(REFRESH_TOKEN, { callback });
        }, refreshFailureTimeout);

        return;
      }

      commit(SET_ACCESS_TOKEN, { accessToken });

      if (typeof callback === 'function') {
        callback();
      }
    },
    [PERIODICALLY_REFRESH_TOKEN]: async ({ dispatch, commit }) => {
      const intervalId = setInterval(() => {
        dispatch(REFRESH_TOKEN);
      }, refreshTokenInterval);

      commit(SET_REFRESH_INTERVAL_ID, { id: intervalId });
    },
    [LOGOUT]: ({ dispatch, commit }, { callback } = {}) => {
      commit(SET_ACCESS_TOKEN, { accessToken: '' });
      commit(SET_REFRESH_TOKEN, { refreshToken: '' });
      commit(SET_REFRESH_INTERVAL_ID, { id: 0 });

      dispatch(POP_UP_MESSAGE, { message: 'Logout successfully' });

      if (typeof callback === 'function') {
        callback();
      }
    },
  },
};

export default authModule;
