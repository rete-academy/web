import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io-extended'

export default ({ store }) => {
    Vue.use(VueSocketIO, io(process.env.SOCKET_HOST_URL), {
        store,
        actionPrefix: 'SOCKET_'
        // eventToActionTransformer: str => str.toUpperCase()
    })
}
