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
                <span slot="title">
                    Paths
                </span>
            </el-menu-item>
            <el-menu-item index="/admin/sprints">
                <fa icon="tasks" />
                <span slot="title">Sprints</span>
            </el-menu-item>

            <el-menu-item index="/admin/materials">
                <fa icon="journal-whills" />
                <span slot="title">Materials</span>
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
export default {
    name: 'AdminView',

    data() {
        return {
            activeIndex: '/admin/paths',
            materialFormVisible: false
        }
    },

    created() {
        // should dispatch these per route, not like this.
        this.$store.dispatch('paths/GET_PATHS')
        this.$store.dispatch('sprints/GET_SPRINTS')
        this.$store.dispatch('materials/GET_MATERIALS')

        this.$router.push('/admin/paths')
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
    font-size: 12px;

    span {
        margin-left: 10px;
    }
}
</style>
