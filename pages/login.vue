<template>
  <div class="login-form form-wrapper">
    <router-link
      class="logo"
      to="/"
    >
      <img class="logo" src="@/assets/images/rete-logo-big.jpg">
    </router-link>
    <h2 v-if="!finished">
      Login
    </h2>
    <el-form
      v-if="!finished"
      ref="loginForm"
      :model="input"
      :rules="rules"
      label-width="80px"
      label-position="top"
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
          type="password"
          class="password clear"
          placeholder="Your Password"
          show-password
          @keyup.native.enter="onSubmit"
        />
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
          type="info"
          class="sign-up-btn"
          plain
          @click="$router.push('/signup')"
        >
          Or, Create Account
        </el-button>
        <el-button
          type="text"
          class="forgot-btn"
          plain
          @click="$router.push('/password/forgot')"
        >
          Forgot Password?
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
              client_id: process.env.clientId,
              client_secret: process.env.clientSecret,
              grant_type: 'password'
            }
          }).then(() => {
            this.$nuxt.$loading.finish()
            this.$message({
              showClose: true,
              duration: 500,
              type: 'success',
              message: 'Login successful!'
            })
            if (this.$route.query.prevPath) {
              this.$router.push(this.$route.query.prevPath)
            } else {
              this.$router.push('/my-paths')
            }
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

    hr {
        width: 80%;
        color: #CCC;
        margin: 20px auto 10px;
    }

    .forgot-btn {
        width: 100%;
        margin: 10px auto 0;
        font-size: 12px;

        &:hover {
            border: none;
        }
    }
}
</style>
