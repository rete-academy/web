<template>
    <div class="nav-bar">
        this is navbar

        <el-button type="text" @click="logout">
            Logout
        </el-button>
    </div>
</template>

<script>
export default {
    name: 'NavBar',

    data() {
        return {
        }
    },

    methods: {
        async logout() {
            await this.$auth.logout()
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
