// import { LOGOUT } from './action-types';

const {
  SET_SHOWED_DROPDOWN,
  ADD_TO_DROPDOWN,
  REMOVE_FROM_DROPDOWN,
} = require('./mutation-types');

export const dropDownItems = {
  login: {
    key: 'login',
    title: 'Login',
    priority: 10,
    callback: async () => {
      const { default: router } = await import('../router');
      const { default: store } = await import('.');

      router.push('/login');
      store.commit(SET_SHOWED_DROPDOWN, { isShowed: false });
    },
  },
  register: {
    key: 'register',
    title: 'Register',
    priority: 11,
    callback: async () => {
      const { default: router } = await import('../router');
      const { default: store } = await import('.');

      router.push('/register');
      store.commit(SET_SHOWED_DROPDOWN, { isShowed: false });
    },
  },
  logout: {
    key: 'logout',
    title: 'Logout',
    priority: 12,
    callback: async () => {
      const { default: store } = await import('.');
      const { LOGOUT } = await import('./action-types');

      store.dispatch(LOGOUT, {
        callback: async () => {
          const { default: router } = await import('../router');

          router.push('/');
        },
      });
      store.commit(SET_SHOWED_DROPDOWN, { isShowed: false });
    },
  },
};

const navigationModule = {
  state: {
    isShowed: false,
    dropdownMenu: [],
  },
  mutations: {
    [SET_SHOWED_DROPDOWN]: (state, { isShowed }) => {
      if (state.dropdownMenu.length === 0) {
        state.isShowed = false;
        return;
      }

      state.isShowed = isShowed;
    },
    [ADD_TO_DROPDOWN]: (state, { items }) => {
      if (!Array.isArray(items)) {
        return;
      }

      const newList = [...state.dropdownMenu];

      for (let item of items) {
        if (
          typeof item === 'object' &&
          typeof item.key === 'string' &&
          typeof dropDownItems[item.key] === 'object'
        ) {
          let index = state.dropdownMenu.findIndex(
            (element) => element.key === item.key
          );

          if (index === -1) {
            newList.push(dropDownItems[item.key]);
            index = newList.length - 1;
          }

          if (typeof item.callback === 'function') {
            newList[index].callback = item.callback;
          }
        }

        newList.sort((a, b) => a.priority > b.priority);
        state.dropdownMenu = newList;
      }
    },
    [REMOVE_FROM_DROPDOWN]: (state, { keys }) => {
      if (!Array.isArray(keys)) {
        return;
      }

      const newList = [...state.dropdownMenu];

      for (let key of keys) {
        const index = newList.findIndex((element) => element.key === key);

        if (index >= 0) {
          newList.splice(index, 1);
        }
      }

      state.dropdownMenu = newList;
    },
  },
};

export default navigationModule;
