<template>
  <div class="sign-up-form">
    <img class="logo" src="@/assets/images/rete-logo-big.jpg">
    <h2>Sign Up</h2>
    <el-form ref="signUpForm" :model="input" label-position="top">
      <el-form-item label="Name">
        <el-input
          v-model="input.name"
          type="text"
          class="name clear"
          placeholder="Name"
          clearable
          @keyup.native.enter="onSubmit"
        />
      </el-form-item>
      <el-form-item label="Name">
        <el-input
          v-model="input.email"
          class="email clear"
          placeholder="Email"
          clearable
          @keyup.native.enter="onSubmit"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="acceptTos" />
        I have read and accepted
        <a
          class="link"
          @click="openDialog('tos')"
        >
          Terms of Service
        </a>
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
export default {
    name: 'SignInForm',

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
            link: ''
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
                this.$store.dispatch('auth/SIGN_IN', this.input).then((response) => {
                    if (response.access_token) {
                        this.$router.push('/projects')
                    }
                })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sign-up-form {
    max-width: 560px;
    margin: 0 auto;

    .logo {
        width: 100%;
    }
    h2 {
        text-align: center;
        margin: 0;
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
}
</style>
