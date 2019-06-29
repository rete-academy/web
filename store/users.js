// import consola from 'consola'
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
  UPDATE_PROGRESS
} from '@/store/types'

export const state = () => ({
  profile: {},
  paths: [],
  path: {},
  users: []
})

export const getters = {
  profile: state => state.profile,
  paths: state => state.paths,
  path: state => state.path,
  users: state => state.users
}

export const actions = {
  async [FETCH_USER]({ commit }) {
    try {
      await this.$auth.fetchUser()
      commit(SET_USER, this.$auth.user)
    } catch (error) {
      throw error
    }
  },

  async [SIGN_UP]({ commit }, data) {
    try {
      const response = await this.$axios.post('/api/users', data)
      return response.data.message
    } catch (error) {
      throw error
    }
  },

  async [GET_USERS]({ commit }) {
    try {
      const { data } = await this.$axios.get('/api/users')
      commit(SET_USERS, data.message)
      return data.message
    } catch (error) {
      throw error
    }
  },

  async [CONFIRM_EMAIL]({ commit }, code) {
    try {
      const response = await this.$axios.put(`/api/users/confirm/${code}`)
      return response.data.message
    } catch (error) {
      throw error
    }
  },

  async [RESEND_CONFIRM]({ commit }, email) {
    try {
      const endpoint = '/api/users/profile/send-confirm'
      const response = await this.$axios.post(endpoint, { email })
      return response.data.message
    } catch (error) {
      throw error
    }
  },

  async [FORGOT]({ commit }, email) {
    try {
      const response = await this.$axios.post('/api/password/forgot', { email })
      return response.data.message
    } catch (error) {
      throw error
    }
  },

  async [RESET]({ commit }, { token, password }) {
    try {
      const endpoint = `/api/password/reset?token=${token}`
      const response = await this.$axios.post(endpoint, { password })
      return response.data.message
    } catch (error) {
      throw error
    }
  },

  async [UPDATE_USER]({ dispatch }, { id, data }) {
    try {
      const response = await this.$axios.put(`/api/users/${id}`, data)
      dispatch(GET_USERS)
      dispatch(FETCH_USER)
      return response.data.message
    } catch (error) {
      throw error
    }
  },

  async [UPDATE_STATUS]({ dispatch }, { userId, data }) {
    try {
      const endpoint = `/api/users/${userId}/update-status`
      const response = await this.$axios.put(endpoint, data)
      return response.data.message
    } catch (error) {
      throw error
    }
  },

  async [UPDATE_PROGRESS]({ dispatch }, { userId, data }) {
    try {
      const endpoint = `/api/users/${userId}/update-progress`
      const response = await this.$axios.put(endpoint, data)
      return response.data.message
    } catch (error) {
      throw error
    }
  }
}

export const mutations = {
  [SET_USER](state, data) {
    state.profile = data
  },
  [SET_USERS](state, data) {
    state.users = data
  }
}
