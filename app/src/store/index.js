import { createStore } from 'vuex';

import notificationModule from './notification';
import authModule from './auth';
import navigationModule from './navigation';

console.log(navigationModule);

export default createStore({
  modules: {
    notification: notificationModule,
    auth: authModule,
    navigation: navigationModule,
  },
});
