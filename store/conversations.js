// import consola from 'consola'
import {
    // CHAT_VISIBLE,
    SET_VISIBLE,
    CREATE_CONVERSATION,
    GET_CONVERSATION,
    SET_CONVERSATION,
    ADD_MESSAGE
} from '@/common/types'

export const state = () => ({
    conversation: {},
    chatVisible: false,
    currentId: ''
})

export const getters = {
    chatVisible: state => state.chatVisible,
    currentId: state => state.currentId
}

export const actions = {
    async [CREATE_CONVERSATION]({ dispatch }, data) {
        try {
            const response = await this.$axios.post('/api/conversations', data)
            // dispatch(GET_MATERIALS)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [GET_CONVERSATION]({ commit }, id) {
        try {
            const response = await this.$axios.get(`/api/conversations/${id}`)
            commit(SET_CONVERSATION, response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    },

    async [ADD_MESSAGE]({ commit }, { id, data }) {
        try {
            const response = await this.$axios.put(`/api/conversations/${id}`, data)
            commit(SET_CONVERSATION, response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    }
}

export const mutations = {
    [SET_CONVERSATION](state, data) {
        state.conversation = data
    },

    [SET_VISIBLE](state, data) {
        state.chatVisible = data.visible
        state.currentId = data.material
    }
}
