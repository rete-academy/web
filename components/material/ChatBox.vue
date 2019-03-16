<template>
    <div
        class="chat-box"
        :style="{
            display: display,
            bottom: bottom
        }"
    >
        <div class="mini-nav">
            <strong>{{ data.name | truncate(25) }}</strong>
            <div class="icons">
                <!-- fa
                    icon="window-minimize"
                    class="minimize"
                    @click="minimizeChat"
                / -->
                <fa
                    icon="times"
                    class="close"
                    @click="closeChat"
                />
            </div>
        </div>
        <div class="container">
            <div
                v-chat-scroll="{
                    always: false,
                    smooth: true
                }"
                class="chat-container"
            >
                <div
                    v-for="message in messages"
                    :ref="message._id"
                    :key="message._id"
                    class="message"
                >
                    <img
                        class="avatar"
                        src="https://placeimg.com/50/50/people?1"
                    >
                    <div class="text">
                        <p class="info">
                            <span class="name">
                                <strong>{{ message.user.name }}</strong>
                            </span>
                            <span class="date">
                                23/03/2016 20:40
                            </span>
                        </p>
                        <p class="content">
                            {{ message.content }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <el-input
                v-model="inputMessage"
                placeholder="Type message, enter to send..."
                @keyup.enter.native="sendMessage"
            />
        </div>
    </div>
</template>
<script>
import consola from 'consola'
import { mapGetters } from 'vuex'

export default {
    name: 'ChatBox',

    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            display: 'none',
            bottom: '0px',
            inputMessage: ''
        }
    },

    computed: {
        ...mapGetters('conversations', [
            'chatVisible',
            'isConnected',
            'currentId',
            'conversation'
        ]),

        messages() {
            if (this.data && this.chatVisible) {
                return this.conversation.messages
            }
            return []
        }
    },

    sockets: {
        connect() {
            consola.info('socket connected')
        },

        customEmit(val) {
            consola.info('this emittt')
        }
    },

    watch: {
        chatVisible() {
            if (this.chatVisible) {
                this.display = 'block'
                this.bottom = '0px'
            } else {
                this.display = 'none'
                this.bottom = '0px'
            }
        }
    },

    updated() {
        // consola.info('chat box got updated', this.messages.length)
        // const elem = this.$el
        // elem.scrollTop = elem.clientHeight
    },

    methods: {
        closeChat() {
            this.$store.commit('conversations/SET_VISIBLE', {
                visible: false,
                material: ''
            })
        },

        sendMessage() {
            // consola.info('sending message')
            // this.$socket.emit('chat_message', this.inputMessage)
            this.$store.dispatch('conversations/ADD_MESSAGE', {
                id: this.conversation._id,
                data: {
                    user: this.$auth.user._id,
                    content: this.inputMessage
                }
            }).then(() => {
                this.inputMessage = ''
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.mini-nav {
    display: flex;
    justify-content: space-between;
    height: 16px;
    padding: 10px;

    .minimize {
        font-size: 70%;
        margin-right: 5px;

        &:hover {
            color: #CCDE00;
            cursor: pointer;
        }
    }
    .close {
        &:hover {
            color: #CC0000;
            cursor: pointer;
        }
    }
}

.container {
    width: 100%;
    border: none;
    border-radius: 4px;
    overflow: hidden;
}

.chat-container {
    height: 420px;
    overflow: auto;
}

.message {
    display: flex;
    width: 86%;
    margin: 2px auto;
    padding: 10px;
    background: #FFF;
    border-radius: 6px;

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 3px;
        margin-right: 7px;
    }

    .info {
        align-items:center;

        .name {
            font-weight: 900;
            font-size: 14px;
        }

        .date {
            font-size: 90%;
            margin-left: 10px;
            color: #CCC;
        }
    }

    .content {
        margin-top: 3px;
    }

}

.chat-input {
    height: 50px;
    padding: 5px 10px 10px;
}
</style>
