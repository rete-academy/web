/* eslint-disable no-param-reassign */
import consola from 'consola';
import {
  CREATE_SPRINT,
  DELETE_SPRINT,
  GET_SPRINTS,
  SET_SPRINTS,
  ADD_MATERIALS,
  REMOVE_MATERIALS,
  SET_SELECTED_SRPINT,
} from '@/store/types';

export const state = () => ({
  sprints: [],
  selectedSprint: '',
});

export const getters = {
  sprints: (state) => state.sprints,
  selectedSprint: (state) => state.selectedSprint,
};

export const actions = {
  async [CREATE_SPRINT]({ dispatch }, data) {
    const response = await this.$axios.post('/api/sprints', data);
    dispatch(GET_SPRINTS);
    return response.data.message;
  },

  async [DELETE_SPRINT]({ dispatch }, id) {
    const response = await this.$axios.delete(`/api/sprints/${id}`);
    dispatch(GET_SPRINTS);
    return response.data.message;
  },

  async [GET_SPRINTS]({ commit }) {
    const response = await this.$axios.get('/api/sprints');
    commit(SET_SPRINTS, response.data.message);
    return response.data.message;
  },

  async [ADD_MATERIALS]({ dispatch }, { sprintId, materialIds }) {
    const response = await this.$axios.put(`/api/sprints/${sprintId}/add-materials`, {
      id: materialIds,
    });
    dispatch(GET_SPRINTS);
    consola.trace(response.data.message);
    return response.data.message;
  },

  async [REMOVE_MATERIALS]({ dispatch }, { sprintId, materialIds }) {
    const response = await this.$axios.put(`/api/sprints/${sprintId}/remove-materials`, {
      id: materialIds,
    });
    dispatch(GET_SPRINTS);
    consola.trace(response.data.message);
    return response.data.message;
  },
};

export const mutations = {
  [SET_SPRINTS](state, data) {
    state.sprints = data;
  },
  [SET_SELECTED_SRPINT](state, data) {
    state.selectedSprint = data;
  },
};
