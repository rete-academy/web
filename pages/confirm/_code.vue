<template>
  <div class="confirm">
    <img class="logo" src="@/assets/images/rete-logo-big.png">
    <div v-if="success" class="valid">
      <h2>Confirmed</h2>
      <p class="text">
        Email confirmed. Thank you.
      </p>
      <p class="text">
        Going to login page in <strong>{{ count }}</strong> seconds...
      </p>
      <p class="text">
        <nuxt-link to="/">
          Click here
        </nuxt-link>
        to go back to home page.
      </p>
    </div>
    <div v-if="failed" class="invalid">
      <h2>Link was used or expired!</h2>
      <p class="text">
        Going back to home page in <strong>{{ count }}</strong> seconds...
      </p>
      <p class="text">
        <nuxt-link to="/">
          Click here
        </nuxt-link>
        to go back to home page.
      </p>
    </div>
    <div v-if="!success && !failed" class="nothing">
      <h2 class="loading">
        Checking the confirmation code <i class="el-icon-loading" />
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirm',

  auth: false,

  layout: 'blank',

  data() {
    return {
      code: '',
      success: false,
      failed: false,
      count: 3,
    };
  },

  mounted() {
    this.code = this.$route.params.code || '';

    this.$nextTick(() => {
      if (this.code) {
        this.$nuxt.$loading.start();

        this.$store.dispatch('users/CONFIRM_EMAIL', this.code)
          .then(() => {
            this.$nuxt.$loading.finish();
            this.success = true;
          })
          .catch(() => {
            this.$nuxt.$loading.fail();
            this.failed = true;
          });

        const countDown = setInterval(() => {
          this.count -= 1;
          if (this.count <= 0) {
            clearInterval(countDown);
            this.$router.push('/login');
          }
        }, 1000);
      }
    });
  },
};
</script>
<style scoped lang="scss">
.confirm {
    max-width: 600px;
    margin: 0 auto;

    .valid, .invalid, .nothing {
        max-width: 380px;
        margin: 0 auto;
        padding: 10px 30px 30px;
        border: 1px solid #E0E0E0;
        border-radius: 4px;
        text-align: center;
        font-size: 12px;

        p {
            font-size: 16px;
        }
    }

    .valid h2 {
        color: #8BC34A;
    }

    .invalid h2 {
        color: #E53935;
    }

    .logo {
        width: 100%;
    }
}
</style>
