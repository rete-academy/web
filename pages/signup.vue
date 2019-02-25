<template>
    <div class="sign-up-form">
        <img class="logo" src="@/assets/images/rete-logo-big.jpg">
        <h2 v-if="!finished">
            Sign Up
        </h2>
        <el-form
            v-if="!finished"
            ref="signUpForm"
            :model="input"
            label-width="80px"
            label-position="top"
        >
            <el-form-item label="Name">
                <el-input
                    v-model="input.name"
                    type="text"
                    class="name clear"
                    placeholder="Your Name"
                    clearable
                    @keyup.native.enter="onSubmit"
                />
            </el-form-item>
            <el-form-item label="Email">
                <el-input
                    v-model="input.email"
                    class="email clear"
                    placeholder="email@example.com"
                    clearable
                    @keyup.native.enter="onSubmit"
                />
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="acceptTos">
                    I have read and accepted
                    <a
                        class="link"
                        @click="openDialog('tos')"
                    >
                        Terms of Service
                    </a>
                </el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="success"
                    class="sign-up-btn"
                    :disabled="!acceptTos"
                    @click="onSubmit"
                >
                    Register
                </el-button>
            </el-form-item>
        </el-form>
        <div v-else class="finished">
            <h2>Registration finished!</h2>
            <p>Please check your inbox to confirm email address.</p>
        </div>

        <el-dialog
            title="Terms of Service"
            :visible.sync="dialogVisible"
            center
        >
            Under construction
            <span slot="footer" class="dialog-footer">
                <el-button @click="onDecline">
                    Decline
                </el-button>
                <el-button type="primary" @click="onAccept">
                    Accept
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import consola from 'consola'

export default {
    name: 'SignUpForm',

    auth: false,

    layout: 'blank',

    data() {
        return {
            input: {
                email: '',
                name: ''
            },
            acceptTos: true,
            dialogVisible: false,
            link: '',
            finished: false
        }
    },

    methods: {
        onAccept() {
            this.acceptTos = true
            this.dialogVisible = false
        },

        onDecline() {
            this.acceptTos = false
            this.dialogVisible = false
        },

        openDialog(string) {
            this.dialogVisible = true
            if (string === 'tos') {
                this.link = process.env.VUE_APP_TOS_LINK
                // console.log(this.link, process.env.VUE_APP_TOS_LINK);
            } else {
                this.link = process.env.VUE_APP_PRIVACY_LINK
                // console.log(this.link, process.env.VUE_APP_PRIVACY_LINK);
            }
        },

        onSubmit() {
            if (this.acceptTos) {
                this.$nuxt.$loading.start()
                this.$store.dispatch('users/SIGN_UP', this.input).then((res) => {
                    this.$nuxt.$loading.finish()
                    this.finished = true
                    consola.info(res)
                }).catch((err) => {
                    this.$nuxt.$loading.fail()
                    consola.error(err.message)
                })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sign-up-form {
    max-width: 600px;
    margin: 0 auto;

    .el-form {
        max-width: 380px;
        margin: 0 auto;
    }

    .logo {
        width: 100%;
    }
    h2 {
        text-align: center;
        margin: 0 auto 20px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      display: inline-block;
      margin: 0 10px;
    }
    a, .link {
      font-weight: bold;
      cursor: pointer;
    }

    .test {
        margin: 30 auto;
    }

    .sign-up-btn {
        margin-top: 10px;
        height: 50px;
        font-size: 16px;
        width: 100%;
    }

    .tos {
        font-size: 14px;
        margin-top: 20px;

    }
    .tos-content {
        width: 100%;
    }
    .el-checkbox {
        margin-right: 10px;
    }
    .finished {
        text-align: center;
        border: 1px solid #CCCCCC;
        border-radius: 3px;
        padding: 10px 30px;

        h2 {
            margin-top: 10px;
            color: #8BC34A;
        }
        p {
            font-size: 14px;
        }
    }
}
</style>
