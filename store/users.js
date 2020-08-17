/* eslint-disable no-param-reassign */
import {
  CONFIRM_EMAIL,
  ENROLL,
  UNENROLL,
  INCREASE_PROGRESS,
  DECREASE_PROGRESS,
  FETCH_PROFILE,
  SET_PROFILE,
  FORGOT,
  GET_USER,
  GET_USERS,
  RESEND_CONFIRM,
  RESET,
  SET_USERS,
  SIGN_UP,
  UPDATE_STATUS,
  UPDATE_USER,
} from '@/store/types';

export const state = () => ({
  profile: {},
  users: [],
});

export const getters = {
  profile: (state) => state.profile,
  users: (state) => state.users,
};

export const actions = {
  async [FETCH_PROFILE]({ commit }) {
    await this.$auth.fetchUser();
    commit(SET_PROFILE, this.$auth.user);
  },

  async [SIGN_UP](_, value) {
    const { data } = await this.$axios.post('/api/users', value);
    return data.message;
  },

  async [GET_USERS]({ commit }) { // Need to do pagination
    const { data } = await this.$axios.get('/api/users');
    commit(SET_USERS, data.message);
    return data.message;
  },

  async [GET_USER](_, username) {
    const { data } = await this.$axios.get(`/api/users/${username}`);
    return data.message;
  },

  async [CONFIRM_EMAIL](_, code) {
    const ep = `/api/users/confirm/${code}`;
    const { data } = await this.$axios.put(ep);
    return data.message;
  },

  async [RESEND_CONFIRM](_, email) {
    const ep = '/api/users/profile/send-confirm';
    const { data } = await this.$axios.post(ep, { email });
    return data.message;
  },

  async [FORGOT](_, email) {
    const ep = '/api/password/forgot';
    const { data } = await this.$axios.post(ep, { email });
    return data.message;
  },

  async [RESET](_, { token, password }) {
    const ep = `/api/password/reset?token=${token}`;
    const { data } = await this.$axios.post(ep, { password });
    return data.message;
  },

  async [UPDATE_USER]({ dispatch }, { userId, data: value }) {
    const ep = `/api/users/${userId}`;
    const { data } = await this.$axios.put(ep, value);
    await dispatch(FETCH_PROFILE);
    return data.message;
  },

  async [ENROLL]({ dispatch }, { userId, data: value }) {
    const ep = `/api/users/${userId}/enroll`;
    const { data } = await this.$axios.put(ep, { data: value });
    await dispatch(FETCH_PROFILE);
    return data.message;
  },

  async [UNENROLL]({ dispatch }, { userId, data: value }) {
    const ep = `/api/users/${userId}/unenroll`;
    const { data } = await this.$axios.put(ep, { data: value });
    await dispatch(FETCH_PROFILE);
    return data.message;
  },

  async [INCREASE_PROGRESS]({ dispatch }, { userId, data: value }) {
    const ep = `/api/users/${userId}/increase`;
    const { data } = await this.$axios.put(ep, { data: value });
    await dispatch(FETCH_PROFILE);
    return data.message;
  },

  async [DECREASE_PROGRESS]({ dispatch }, { userId, data: value }) {
    const ep = `/api/users/${userId}/decrease`;
    const { data } = await this.$axios.put(ep, { data: value });
    await dispatch(FETCH_PROFILE);
    return data.message;
  },

  async [UPDATE_STATUS](_, { userId, data: value }) {
    const ep = `/api/users/${userId}/update-status`;
    const { data } = await this.$axios.put(ep, value);
    return data.message;
  },
};

export const mutations = {
  [SET_PROFILE](state, data) {
    state.profile = data;
  },
  [SET_USERS](state, data) {
    state.users = data;
  },
};
