<template>
    <div class="main-content">
        <div class="title-buttons">
            <h2>Manage Users</h2>
            <!-- el-button
                type="success"
                icon="el-icon-plus"
                class="create-new-btn right"
            >
                Add New User
            </el-button -->
        </div>
        <el-table
            v-loading="loading"
            :data="users"
            class="user-table"
            width="100%"
            border
        >
            <el-table-column
                label="Name"
                width="320"
            >
                <template slot-scope="scope">
                    <p class="material-name">
                        <span class="icon">
                            <fa :icon="isAdmin(scope.row) ? 'star' : 'user'" />
                        </span>
                        <span class="name">
                            {{ scope.row.name }}
                        </span>
                    </p>
                    <p class="time">
                        Sign up time: {{ scope.row.createdTime | convertTime('HH:mm DD.MM.YYYY') }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="Progress">
                <template slot-scope="scope">
                    {{ scope.row.progress.length }}
                </template>
            </el-table-column>
            <el-table-column label="Confirmation">
                <template slot-scope="scope">
                    {{ scope.row.meta.confirm }}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="Actions"
                width="250"
            >
                <template slot-scope="scope">
                    <setting-popover
                        :data="scope.row"
                    />
                    <el-button
                        size="mini"
                        icon="el-icon-edit"
                        type="warning"
                        plain
                    />
                    <el-button
                        size="mini"
                        icon="el-icon-delete"
                        type="danger"
                        plain
                        @click="handleDelete(scope.row._id)"
                    />
                </template>
            </el-table-column>
        </el-table>

        <!-- material-form :visible.sync="userFormVisible" / -->
    </div>
</template>

<script>
import consola from 'consola'
import { mapGetters } from 'vuex'
import SettingPopover from '@/components/user/SettingPopover'
// import MaterialForm from '@/components/form/Material'

export default {
    name: 'AdminUsers',

    components: { SettingPopover },

    data() {
        return {
            selectedUsers: null,
            changed: false,
            loading: false,
            userFormVisible: false
        }
    },

    computed: {
        ...mapGetters('users', ['users'])
    },

    created() {},

    methods: {
        isAdmin(user) {
            if (user && user.role) {
                if (user.role.reduce((i, j) => i * j) === 0) return true
                return false
            }
            return false
        },

        handleMaterialDialog() {
            this.materialFormVisible = !this.materialFormVisible
        },

        handleSelected(selected) {
            this.changed = true
            consola.info(selected)
        },

        /*
         * Calculate and pre-select the sprints that already included
         * into this path.
         */

        async handleSubmit(id) {
            try {
                this.loading = true
                this.$nuxt.$loading.start()
                await this.$store.dispatch('materials/UPDATE_USER', id)
                this.loading = false
                this.$nuxt.$loading.finish()
            } catch (e) {
                this.$nuxt.$loading.fail()
                consola.error(e.message)
                this.$message.error(e.message)
            }
        },

        handleDelete(id) {
            try {
                this.$confirm(
                    'This will permanently delete this material. Continue?',
                    'Warning',
                    {
                        confirmButtonText: 'OK, Delete',
                        confirmButtonClass: 'el-button--danger',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                        center: true
                    }
                ).then(async () => {
                    this.loading = true
                    this.$nuxt.$loading.start()
                    await this.$store.dispatch('materials/DELETE_MATERIAL', id)
                    this.$message({
                        type: 'success',
                        message: 'Delete completed',
                        showClose: true,
                        duration: 1000
                    })
                    this.loading = false
                    this.$nuxt.$loading.finish()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled',
                        showClose: true,
                        duration: 1000
                    })
                })
            } catch (e) {
                this.$nuxt.$loading.fail()
                consola.error(e.message)
                this.$message.error(e.message)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.paths-table {
    margin-bottom: 20px;
    width: 100%;
}
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.manage-popover {
    min-width: 160px;
}
</style>
