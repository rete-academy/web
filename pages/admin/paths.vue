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
                <template slot-scope="scopePath">
                    <el-popover
                        width="400"
                        placement="left"
                        trigger="click"
                        @show="calculateSelections"
                        @hide="handleReset"
                    >
                        <el-button
                            slot="reference"
                            size="mini"
                            class="manage-popover"
                            type="primary"
                            plain
                        >
                            Manage Sprints ({{ scopePath.row.sprints.length }})
                        </el-button>
                        <el-table
                            :ref="scopePath.row._id"
                            :data="sprints"
                            row-key="_id"
                            @select="handleSelections"
                            @select-all="handleSelections"
                        >
                            <el-table-column
                                type="selection"
                                width="40"
                            />
                            <el-table-column
                                width="260"
                                label="Sprint Name"
                                property="name"
                            />
                            <el-table-column
                                width="100"
                                label="Materials"
                            >
                                <template slot-scope="scopeSprint">
                                    {{ scopeSprint.row.materials.length }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="buttons">
                            <el-button
                                type="success"
                                size="mini"
                                :disabled="!changed"
                                @click="handleSubmit(scopePath.row._id)"
                            >
                                Save
                            </el-button>
                            <el-button
                                size="mini"
                                @click="handleReset"
                            >
                                Reset
                            </el-button>
                        </div>
                    </el-popover>

                    <el-button
                        size="mini"
                        icon="el-icon-delete"
                        type="danger"
                        plain
                        @click="handleDelete(scopePath.row._id)"
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

export default {
    name: 'AdminPaths',

    components: { PathForm },

    data() {
        return {
            selectedSprints: null,
            changed: false,
            loading: false,
            pathFormVisible: false
        }
    },

    computed: {
        ...mapState('paths', ['paths']),
        ...mapState('sprints', ['sprints'])
    },

    created() {
    },

    methods: {
        handleDialog() {
            this.pathFormVisible = !this.pathFormVisible
        },

        handleSelections(selection) {
            this.changed = true
            this.selectedSprints = selection
        },

        /*
         *Calculate and pre-select the sprints that already included
         * into this path.
         */
        calculateSelections() {
            this.paths.forEach((p) => {
                this.$refs[p._id].clearSelection()
                p.sprints.forEach((s) => {
                    const index = this.sprints.findIndex(e => e._id === s._id)
                    this.$refs[p._id].toggleRowSelection(this.sprints[index], 'selected')
                })
            })
        },

        handleReset() {
            this.calculateSelections()
            this.changed = false
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

                await this.$store.dispatch('paths/REMOVE_SPRINTS', {
                    pathId: id,
                    sprintIds: removed.map(o => o._id)
                })
                await this.$store.dispatch('paths/ADD_SPRINTS', {
                    pathId: id,
                    sprintIds: added.map(o => o._id)
                })

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
