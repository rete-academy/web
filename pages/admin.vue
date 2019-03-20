<template>
    <div class="admin wrapper">
        <el-menu
            class="admin-sub-menu"
            mode="horizontal"
            router
            :default-active="activeIndex"
            @open="handleOpen"
            @close="handleClose"
        >
            <el-menu-item index="/admin/paths">
                <fa icon="university" />
                <span slot="title">Paths</span>
            </el-menu-item>
            <el-menu-item index="/admin/sprints">
                <fa icon="tasks" />
                <span slot="title">Sprints</span>
            </el-menu-item>
            <el-menu-item index="/admin/materials">
                <fa icon="journal-whills" />
                <span slot="title">Materials</span>
            </el-menu-item>
            <el-menu-item index="/admin/users">
                <fa icon="user" />
                <span slot="title">Users</span>
            </el-menu-item>
            <el-menu-item index="/admin/settings">
                <fa icon="cog" />
                <span slot="title">Settings</span>
            </el-menu-item>
        </el-menu>

        <nuxt-child class="main-content" />
        </el-row>
    </div>
</template>

<script>
// import consola from 'consola'
// import { mapGetters } from 'vuex'

export default {
    name: 'AdminView',

    data() {
        return {
            activeIndex: this.$route.fullPath,
            materialFormVisible: false
        }
    },

    async asyncData({ params, store, error }) {
        try {
            if (store.getters['paths/paths'].length === 0) {
                await store.dispatch('paths/GET_PATHS')
            }
            if (store.getters['sprints/sprints'].length === 0) {
                await store.dispatch('sprints/GET_SPRINTS')
            }
            if (store.getters['materials/materials'].length === 0) {
                await store.dispatch('materials/GET_MATERIALS')
            }
            if (store.getters['users/users'].length === 0) {
                await store.dispatch('users/GET_USERS')
            }
        } catch (e) {
            error({ message: e, statusCode: 404 })
        }
    },

    mounted() {
        if (this.activeIndex === '/admin') {
            this.$router.push('/admin/paths')
            this.activeIndex = '/admin/paths'
        }
    },

    methods: {
        handleClose() {},
        handleOpen() {}
    }
}
</script>

<style lang="scss" scoped>
.main-content {
    width: 100%;
}
.el-menu-item {
    font-size: 14px;

    span {
        margin-left: 10px;
    }
}
</style>
