/* eslint-disable no-param-reassign */
import consola from 'consola';
import {
  CREATE_PATH,
  UPDATE_PATH,
  DELETE_PATH,
  GET_PATHS,
  SET_PATHS,
  GET_PATH,
  SET_PATH,
  ADD_SPRINTS,
  REMOVE_SPRINTS,
  ENROLL,
  UNENROLL,
} from '@/store/types';

export const state = () => ({
  paths: [],
  path: {},
});

export const getters = {
  paths: (state) => state.paths,
  path: (state) => state.path,
};

export const actions = {
  async [CREATE_PATH]({ dispatch }, data) {
    const response = await this.$axios.post('/api/paths', data);
    dispatch(GET_PATHS);
    return response.data.message;
  },

  async [UPDATE_PATH]({ dispatch }, { pathId, data }) {
    const response = await this.$axios.put(`/api/paths/${pathId}`, data);
    dispatch(GET_PATHS);
    return response.data.message;
  },

  async [DELETE_PATH]({ dispatch }, id) {
    const response = await this.$axios.delete(`/api/paths/${id}`);
    dispatch(GET_PATHS);
    return response.data.message;
  },

  async [GET_PATHS]({ commit }) {
    const response = await this.$axios.get('/api/paths');
    commit(SET_PATHS, response.data.message);
    consola.trace(response.data.message);
    return response.data.message;
  },

  async [GET_PATH]({ commit }, slug) {
    const response = await this.$axios.get(`/api/paths/${slug}`);
    commit(SET_PATH, response.data.message[0]);
    consola.trace(response.data.message[0]);
    return response.data.message[0];
  },

  async [ADD_SPRINTS]({ dispatch }, { pathId, sprintIds }) {
    const endpoint = `/api/paths/${pathId}/add-sprints`;
    const response = await this.$axios.put(endpoint, { id: sprintIds });
    dispatch(GET_PATHS);
    consola.trace(response.data.message);
    return response.data.message;
  },

  async [REMOVE_SPRINTS]({ dispatch }, { pathId, sprintIds }) {
    const endpoint = `/api/paths/${pathId}/remove-sprints`;
    const response = await this.$axios.put(endpoint, { id: sprintIds });
    dispatch(GET_PATHS);
    consola.trace(response.data.message);
    return response.data.message;
  },

  async [ENROLL]({ dispatch }, { pathId, userIds }) {
    const endpoint = `/api/paths/${pathId}/enroll`;
    const response = await this.$axios.put(endpoint, { id: userIds });
    dispatch(GET_PATHS);
    consola.trace(response.data.message);
    return response.data.message;
  },

  async [UNENROLL]({ dispatch }, { pathId, userIds }) {
    const endpoint = `/api/paths/${pathId}/unenroll`;
    const response = await this.$axios.put(endpoint, { id: userIds });
    dispatch(GET_PATHS);
    consola.trace(response.data.message);
    return response.data.message;
  },
};

export const mutations = {
  [SET_PATHS](state, data) {
    state.paths = data;
  },
  [SET_PATH](state, data) {
    state.path = data;
  },
};
