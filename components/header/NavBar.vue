<template>
    <div class="flex-nav">
        <router-link
            class="logo"
            to="/"
        >
            <img src="@/assets/images/rete-logo-icon.png" class="logo-icon">
        </router-link>
        <div class="nav-content">
            <router-link class="item" to="/paths">
                Your Paths
            </router-link>
            <router-link class="item" to="/">
                Events
            </router-link>
            <router-link class="item" to="/">
                Jobs
            </router-link>
            <router-link class="item" to="/">
                Dashboard
            </router-link>
            <router-link
                class="item"
                to="/admin"
            >
                Admin Panel
            </router-link>
        </div>

        <avatar />
    </div>
</template>

<script>
import Avatar from '@/components/header/Avatar'
// import { mapGetters } from 'vuex'
// import { displayName } from '@/mixins'
// import errorHandler from '@/common/error.handler'

export default {
    name: 'NavBar',

    components: { Avatar },

    mixins: [
        // checkAuth,
        // displayName
    ],

    data() {
        return {
            language: 'fi',
            visible: false
        }
    },

    computed: {
        user() {
            if (this.$auth.user) return this.$auth.user
            return {}
        }
    },

    watch: {
        language() {
            this.changeLanguage(this.language)
        }
    },

    created() {
    },

    methods: {
        goTo(string) {
            this.$router.push(string)
            this.visible = false
        },

        handleCommand(command) {
            switch (command) {
            case 'profile':
                this.$router.push('/profile')
                break
            case 'signout':
                this.signOut()
                break
            default:
                break
            }
        },

        changeLanguage(language) {
            this.$i18n.locale = language
            this.language = language
            this.visible = false
        },

        signOut() { }
    }
}
</script>

<style lang="scss" scoped>
.menu-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    // padding-bottom: 30px;

    .mobile-item {
        width: 60%;
        height: 60px;
        font-size: 18px;
        text-align: center;

        &.language {
            margin: 0 auto 50px;
        }
        & .flag-image {
            width: 22px;
        }
    }

    .el-button {
        margin: 5px 0;
    }

    .el-dialog__close {
        color: #FFF;
        border: 1px solid #FFF;
        border-radius: 50%;
    }

}
.language {
    margin-right: 30px;
}

.flag-item {
    display: flex;
    align-items: center;
    line-height: 24px;
    .flag-image {
        width: 22px;
        margin-right: 5px;
    }
}
</style>
