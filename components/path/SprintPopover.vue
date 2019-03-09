<template>
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
            Manage Sprints ({{ data.sprints.length }})
        </el-button>
        <el-table
            :ref="data._id"
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
                label="Position"
            >
                <template slot-scope="scope">
                    <el-input
                        :value="getPosition(data, scope.row)"
                        placeholder="0"
                    />
                    {{ scope.row.materials.length }}
                </template>
            </el-table-column>
        </el-table>
        <div class="buttons">
            <el-button
                type="success"
                size="mini"
                :disabled="!changed"
                @click="handleSubmit(data._id)"
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

<script>
import { mapState } from 'vuex'

export default {
    name: 'SprintPopover',

    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            selectedSprints: null,
            changed: false
        }
    },

    computed: {
        ...mapState('paths', ['paths']),
        ...mapState('sprints', ['sprints'])
    },

    methods: {
        getPosition(path, sprint) {
            if (path.meta.position && path.meta.position[sprint._id]) {
                return path.meta.position[sprint._id]
            }
            return 0
        },
        /*
         * Calculate and pre-select the sprints that already included
         * into this path.
         */
        calculateSelections() {
            this.$refs[this.data._id].clearSelection()
            this.data.sprints.forEach((s) => {
                const index = this.sprints.findIndex(e => e._id === s._id)
                this.$refs[this.data._id].toggleRowSelection(this.sprints[index], 'selected')
            })
        },

        handleSelections(selection) {
            this.changed = true
            this.selectedSprints = selection
            this.$nuxt.$emit('selected', selection)
        },

        handleReset() {
            this.calculateSelections()
            this.changed = false
        },

        handleSubmit(id) {
            this.$nuxt.$emit('submit', id)
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
