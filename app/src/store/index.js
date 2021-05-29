import { createStore } from 'vuex';

import notificationModule from './notification';
import authModule from './auth';
import navigationModule from './navigation';

export default createStore({
  modules: {
    notification: notificationModule,
    auth: authModule,
    navigation: navigationModule,
  },
});
