<template>
  <div class="forgot-form form-wrapper">
    <nuxt-link
      class="logo"
      to="/"
    >
      <img class="logo" src="@/assets/images/rete-logo-big.png">
    </nuxt-link>
    <h2>
      Reset Password
    </h2>
    <el-form
      ref="forgotForm"
      :model="input"
      :rules="rules"
      label-width="80px"
      label-position="top"
      hide-required-asterisk
    >
      <el-form-item
        v-if="!emailSent"
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
      <div v-else class="sent">
        An email has been sent to you to reset your password, please check your inbox.
      </div>
      <el-form-item>
        <el-button
          v-if="!emailSent"
          type="primary"
          class="login-btn"
          :disabled="!input.email"
          @click="onSubmit"
        >
          Reset Password
        </el-button>
        <el-button
          plain
          type="text"
          class="login-btn"
          icon="el-icon-back"
          @click="$router.push('/login')"
        >
          Back to login
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import consola from 'consola';

export default {
  name: 'ForgotPassword',

  layout: 'blank',

  auth: false,

  data() {
    return {
      input: {
        email: '',
      },
      emailSent: false,
      rules: {
        email: [{
          type: 'email',
          message: 'Please input correct email',
          trigger: ['blur'],
        }],
      },
    };
  },

  methods: {
    onSubmit() {
      this.$nuxt.$loading.start();
      this.$refs.forgotForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('users/FORGOT', this.input.email).then(() => {
            this.$nuxt.$loading.finish();
            this.$message({
              showClose: true,
              duration: 500,
              type: 'success',
              message: 'Reset successful!',
            });

            this.emailSent = true;
          }).catch((e) => {
            this.$nuxt.$loading.fail();
            consola.error(e.message);
            this.$message.error(e.message);
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.forgot-form {
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
