const {
  SET_SHOWED_DROPDOWN,
  ADD_TO_DROPDOWN,
  REMOVE_FROM_DROPDOWN,
} = require('./mutation-types');

export const dropDownItems = {
  login: {
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
  editorSave: {
    title: 'Save your website',
    priority: 8,
  },
  editor: {
    title: 'Edit your website',
    priority: 9,
    callback: async () => {
      const { default: router } = await import('../router');
      const { default: store } = await import('.');

      router.push('/editor');
      store.commit(SET_SHOWED_DROPDOWN, { isShowed: false });
    },
  },
  preview: {
    title: 'View your website',
    priority: 7,
    callback: async () => {
      const { default: router } = await import('../router');
      const { default: store } = await import('.');

      router.push('/preview');
      store.commit(SET_SHOWED_DROPDOWN, { isShowed: false });
    },
  },
  publish: {
    title: 'Publish your website',
    priority: 6,
    callback: async () => {
      const { default: store } = await import('.');
      const { POP_UP_ERROR, POP_UP_MESSAGE } = await import('./action-types');
      const { publishPage } = await import('../api/page');

      const result = await publishPage();

      store.commit(SET_SHOWED_DROPDOWN, { isShowed: false });

      if (!result.success) {
        store.dispatch(POP_UP_ERROR, {
          message: result.message || 'Something went wrong',
        });
        return;
      }

      store.dispatch(POP_UP_MESSAGE, {
        message: result.message || 'Published successfully',
      });
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

      const newMenu = [...state.dropdownMenu];

      for (const item of items) {
        if (!newMenu.find((val) => val.title === item.title)) {
          if (!item.priority) {
            item.priority = 0;
          }

          newMenu.push(item);
        }
      }

      newMenu.sort((a, b) => a.priority - b.priority);
      state.dropdownMenu = newMenu;
    },
    [REMOVE_FROM_DROPDOWN]: (state, { items }) => {
      if (!Array.isArray(items)) {
        return;
      }

      const newMenu = state.dropdownMenu.filter(
        (val1) => !items.find((val2) => val1.title === val2.title)
      );
      state.dropdownMenu = newMenu;
    },
  },
};

export default navigationModule;
