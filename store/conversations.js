import consola from 'consola'
import {
    // CHAT_VISIBLE,
    SET_VISIBLE,
    CREATE_CONVERSATION,
    GET_CONVERSATION,
    SET_CONVERSATION,
    ADD_MESSAGE,
    SOCKET_CONNECT,
    SOCKET_CHAT_MESSAGE
} from '@/store/types'

export const state = () => ({
    isConnected: false,
    chatVisible: false,
    conversation: {},
    currentId: ''
})

export const getters = {
    isConnected: state => state.isConnected,
    conversation: state => state.conversation,
    chatVisible: state => state.chatVisible,
    currentId: state => state.currentId
}

export const actions = {
    async [CREATE_CONVERSATION]({ commit }, data) {
        try {
            const response = await this.$axios.post('/api/conversations', data)
            commit(SET_CONVERSATION, response.data.message)
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
            const endpoint = `/api/conversations/${id}/messages`
            const response = await this.$axios.put(endpoint, data)
            commit(SET_CONVERSATION, response.data.message)
            return response.data.message
        } catch (error) {
            throw error
        }
    }
}

export const mutations = {
    [SOCKET_CONNECT](state) {
        consola.info('Connected to socket server.')
        state.isConnected = true
    },

    [SET_CONVERSATION](state, data) {
        state.conversation = data
    },

    [SOCKET_CHAT_MESSAGE](state, data) {
        // consola.info('=== Received message from server', data)
        state.conversation = data
    },

    [SET_VISIBLE](state, { visible, material }) {
        state.chatVisible = visible
        state.currentId = material
    }
}
