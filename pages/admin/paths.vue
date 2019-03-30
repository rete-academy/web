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
            :data="paginated[currentPage-1]"
            class="paths-table"
            width="100%"
            border
        >
            <el-table-column
                type="selection"
                width="36"
            />
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
                        @selected="handleSelected"
                        @positions-changed="handlePositions"
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

        <el-pagination
            v-if="paginated.length > 1"
            background
            class="pagination"
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page.sync="currentPage"
        />

        <path-form :visible.sync="formVisible" />
    </div>
</template>

<script>
import consola from 'consola'
import { mapState } from 'vuex'
import { chunk, flatten } from 'lodash'
import PathForm from '@/components/path/PathForm'
import SprintPopover from '@/components/path/SprintPopover'

export default {
    name: 'AdminPaths',

    components: { PathForm, SprintPopover },

    data() {
        return {
            selection: 'name',
            currentPage: 1,
            pageSize: 7,
            filter: '',
            loading: false,
            formVisible: false,
            selectedSprints: null,
            changedPositions: {}
        }
    },

    computed: {
        ...mapState('paths', ['paths']),
        ...mapState('sprints', ['sprints']),

        paginated() {
            return chunk(this.paths.filter(o => this.matched(o.name)), this.pageSize)
        },

        total() {
            // we need to do total this way to reflect correct total entries
            // after user filtering the results.
            return flatten(this.paginated).length
        }
    },

    watch: {
        currentPage() {
            if (this.currentPage > 1) {
                this.$router.push({ query: { page: this.currentPage } })
            } else {
                this.$router.push({ query: {} })
            }
        }
    },

    created() {
        if (this.$route.query.page &&
            this.$route.query.page < this.paginated.length) {
            this.currentPage = parseInt(this.$route.query.page, 10)
        } else {
            this.$router.push({ query: {} })
        }
    },

    methods: {
        matched(str) {
            return str.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1
        },

        handleDialog() {
            this.formVisible = !this.formVisible
        },

        handleSelected(selections) {
            this.selectedSprints = selections
        },

        handlePositions(positions) {
            this.changedPositions = positions
        },

        async handleSubmit(id) {
            try {
                this.loading = true
                this.$nuxt.$loading.start()
                const currentSprints = this.paths.find(p => p._id === id).sprints

                let removed, added // need to find better way
                if (this.selectedSprints) {
                    removed = currentSprints.filter(c =>
                        !this.selectedSprints.find(o => o._id === c._id))
                    added = this.selectedSprints.filter(s =>
                        !currentSprints.find(o => o._id === s._id))
                }

                if (this.changedPositions) {
                    await this.$store.dispatch('paths/UPDATE_PATH', {
                        pathId: id,
                        data: { meta: { position: this.changedPositions } }
                    })
                }

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
.manage-popover {
    min-width: 160p;
}
</style>
