import {
  SET_ERROR,
  SET_ERROR_CLEARING_TIMEOUT_ID,
  SET_MESSAGE,
  SET_MESSAGE_CLEARING_TIMEOUT_ID,
} from './mutation-types';
import { POP_UP_ERROR, POP_UP_MESSAGE } from './action-types';

const messageTimeout = 1000;
const errorTimeout = 1000;

const notificationModule = {
  state: {
    message: '',
    error: '',
    messageClearingTimeoutId: 0,
    errorClearingTimeoutId: 0,
  },
  mutations: {
    [SET_MESSAGE]: (state, { message }) => {
      if (typeof message === 'string') {
        state.message = message;
      }
    },
    [SET_ERROR]: (state, { error }) => {
      if (typeof error === 'string') {
        state.error = error;
      }
    },
    [SET_MESSAGE_CLEARING_TIMEOUT_ID]: (state, { id }) => {
      if (typeof id === 'number' && id >= 0) {
        state.messageClearingTimeoutId = id;
      }
    },
    [SET_ERROR_CLEARING_TIMEOUT_ID]: (state, { id }) => {
      if (typeof id === 'number' && id >= 0) {
        state.errorClearingTimeoutId = id;
      }
    },
  },
  actions: {
    [POP_UP_MESSAGE]: ({ commit, state }, { message }) => {
      if (state.messageClearingTimeoutId > 0) {
        clearTimeout(state.messageClearingTimeoutId);
      }

      commit(SET_MESSAGE, { message });

      const timeoutId = setTimeout(() => {
        commit(SET_MESSAGE, { message: '' });
        commit(SET_MESSAGE_CLEARING_TIMEOUT_ID, { id: 0 });
      }, messageTimeout);

      commit(SET_MESSAGE_CLEARING_TIMEOUT_ID, { id: timeoutId });
    },
    [POP_UP_ERROR]: ({ commit, state }, { error }) => {
      if (state.errorClearingTimeoutId > 0) {
        clearTimeout(state.errorClearingTimeoutId);
      }

      commit(SET_ERROR, { error });

      const timeoutId = setTimeout(() => {
        commit(SET_ERROR, { error: '' });
        commit(SET_ERROR_CLEARING_TIMEOUT_ID, { id: 0 });
      }, errorTimeout);

      commit(SET_ERROR_CLEARING_TIMEOUT_ID, { id: timeoutId });
    },
  },
};

export default notificationModule;
