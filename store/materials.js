// import consola from 'consola'
import {
    CREATE_MATERIAL,
    DELETE_MATERIAL,
    GET_MATERIALS,
    SET_MATERIALS,
    GET_MATERIAL,
    SET_MATERIAL,
    UPDATE_MATERIAL_STATUS
} from '@/common/types'

export const state = () => ({
    materials: [],
    material: {}
})

export const actions = {
    async [CREATE_MATERIAL]({ dispatch }, data) {
        try {
            const response = await this.$axios.post('/api/materials', data)
            dispatch(GET_MATERIALS)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [DELETE_MATERIAL]({ dispatch }, id) {
        try {
            const response = await this.$axios.delete(`/api/materials/${id}`)
            dispatch(GET_MATERIALS)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [GET_MATERIALS]({ commit }) {
        try {
            const response = await this.$axios.get('/api/materials')
            commit(SET_MATERIALS, response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [GET_MATERIAL]({ commit }, id) {
        try {
            const response = await this.$axios.get(`/api/materials/${id}`)
            commit(SET_MATERIAL, response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [UPDATE_MATERIAL_STATUS]({ dispatch }, { userId, data }) {
        try {
            const endpoint = `/api/users/${userId}/materials`
            const response = await this.$axios.put(endpoint, data)
            dispatch(GET_MATERIALS)
            return response.data.message
        } catch (error) {
            throw error
        }
    }
}

export const mutations = {
    [SET_MATERIALS](state, data) {
        state.materials = data
    },
    [SET_MATERIAL](state, data) {
        state.material = data
    }
}
