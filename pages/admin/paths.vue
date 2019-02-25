<template>
  <div class="main-content">
    <el-table
      v-loading="loading"
      class="paths-table"
      :data="paths"
      border
    >
      <el-table-column
        prop="name"
        label="Name"
        width="300"
      />
      <el-table-column
        prop="description"
        label="Description"
        width="300"
      />
      <el-table-column
        label="Sprints"
        width="200"
      >
        <template slot-scope="scopePath">
          <el-popover
            placement="left"
            width="400"
            trigger="click"
            @show="calculateSelections"
            @hide="handleReset"
          >
            <el-button slot="reference" size="mini">
              Manage Sprints ({{ scopePath.row.sprints.length }})
            </el-button>
            <el-table
              :ref="scopePath.row._id"
              :data="sprints"
              row-key="_id"
              @select="handleManualSelections"
            >
              <el-table-column
                type="selection"
                width="40"
              />
              <el-table-column
                width="260"
                property="name"
                label="Sprint Name"
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
        </template>
      </el-table-column>
      <el-table-column
        label="Created"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.createdTime | convertTime('DD.MM.YYYY') }}
        </template>
      </el-table-column>
    </el-table>
    <el-button
      type="success"
      icon="el-icon-plus"
      @click="handleDialog"
    >
      Create New Path
    </el-button>

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

        handleManualSelections(selection, row) {
            this.changed = true
            this.selectedSprints = selection
            consola.info(selection, row)
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

        async handleSubmit(id) {
            this.loading = true
            const currentSprints = this.paths.find(p => p._id === id).sprints
            const removed = currentSprints.filter(c => !this.selectedSprints.find(o => o._id === c._id))
            const added = this.selectedSprints.filter(s => !currentSprints.find(o => o._id === s._id))
            await this.$store.dispatch('paths/REMOVE_SPRINTS', {
                pathId: id,
                sprintIds: removed.map(o => o._id)
            })
            await this.$store.dispatch('paths/ADD_SPRINTS', {
                pathId: id,
                sprintIds: added.map(o => o._id)
            })
            this.loading = false
        },

        handleReset() {
            this.calculateSelections()
            this.changed = false
        }
    }
}
</script>

<style lang="scss" scoped>
.main-content {
    width: 100%;
    margin-left: 20px;
}
.paths-table {
    margin-bottom: 20px;
}
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
</style>
