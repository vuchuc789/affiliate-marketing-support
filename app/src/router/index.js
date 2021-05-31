import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Auth from '../views/Auth.vue';
import Editor from '../views/Editor.vue';
import Preview from '../views/Preview.vue';
import Store from '../views/Store.vue';

import store from '../store/index';
import { SET_SHOWED_DROPDOWN } from '../store/mutation-types';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Auth,
    props: { type: 'login' },
  },
  {
    path: '/register',
    name: 'Register',
    component: Auth,
    props: { type: 'register' },
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
  },
  {
    path: '/preview',
    name: 'Preview',
    component: Preview,
  },
  {
    path: '/store/:userId',
    name: 'Store',
    component: Store,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authGuard = ['Editor', 'Preview'];
  const noAuthGuard = ['Login', 'Register'];

  if (store.getters.isAuthenticated) {
    if (noAuthGuard.includes(to.name)) {
      next({ name: 'Home' });
      return;
    }
  } else {
    if (authGuard.includes(to.name)) {
      next({ name: 'Login' });
      return;
    }
  }

  store.commit(SET_SHOWED_DROPDOWN, { isShowed: false });

  next();
});

export default router;
