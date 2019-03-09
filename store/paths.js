import consola from 'consola'
import {
    CREATE_PATH,
    UPDATE_PATH,
    DELETE_PATH,
    GET_PATHS,
    SET_PATHS,
    GET_PATH,
    SET_PATH,
    ADD_SPRINTS,
    REMOVE_SPRINTS,
    ENROLL,
    UNENROLL
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

    async [UPDATE_PATH]({ dispatch }, { id, data }) {
        try {
            const response = await this.$axios.put(`/api/paths/${id}`, data)
            dispatch(GET_PATHS)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [DELETE_PATH]({ dispatch }, id) {
        try {
            const response = await this.$axios.delete(`/api/paths/${id}`)
            dispatch(GET_PATHS)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [GET_PATHS]({ commit }) {
        try {
            const response = await this.$axios.get('/api/paths', {
                // client_id: 'lcdCITZvyCq2POdcIPiqJrhbIEODUwpB',
                // client_secret: 'YdgISicBRu4W6O3RL2U5ymPXEXhKEG3N796WFpsNtTcyTBbHijv1i8ZaIjTrFZUd'
            })
            commit(SET_PATHS, response.data.message)
            consola.trace(response.data.message)
            return response.data.message
        } catch (error) {
            consola.error(error.message)
            throw error
        }
    },

    async [GET_PATH]({ commit }, slug) {
        try {
            const response = await this.$axios.get(`/api/paths/${slug}`)
            commit(SET_PATH, response.data.message)
            consola.trace(response.data.message)
            return response.data.message
        } catch (error) {
            consola.error(error.message)
            throw error
        }
    },

    async [ADD_SPRINTS]({ dispatch }, { pathId, sprintIds }) {
        try {
            const response = await this.$axios.put(`/api/paths/${pathId}/add-sprints`, {
                id: sprintIds
            })
            dispatch(GET_PATHS)
            consola.trace(response.data.message)
            return response.data.message
        } catch (error) {
            consola.error(error.message)
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
            consola.trace(response.data.message)
            return response.data.message
        } catch (error) {
            consola.error(error.message)
            throw error
        }
    },

    async [ENROLL]({ dispatch }, { pathId, userIds }) {
        try {
            const response = await this.$axios.put(`/api/paths/${pathId}/enroll`, {
                id: userIds
            })
            dispatch(GET_PATHS)
            consola.trace(response.data.message)
            return response.data.message
        } catch (error) {
            consola.error(error.message)
            throw error
        }
    },

    async [UNENROLL]({ dispatch }, { pathId, userIds }) {
        try {
            const response = await this.$axios.put(`/api/paths/${pathId}/unenroll`, {
                id: userIds
            })
            dispatch(GET_PATHS)
            consola.trace(response.data.message)
            return response.data.message
        } catch (error) {
            consola.error(error.message)
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
