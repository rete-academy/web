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
            label-position="left"
        >
            <el-form-item label="Name">
                <el-input
                    v-model="input.name"
                    type="text"
                    class="name clear"
                    placeholder="Your Name"
                    @keyup.native.enter="onSubmit"
                />
            </el-form-item>
            <el-form-item label="Email">
                <el-input
                    v-model="input.email"
                    type="text"
                    class="email clear"
                    placeholder="email@example.com"
                    @keyup.native.enter="onSubmit"
                />
            </el-form-item>
            <el-form-item label="Password">
                <el-input
                    v-model="input.password"
                    :type="currentType"
                    class="password clear"
                    placeholder="Your Password"
                    @keyup.native.enter="onSubmit"
                >
                    <fa
                        slot="suffix"
                        class="el-input__icon eye-icon"
                        :icon="passwordIcon"
                        @click="handleIconClick"
                    />
                </el-input>
                <el-progress
                    :percentage="25*score"
                    :show-text="false"
                    :stroke-width="5"
                    :status="score < 3 ? 'exception' : 'success'"
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
import zxcvbn from 'zxcvbn'

export default {
    name: 'SignUpForm',

    auth: false,

    layout: 'blank',

    data() {
        return {
            input: {
                email: '',
                name: '',
                password: ''
            },
            acceptTos: true,
            dialogVisible: false,
            link: '',
            finished: false,
            count: 10,
            currentType: 'password',
            showPassword: false,
            passwordIcon: 'eye-slash'
        }
    },

    computed: {
        score() {
            return zxcvbn(this.input.password).score
        }
    },

    created() {
        consola.info(process.env.apiUrl)
        this.$axios.defaults.baseURL = process.env.apiUrl
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

        handleIconClick() {
            this.showPassword = !this.showPassword
            if (this.showPassword) {
                this.currentType = 'text'
                this.passwordIcon = 'eye'

                const countDown = setInterval(() => {
                    this.count -= 1
                    if (this.count <= 0) {
                        clearInterval(countDown)
                        this.currentType = 'password'
                        this.passwordIcon = 'eye-slash'
                        this.count = 10
                    }
                }, 1000)
            } else {
                this.currentType = 'password'
                this.passwordIcon = 'eye-slash'
            }
        },

        checkScore(score) {
            this.score = score
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
            if (this.score < 3) {
                this.$confirm(
                    'Your password is weak. Continue?',
                    'Warning',
                    {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Use Stronger Password',
                        type: 'warning',
                        center: true
                    }
                ).then(() => {
                    this.handleSignUp()
                }).catch(() => {})
            } else {
                this.handleSignUp()
            }
        },

        handleSignUp() {
            if (this.acceptTos) {
                this.$nuxt.$loading.start()
                this.$store.dispatch('users/SIGN_UP', this.input)
                    .then((res) => {
                        this.$nuxt.$loading.finish()
                        this.finished = true
                        consola.info(res)
                    }).catch((err) => {
                        this.$nuxt.$loading.fail()
                        this.$message.error(err.message)
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

    .eye-icon {
        width: 1.25em;
        margin-right: 5px;

        &:hover {
            cursor: pointer;
            color: #CCCCCC;
        }
    }

    .sign-up-btn {
        margin-top: 10px;
        height: 50px;
        font-size: 16px;
        width: 100%;
        border-radius: 25px;
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
    .el-form-item:last-child {
        margin-bottom: 0;

    }

    .password {
        .el-input__inner {
            border-bottom: 0 !important;
        }
    }
    .el-progress {
        margin-top: 2px;
    }
}
</style>
