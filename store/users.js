/* eslint-disable no-param-reassign */
import {
  FORGOT,
  RESET,
  SIGN_UP,
  FETCH_USER,
  GET_USERS,
  SET_USER,
  SET_USERS,
  CONFIRM_EMAIL,
  RESEND_CONFIRM,
  UPDATE_STATUS,
  UPDATE_USER,
  UPDATE_PROGRESS,
} from '@/store/types';

export const state = () => ({
  profile: {},
  paths: [],
  path: {},
  users: [],
});

export const getters = {
  profile: (state) => state.profile,
  paths: (state) => state.paths,
  path: (state) => state.path,
  users: (state) => state.users,
};

export const actions = {
  async [FETCH_USER]({ commit }) {
    await this.$auth.fetchUser();
    commit(SET_USER, this.$auth.user);
  },

  async [SIGN_UP](_, data) {
    const response = await this.$axios.post('/api/users', data);
    return response.data.message;
  },

  async [GET_USERS]({ commit }) {
    const { data } = await this.$axios.get('/api/users');
    commit(SET_USERS, data.message);
    return data.message;
  },

  async [CONFIRM_EMAIL](_, code) {
    const response = await this.$axios.put(`/api/users/confirm/${code}`);
    return response.data.message;
  },

  async [RESEND_CONFIRM](_, email) {
    const endpoint = '/api/users/profile/send-confirm';
    const response = await this.$axios.post(endpoint, { email });
    return response.data.message;
  },

  async [FORGOT](_, email) {
    const response = await this.$axios.post('/api/password/forgot', { email });
    return response.data.message;
  },

  async [RESET](_, { token, password }) {
    const endpoint = `/api/password/reset?token=${token}`;
    const response = await this.$axios.post(endpoint, { password });
    return response.data.message;
  },

  async [UPDATE_USER]({ dispatch }, { id, data }) {
    const response = await this.$axios.put(`/api/users/${id}`, data);
    dispatch(GET_USERS);
    dispatch(FETCH_USER);
    return response.data.message;
  },

  async [UPDATE_STATUS](_, { userId, data }) {
    const endpoint = `/api/users/${userId}/update-status`;
    const response = await this.$axios.put(endpoint, data);
    return response.data.message;
  },

  async [UPDATE_PROGRESS](_, { userId, data }) {
    const endpoint = `/api/users/${userId}/update-progress`;
    const response = await this.$axios.put(endpoint, data);
    return response.data.message;
  },
};

export const mutations = {
  [SET_USER](state, data) {
    state.profile = data;
  },
  [SET_USERS](state, data) {
    state.users = data;
  },
};
