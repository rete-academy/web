// import consola from 'consola'

import {
    GET_PATHS,
    SET_PATHS,
    GET_PATH,
    SET_PATH
} from '@/common/types'

export const state = () => ({
    paths: [],
    path: {}
})

export const actions = {
    async [GET_PATHS]({ commit }) {
        try {
            const response = await this.$axios.get('/api/paths')
            commit(SET_PATHS, response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    },
    async [GET_PATH]({ commit }, slug) {
        try {
            const response = await this.$axios.get(`/api/paths/${slug}`)
            commit(SET_PATH, response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    }
}

export const mutations = {
    [SET_PATHS](state, data) {
        state.paths = data
    },
    [SET_PATH](state, data) {
        state.path = data
    }
}
