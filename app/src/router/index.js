import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Auth from '../views/Auth.vue';
import Editor from '../views/Editor.vue';

import store from '../store/index';

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
  const authGuard = ['Editor'];
  const noAuthGuard = ['Login', 'Register'];

  if (store.getters.isAuthenticated()) {
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

  next();
});

export default router;
