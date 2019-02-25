// import consola from 'consola'
import {
    SIGN_UP
} from '@/common/types'

export const state = () => ({
    paths: [],
    path: {}
})

export const actions = {
    async [SIGN_UP]({ dispatch }, data) {
        try {
            const response = await this.$axios.post('/api/users', data)
            dispatch()
            return response.data.message
        } catch (error) {
            throw error
        }
    }
}

export const mutations = {
}
