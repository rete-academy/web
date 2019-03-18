// import consola from 'consola'
import {
    FORGOT,
    RESET,
    SIGN_UP,
    FETCH_USER,
    SET_USER,
    CONFIRM_EMAIL,
    RESEND_CONFIRM,
    // UPLOAD_AVATAR,
    UPDATE_STATUS,
    UPDATE_PROGRESS
} from '@/store/types'

export const state = () => ({
    profile: {},
    paths: [],
    path: {}
})

export const getters = {
    profile: state => state.profile,
    paths: state => state.paths,
    path: state => state.path
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

    async [SIGN_UP]({ commmit }, data) {
        try {
            const response = await this.$axios.post('/api/users', data)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [CONFIRM_EMAIL]({ commmit }, code) {
        try {
            const response = await this.$axios.put(`/api/users/confirm/${code}`)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [RESEND_CONFIRM]({ commmit }, email) {
        try {
            const endpoint = '/api/users/profile/send-confirm'
            const response = await this.$axios.post(endpoint, { email })
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [FORGOT]({ commmit }, email) {
        try {
            const response = await this.$axios.post('/api/password/forgot', { email })
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [RESET]({ commmit }, { token, password }) {
        try {
            const response = await this.$axios
                .post(`/api/password/reset?token=${token}`, { password })
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
    }
}
