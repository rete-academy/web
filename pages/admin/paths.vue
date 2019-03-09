<template>
    <div class="main-content">
        <div class="title-buttons">
            <h2>Manage Paths</h2>
            <el-button
                type="success"
                icon="el-icon-plus"
                class="create-new-btn right"
                @click="handleDialog"
            >
                Create New Path
            </el-button>
        </div>
        <el-table
            v-loading="loading"
            class="paths-table"
            :data="paths"
            width="100%"
            border
        >
            <el-table-column
                label="Name"
                width="320"
            >
                <template slot-scope="scope">
                    <p class="name">
                        {{ scope.row.name }}
                    </p>
                    <p class="time">
                        Updated: {{ scope.row.updatedTime | convertTime('HH:mm DD.MM.YYYY') }}
                        – v.{{ scope.row.meta.version }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="Description"
            />
            <el-table-column
                align="center"
                label="Actions"
                width="250"
            >
                <template slot-scope="scope">
                    <sprint-popover
                        :data="scope.row"
                        :selected="handleSelected"
                        @submit="handleSubmit"
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

        <path-form :visible.sync="pathFormVisible" />
    </div>
</template>

<script>
import consola from 'consola'
import { mapState } from 'vuex'
import PathForm from '@/components/form/Path'
import SprintPopover from '@/components/path/SprintPopover'

export default {
    name: 'AdminPaths',

    components: { PathForm, SprintPopover },

    data() {
        return {
            loading: false,
            pathFormVisible: false,
            selectedSprints: null
        }
    },

    computed: {
        ...mapState('paths', ['paths']),
        ...mapState('sprints', ['sprints'])
    },

    created() {
        this.$nuxt.$on('selected', (data) => {
            this.selectedSprints = data
        })

        this.$nuxt.$on('submit', (id) => {
            this.handleSubmit(id)
        })
    },

    methods: {
        handleDialog() {
            this.pathFormVisible = !this.pathFormVisible
        },

        handleSelected(selections) {
            this.selectedSprints = selections
        },

        async handleSubmit(id) {
            try {
                this.loading = true
                this.$nuxt.$loading.start()
                const currentSprints = this.paths.find(p => p._id === id).sprints

                const removed = currentSprints.filter(c =>
                    !this.selectedSprints.find(o => o._id === c._id))
                const added = this.selectedSprints.filter(s =>
                    !currentSprints.find(o => o._id === s._id))

                if (removed && removed.length > 0) {
                    await this.$store.dispatch('paths/REMOVE_SPRINTS', {
                        pathId: id,
                        sprintIds: removed.map(o => o._id)
                    })
                }

                if (added && added.length > 0) {
                    await this.$store.dispatch('paths/ADD_SPRINTS', {
                        pathId: id,
                        sprintIds: added.map(o => o._id)
                    })
                }

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
                    'This will permanently delete the path. Continue?',
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
                    await this.$store.dispatch('paths/DELETE_PATH', id)
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
    min-width: 160p;
}
</style>
