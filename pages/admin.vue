<template>
    <div class="admin wrapper">
        <el-row :gutter="10">
            <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="3">
                <el-menu
                    class="el-menu-vertical"
                    :collapse="false"
                    router
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
            </el-col>
            <el-col :xs="17" :sm="18" :md="19" :lg="20" :xl="21">
                <nuxt-child class="main-content" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'AdminView',

    data() {
        return {
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
.el-menu-vertical:not(.el-menu--collapse) {
    width: 100%;
    min-height: 400px;
}
.main-content {
    width: 100%;
}
.el-menu-item {
    font-size: 15px;

    span {
        margin-left: 10px;
    }
}
</style>
