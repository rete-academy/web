// import consola from 'consola'
import {
    FORGOT,
    RESET,
    SIGN_UP,
    CONFIRM_EMAIL,
    RESEND_CONFIRM
} from '@/common/types'

export const state = () => ({
    paths: [],
    path: {}
})

export const actions = {
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
    }
}

export const mutations = {
}
