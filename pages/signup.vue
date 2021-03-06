<template>
  <div class="sign-up-form form-wrapper">
    <nuxt-link
      class="logo"
      to="/"
    >
      <img class="logo" src="@/assets/images/rete-logo-big.png">
    </nuxt-link>
    <h2 v-if="!finished">
      Sign Up
    </h2>
    <el-form
      v-if="!finished"
      ref="signUpForm"
      :model="input"
      :rules="rules"
      :disabled="working"
      label-width="80px"
      label-position="top"
      hide-required-asterisk
    >
      <el-form-item label="Name" prop="name" required>
        <el-input
          v-model="input.name"
          type="text"
          class="name clear"
          placeholder="Your Name"
          @keyup.native.enter="onSubmit"
        />
      </el-form-item>
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
        <el-progress
          :percentage="25*score"
          :show-text="false"
          :stroke-width="4"
          :status="score < 3 ? 'exception' : 'success'"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="acceptTos"
          class="accept-checkbox"
        >
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
          :disabled="!acceptTos || score < 3 || working"
          @click="onSubmit"
        >
          Register
        </el-button>
        <el-button
          type="info"
          class="login-btn"
          plain
          @click="$router.push('/login')"
        >
          Or, Login
        </el-button>
      </el-form-item>
      <el-form-item />
    </el-form>
    <div v-else class="finished">
      <h2>Registration finished!</h2>
      <p>Please check your inbox to confirm email address.</p>
      <div>
        Go back to
        <nuxt-link to="/">
          Home page
        </nuxt-link>
      </div>
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
import consola from 'consola';
import zxcvbn from 'zxcvbn';

export default {
  name: 'SignUpForm',

  auth: false,

  layout: 'blank',

  data() {
    return {
      input: {
        email: '',
        name: '',
        password: '',
      },
      acceptTos: true,
      dialogVisible: false,
      link: '',
      finished: false,
      count: 10,
      currentType: 'password',
      showPassword: false,
      passwordIcon: 'eye-slash',
      working: false,
      rules: {
        name: [{
          required: true,
          message: 'Name is required',
          trigger: 'blur',
        }],
        email: [{
          type: 'email',
          message: 'Please input correct email address',
          trigger: ['blur'],
        }],
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

  methods: {
    onAccept() {
      this.acceptTos = true;
      this.dialogVisible = false;
    },

    onDecline() {
      this.acceptTos = false;
      this.dialogVisible = false;
    },

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
      }, 500);
    },

    openDialog(string) {
      this.dialogVisible = true;
      if (string === 'tos') {
        this.link = process.env.VUE_APP_TOS_LINK;
        // console.log(this.link, process.env.VUE_APP_TOS_LINK);
      } else {
        this.link = process.env.VUE_APP_PRIVACY_LINK;
        // console.log(this.link, process.env.VUE_APP_PRIVACY_LINK);
      }
    },

    onSubmit() {
      this.$refs.signUpForm.validate((valid) => {
        if (valid) {
          if (this.score < 3) {
            this.$confirm(
              'Your password is quite weak. Continue?',
              'Weak Password',
              {
                confirmButtonText: 'OK',
                cancelButtonText: 'Choose Stronger Password',
                type: 'warning',
                center: true,
              },
            ).then(() => {
              this.handleSignUp();
            }).catch(() => {});
          } else {
            this.handleSignUp();
          }
        }
      });
    },

    handleSignUp() {
      if (this.acceptTos) {
        this.$nuxt.$loading.start();
        this.working = true;

        this.$store.dispatch('users/SIGN_UP', this.input)
          .then((res) => {
            this.$nuxt.$loading.finish();
            this.finished = true;
            this.working = false;
            consola.info(res);
          }).catch((err) => {
            this.$nuxt.$loading.fail();
            this.$message.error(err.message);
            this.working = false;
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.sign-up-form {
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      display: inline-block;
      margin: 0 10px;
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

    .accept-checkbox {
        .el-checkbox__label {
            font-size: 13px !important;
        }
    }
}

</style>
