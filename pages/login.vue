<template>
  <div class="sign-in wrapper">
    <input id="username" v-model="username" type="text" name="">
    <input id="password" v-model="password" type="text" name="">
    <button type="submit" class="button is-dark is-fullwidth" @click="login">
      Log In
    </button>
    <br>
    ---
    <br>
    {{ res }}
  </div>
</template>

<script>
export default {
    name: 'SignIn',

    data() {
        return {
            username: '',
            password: '',
            error: null,
            res: ''
        }
    },

    methods: {
        async login() {
            try {
                await this.$auth.loginWith('local', {
                    data: {
                        username: this.username,
                        password: this.password,
                        client_id: 'gi4ylF2Pk',
                        client_secret: 'pYEpKMZK5bdaf14Ta090n10wi8uy5bAij8',
                        grant_type: 'password'
                    }
                })

                this.$router.push('/')
            } catch (e) {
                this.error = e.response.data.message
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
