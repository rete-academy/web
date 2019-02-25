// import consola from 'consola'
import {
    GET_SPRINTS,
    SET_SPRINTS
} from '@/common/types'

export const state = () => ({
    sprints: []
})

export const actions = {
    async [GET_SPRINTS]({ commit }) {
        try {
            const response = await this.$axios.get('/api/sprints')
            commit(SET_SPRINTS, response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    }
}

export const mutations = {
    [SET_SPRINTS](state, data) {
        state.sprints = data
    }
}
