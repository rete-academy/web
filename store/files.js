/* eslint-disable no-param-reassign */
// import consola from 'consola'
import {
  GET_FILES,
  SET_FILES,
  DELETE_FILES,
} from '@/store/types';

export const state = () => ({
  files: [],
});

export const getters = {
  files: (state) => state.files,
};

export const actions = {
  async [GET_FILES]({ commit }) {
    const { data } = await this.$axios.get('/api/files');
    commit(SET_FILES, data.message);
    return data.message;
  },

  async [DELETE_FILES]({ dispatch }, ids) {
    const { data } = await this.$axios.patch('/api/files/delete', { ids });
    dispatch(GET_FILES);
    return data.message;
  },
};

export const mutations = {
  [SET_FILES](state, data) {
    state.files = data;
  },
};
