<template>
    <div class="login-form form-wrapper">
        <img class="logo" src="@/assets/images/rete-logo-big.jpg">
        <h2 v-if="!finished">
            Login
        </h2>
        <el-form
            v-if="!finished"
            ref="loginForm"
            :model="input"
            :rules="rules"
            label-width="80px"
            label-position="left"
            hide-required-asterisk
        >
            <el-form-item label="Email" prop="email" required>
                <el-input
                    v-model="input.email"
                    type="email"
                    class="email clear"
                    placeholder="email@example.com"
                    @keyup.native.enter="onSubmit"
                />
            </el-form-item>
            <el-form-item label="Password" prop="password" required>
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
            </el-form-item>
            <el-form-item>
                <el-button
                    type="success"
                    class="login-btn"
                    :disabled="!input.email || !input.password"
                    @click="onSubmit"
                >
                    Login
                </el-button>
                <el-button
                    type="primary"
                    class="sign-up-btn"
                    plain
                    @click="$router.push('/signup')"
                >
                    Or, Create Account
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import consola from 'consola'

export default {
    name: 'SignIn',

    layout: 'blank',

    data() {
        return {
            input: {
                email: '',
                password: ''
            },
            finished: false,
            showPassword: false,
            currentType: 'password',
            passwordIcon: 'eye-slash',
            count: 10,
            res: '',
            rules: {
                email: [{
                    type: 'email',
                    message: 'Please input correct email',
                    trigger: ['blur']
                }],
                password: [{
                    required: true,
                    trigger: ['blur']
                }]
            }
        }
    },

    methods: {
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

        onSubmit() {
            this.$nuxt.$loading.start()
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$auth.loginWith('local', {
                        data: {
                            username: this.input.email,
                            password: this.input.password,
                            grant_type: 'password'
                            // client_id: 'gi4ylF2Pk',
                            // client_secret: 'pYEpKMZK5bdaf14Ta090n10wi8uy5bAij8'
                        }
                    }).then(() => {
                        this.$nuxt.$loading.finish()
                        this.$message.success('Login successful!')
                        this.$router.push('/')
                    }).catch((e) => {
                        this.$nuxt.$loading.fail()
                        consola.error(e.message)
                        this.$message.error(e.message)
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.login-form {
    h2 {
        text-align: center;
        margin: 0 auto 20px;
    }

    .eye-icon {
        width: 1.25em;
        margin-right: 5px;

        &:hover {
            cursor: pointer;
            color: #CCCCCC;
        }
    }
}
</style>
