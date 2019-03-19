<template>
    <div class="main-content">
        <div class="title-buttons">
            <h2>Manage Sprints</h2>
            <el-button
                type="success"
                icon="el-icon-plus"
                class="create-new-btn"
                @click="handleSprintDialog"
            >
                Create New Sprint
            </el-button>
        </div>
        <el-table
            v-loading="loading"
            :data="sprints"
            class="sprints-table"
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
                <template slot-scope="scopeSprint">
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
                            Manage Materials ({{ scopeSprint.row.materials.length }})
                        </el-button>
                        <el-table
                            :ref="scopeSprint.row._id"
                            :data="materials"
                            row-key="_id"
                            @select="handleSelections"
                            @select-all="handleSelections"
                        >
                            <el-table-column
                                type="selection"
                                width="40"
                            />
                            <el-table-column
                                width="360"
                                label="Material Name"
                                property="name"
                            />
                        </el-table>
                        <div class="buttons">
                            <el-button
                                type="success"
                                size="mini"
                                :disabled="!changed"
                                @click="handleSubmit(scopeSprint.row._id)"
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
                        @click="handleDelete(scopeSprint.row._id)"
                    />
                </template>
            </el-table-column>
        </el-table>

        <sprint-form :visible.sync="sprintFormVisible" />
    </div>
</template>

<script>
import consola from 'consola'
import { mapState } from 'vuex'
import SprintForm from '@/components/form/Sprint'

export default {
    name: 'AdminSprints',

    components: { SprintForm },

    data() {
        return {
            selectedSprints: null,
            selectedMaterials: null,
            changed: false,
            loading: false,
            sprintFormVisible: false
        }
    },

    computed: {
        ...mapState('paths', ['paths']),
        ...mapState('sprints', ['sprints']),
        ...mapState('materials', ['materials'])
    },

    methods: {
        handleDialog() {
            this.pathFormVisible = !this.pathFormVisible
        },

        handleSprintDialog() {
            this.sprintFormVisible = !this.sprintFormVisible
        },

        handleSelections(selection) {
            this.changed = true
            this.selectedMaterials = selection
        },

        /*
         * Calculate and pre-select the sprints that already included
         * into this path.
         */
        calculateSelections() {
            this.sprints.forEach((s) => {
                this.$refs[s._id].clearSelection()
                s.materials.forEach((m) => {
                    const index = this.materials.findIndex(e => e._id === m._id)
                    this.$refs[s._id].toggleRowSelection(this.materials[index], 'selected')
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
                const currentMaterials = this.sprints.find(s => s._id === id).materials
                const removed = currentMaterials.filter(c =>
                    !this.selectedMaterials.find(o => o._id === c._id))
                const added = this.selectedMaterials.filter(s =>
                    !currentMaterials.find(o => o._id === s._id))

                if (removed && removed.length > 0) {
                    await this.$store.dispatch('sprints/REMOVE_MATERIALS', {
                        sprintId: id,
                        materialIds: removed.map(o => o._id)
                    })
                }

                if (added && added.length > 0) {
                    await this.$store.dispatch('sprints/ADD_MATERIALS', {
                        sprintId: id,
                        materialIds: added.map(o => o._id)
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
                    'This will permanently delete the sprint. Continue?',
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
                    await this.$store.dispatch('sprints/DELETE_SPRINT', id)
                    this.$message({
                        type: 'success',
                        message: 'Delete completed',
                        showClose: true,
                        duration: 500
                    })
                    this.loading = false
                    this.$nuxt.$loading.finish()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled',
                        showClose: true,
                        duration: 500
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
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.manage-popover {
    min-width: 160px;
}
</style>
