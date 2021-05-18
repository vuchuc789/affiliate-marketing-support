import { createStore } from 'vuex';

import notificationModule from './notification';
import authModule from './auth';

export default createStore({
  modules: { notification: notificationModule, auth: authModule },
});
