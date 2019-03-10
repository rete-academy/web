<template>
    <div class="profile">
        <el-dropdown
            v-if="$auth.loggedIn"
            trigger="click"
            @command="handleCommand"
        >
            <span class="el-dropdown-link">
                {{ profile.name }} <fa icon="chevron-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">
                    My Profile
                </el-dropdown-item>
                <el-dropdown-item>Preferences</el-dropdown-item>
                <el-dropdown-item divided command="logout">
                    Logout
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <div v-else>
            <el-button
                size="mini"
                type="success"
                @click="$router.push('/login')"
            >
                Login
            </el-button>
            <el-button
                size="mini"
                type="info"
                plain
                @click="$router.push('/signup')"
            >
                Sign Up
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Avatar',

    data() {
        return { }
    },

    computed: {
        profile() {
            if (this.$auth.user) return this.$auth.user
            return {}
        }
    },

    methods: {
        handleCommand(command) {
            switch (command) {
            case 'profile':
                this.$router.push('/settings/profile')
                break
            case 'logout':
                this.logOut()
                break
            default:
                break
            }
        },

        async logOut() {
            await this.$auth.logout()
        }
    }
}
</script>

<style lang="scss" scoped>
.icon {
    width: 55px;
    height: 55px;
}
.profile {
    .el-button {
        margin: 0 5px;
    }
}
</style>
