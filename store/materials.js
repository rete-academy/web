// import consola from 'consola'
import {
    GET_MATERIALS,
    SET_MATERIALS,
    GET_MATERIAL,
    SET_MATERIAL
} from '@/common/types'

export const state = () => ({
    materials: [],
    material: {}
})

export const actions = {
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
