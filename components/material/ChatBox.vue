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
            <div class="chat-container">
                <div
                    v-for="n in 30"
                    :key="n"
                    class="message"
                >
                    <img class="avatar" src="https://placeimg.com/50/50/people?1">
                    <div class="text">
                        <p class="info">
                            <span class="name">
                                <strong>Sang Dang</strong>
                            </span>
                            <span class="date">
                                23/03/2016 20:40
                            </span>
                        </p>
                        <p class="content">
                            A message number {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in v
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <el-input
                v-model="message"
                placeholder="Type message, enter to send..."
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
        /*
        visible: {
            type: Boolean,
            default: false
        },
        */
        data: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            display: 'none',
            bottom: '0px',
            message: ''
        }
    },

    computed: {
        ...mapGetters('conversations', ['chatVisible', 'currentId'])
    },

    watch: {
        chatVisible() {
            consola.info('received', this.visible)
            if (this.chatVisible) {
                this.display = 'block'
                this.bottom = '0px'
            } else {
                this.display = 'none'
                this.bottom = '0px'
            }
        }
    },

    methods: {
        closeChat() {
            this.$store.commit('conversations/SET_VISIBLE', {
                visible: false,
                material: ''
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
    max-height: 420px;
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
