// import consola from 'consola'
import {
    SIGN_UP,
    CONFIRM_EMAIL
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
    }
}

export const mutations = {
}
