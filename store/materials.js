/* eslint-disable no-param-reassign */
// import consola from 'consola'
import {
  CREATE_MATERIAL,
  DELETE_MATERIAL,
  GET_MATERIALS,
  SET_MATERIALS,
  GET_MATERIAL,
  SET_MATERIAL,
} from '@/store/types';

export const state = () => ({
  materials: [],
  material: {},
});

export const getters = {
  materials: (state) => state.materials,
  material: (state) => state.material,
};

export const actions = {
  async [CREATE_MATERIAL]({ dispatch }, data) {
    const response = await this.$axios.post('/api/materials', data);
    dispatch(GET_MATERIALS);
    return response.data.message;
  },

  async [DELETE_MATERIAL]({ dispatch }, id) {
    const response = await this.$axios.delete(`/api/materials/${id}`);
    dispatch(GET_MATERIALS);
    return response.data.message;
  },

  async [GET_MATERIALS]({ commit }) {
    const response = await this.$axios.get('/api/materials');
    commit(SET_MATERIALS, response.data.message);
    return response.data.message;
  },

  async [GET_MATERIAL]({ commit }, id) {
    const response = await this.$axios.get(`/api/materials/${id}`);
    commit(SET_MATERIAL, response.data.message);
    return response.data.message;
  },
};

export const mutations = {
  [SET_MATERIALS](state, data) {
    state.materials = data;
  },
  [SET_MATERIAL](state, data) {
    state.material = data;
  },
};
