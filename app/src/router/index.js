import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Editor from '../views/Editor.vue';

import store from '../store/index';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Login,
    props: { register: true },
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authGuard = ['Editor'];
  const noAuthGuard = ['Login', 'Register'];

  if (store.getters.isLoggedIn()) {
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
