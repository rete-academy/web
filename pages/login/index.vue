<template>
  <div class="login-form form-wrapper">
    <nuxt-link
      class="logo"
      to="/"
    >
      <img class="logo" src="@/assets/images/rete-logo-big.png">
    </nuxt-link>
    <h2 v-if="!finished">
      Login
    </h2>

    <el-form
      v-if="!finished"
      :model="input"
      :rules="rules"
      :disabled="working"
      ref="loginForm"
      label-width="80px"
      label-position="top"
      hide-required-asterisk
    >
      <!-- el-form-item>
        <el-button
          class="login-btn facebook"
          @click="handleLoginWithFacebook"
        >
          Login with Facebook
        </el-button>
      </el-form-item>

      <el-divider class="or">or</el-divider -->

      <el-form-item
        label="Email"
        prop="email"
        required
      >
        <el-input
          v-model="input.email"
          type="email"
          class="email clear"
          placeholder="email@example.com"
          @keyup.native.enter="onSubmit"
        />
      </el-form-item>
      <el-form-item
        label="Password"
        prop="password"
        required
      >
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
          :disabled="!input.email || !input.password || working"
          @click="onSubmit"
        >
          Login
        </el-button>

        <el-button
          type="text"
          class="sign-up-btn"
          :disabled="working"
          plain
          @click="$router.push('/signup')"
        >
          Or, Create Account
        </el-button>
        <el-button
          type="text"
          class="forgot-btn"
          :disabled="working"
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
import consola from 'consola';

export default {
  name: 'SignIn',

  layout: 'blank',

  data() {
    return {
      input: {
        email: '',
        password: '',
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
          trigger: ['blur'],
        }],
        password: [{
          required: true,
          trigger: ['blur'],
        }],
      },
      working: false,
    };
  },

  methods: {
    handleIconClick() {
      this.showPassword = !this.showPassword;
      if (this.showPassword) {
        this.currentType = 'text';
        this.passwordIcon = 'eye';

        const countDown = setInterval(() => {
          this.count -= 1;
          if (this.count <= 0) {
            clearInterval(countDown);
            this.currentType = 'password';
            this.passwordIcon = 'eye-slash';
            this.count = 10;
          }
        }, 1000);
      } else {
        this.currentType = 'password';
        this.passwordIcon = 'eye-slash';
      }
    },

    handleLoginWithFacebook() {
      this.$nuxt.$loading.start();
      this.working = true;

      this.$auth.loginWith('facebook')
        .then(() => {
          this.$nuxt.$loading.finish();
        }).catch((e) => {
          this.$nuxt.$loading.fail();
          consola.error(e.message);
          this.$message.error(e.message);
          this.working = false;
        });
    },

    onSubmit() {
      this.$nuxt.$loading.start();
      this.working = true;

      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$auth.loginWith('local', {
            data: {
              username: this.input.email,
              password: this.input.password,
              client_id: process.env.clientId,
              client_secret: process.env.clientSecret,
              grant_type: 'password',
            },
          }).then(() => {
            this.$nuxt.$loading.finish();
            this.$message({
              showClose: true,
              duration: 500,
              type: 'success',
              message: 'Login successful!',
            });

            if (this.$route.query.prevPath) {
              this.$router.push(this.$route.query.prevPath);
            } else {
              this.$router.push('/my-paths');
            }
          }).catch((e) => {
            this.$nuxt.$loading.fail();
            consola.error(e.message);
            this.$message.error(e.message);
            this.working = false;
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-form {
  h2 {
    text-align: center;
    margin: 0 auto;
  }

  .eye-icon {
    width: 1.25em;
    margin-right: 5px;

    &:hover {
      cursor: pointer;
      color: #CCCCCC;
    }
  }

  .login-btn {
    &.facebook {
      background: #3b5998;
      color: #FFFFFF;

      &:hover {
        background: lighten(#3b5998, 10);
      }
    }
  }

  .or {
    margin-top: 34px;
  }

  .forgot-btn {
    width: 100%;
    margin: 10px auto 0;
  }
}
</style>
