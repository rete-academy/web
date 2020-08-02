<template>
  <div class="reset-form form-wrapper">
    <router-link
      class="logo"
      to="/"
    >
      <img class="logo" src="@/assets/images/rete-logo-big.png">
    </router-link>
    <h2>
      Set New Password
    </h2>
    <el-form
      ref="resetForm"
      :model="input"
      :rules="rules"
      label-width="80px"
      label-position="top"
      hide-required-asterisk
    >
      <el-form-item label="Password" prop="password" required>
        <el-input
          v-model="input.password"
          :type="currentType"
          class="password clear"
          placeholder="Your new password"
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
          :stroke-width="4"
          :status="score < 3 ? 'exception' : 'success'"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          class="reset-btn"
          :disabled="!input.password || !input.token || score < 3"
          @click="onSubmit"
        >
          Save New Password
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import consola from 'consola';
import zxcvbn from 'zxcvbn';

export default {
  name: 'ResetPassword',

  layout: 'blank',

  auth: false,

  data() {
    return {
      input: {
        password: '',
        token: '',
      },
      currentType: 'password',
      showPassword: false,
      passwordIcon: 'eye-slash',
      count: 10,
      res: '',
      rules: {
        password: [{
          required: true,
          validator: this.checkPass,
          trigger: ['blur', 'change'],
        }],
      },
    };
  },

  computed: {
    score() {
      return zxcvbn(this.input.password).score;
    },
  },

  created() {
    if (this.$route.query.token) {
      this.input.token = this.$route.query.token;
    }
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

    checkPass(rule, value, callback) {
      if (!value) {
        callback(new Error('Please input password'));
      }

      setTimeout(() => {
        if (this.score < 2) {
          callback(new Error('Password is too weak'));
        } else {
          callback();
        }
      }, 300);
    },

    onSubmit() {
      this.$nuxt.$loading.start();
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.handleReset();
        }
      });
    },

    handleReset() {
      this.$nuxt.$loading.start();
      this.$store.dispatch('users/RESET', {
        token: this.input.token,
        password: this.input.password,
      }).then(() => {
        this.$nuxt.$loading.finish();
        this.$message({
          showClose: true,
          duration: 5000,
          type: 'success',
          message: 'Reset successful!',
        });
        this.$router.push('/');
      }).catch((e) => {
        this.$nuxt.$loading.fail();
        consola.error(e.message);
        this.$message.error(e.message);
      });
    },
  },
};
</script>
