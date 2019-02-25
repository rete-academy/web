<template>
    <div class="admin wrapper">
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
        <nuxt-child class="main-content" />
    <!--
    <el-button
      type="success"
      icon="el-icon-plus"
      @click="handleMaterialDialog"
    >
      Add Material
    </el-button>

    <material-form
      :visible.sync="materialFormVisible"
    />
    -->
    </div>
</template>

<script>
// import MaterialForm from '@/components/form/Material'

export default {
    name: 'AdminView',

    // components: { MaterialForm },

    data() {
        return {
            materialFormVisible: false
        }
    },

    created() {
        this.$store.dispatch('paths/GET_PATHS')
        this.$store.dispatch('sprints/GET_SPRINTS')
    },

    methods: {
        handleMaterialDialog() {
            this.materialFormVisible = !this.materialFormVisible
        },

        handleClose() {},
        handleOpen() {}
    }
}
</script>

<style lang="scss" scoped>
.admin {
    display: flex;
}
.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
.main-content {

}
.el-menu-item {
    font-size: 15px;

    span {
        margin-left: 10px;
    }
}
</style>
