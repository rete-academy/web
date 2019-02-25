import consola from 'consola'
import {
    CREATE_PATH,
    GET_PATHS,
    SET_PATHS,
    GET_PATH,
    SET_PATH,
    ADD_SPRINTS,
    REMOVE_SPRINTS
} from '@/common/types'

export const state = () => ({
    paths: [],
    path: {}
})

export const actions = {
    async [CREATE_PATH]({ dispatch }, data) {
        try {
            const response = await this.$axios.post('/api/paths', data)
            dispatch(GET_PATHS)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [GET_PATHS]({ commit }) {
        try {
            const response = await this.$axios.get('/api/paths', {
                client_id: 'lcdCITZvyCq2POdcIPiqJrhbIEODUwpB',
                client_secret: 'YdgISicBRu4W6O3RL2U5ymPXEXhKEG3N796WFpsNtTcyTBbHijv1i8ZaIjTrFZUd'
            })
            commit(SET_PATHS, response.data.message)
            return response.data.message
        } catch (error) {
            consola.error(error.message)
            // throw error
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
    },

    async [ADD_SPRINTS]({ dispatch }, { pathId, sprintIds }) {
        try {
            const response = await this.$axios.put(`/api/paths/${pathId}/add-sprints`, {
                id: sprintIds
            })
            dispatch(GET_PATHS)
            consola.info(response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [REMOVE_SPRINTS]({ dispatch }, { pathId, sprintIds }) {
        consola.info('sprintIds ', sprintIds)
        try {
            const response = await this.$axios.put(`/api/paths/${pathId}/remove-sprints`, {
                id: sprintIds
            })
            dispatch(GET_PATHS)
            consola.info(response.data.message)
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
