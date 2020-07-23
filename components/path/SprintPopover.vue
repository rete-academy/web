<template>
  <el-popover
    width="500"
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
        width="280"
        label="Sprint Name"
        property="name"
      />
      <el-table-column
        align="center"
        width="100"
        label="Materials"
      >
        <template slot-scope="scope">
          {{ scope.row.materials.length }}
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="Position"
      >
        <template slot-scope="scope">
          <el-input
            v-model="position[scope.row._id]"
            size="mini"
            placeholder="0"
            @change="changed = true"
          />
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
// import consola from 'consola'
import { mapState } from 'vuex';

export default {
  name: 'SprintPopover',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      selectedSprints: null,
      changed: false,
      position: {},
    };
  },

  computed: {
    ...mapState('paths', ['paths']),
    ...mapState('sprints', ['sprints']),
  },

  watch: {
    position: {
      handler(pos) {
        this.changed = true;
        this.$emit('positions-changed', this.convertPositions(pos));
      },
      deep: true,
    },
  },

  methods: {
    convertPositions(pos) {
      const toNum = {};
      // eslint-disable-next-line
      for (const id in pos) {
        toNum[id] = pos[id] ? parseInt(pos[id], 10) : 0;
      }
      // consola.info(toNum)
      return toNum;
    },
    /*
         * Calculate and pre-select the sprints that already included
         * into this path.
         */
    calculateSelections() {
      this.$refs[this.data._id].clearSelection();
      this.position = this.convertPositions(this.data.meta.position || {});
      this.data.sprints.forEach((s) => {
        const index = this.sprints.findIndex((e) => e._id === s._id);
        this.$refs[this.data._id].toggleRowSelection(this.sprints[index], 'selected');
      });
    },

    handleSelections(selections) {
      this.changed = true;
      this.selectedSprints = selections;
      this.$emit('selected', selections);
    },

    handleReset() {
      this.calculateSelections();
      this.changed = false;
    },

    handleSubmit(id) {
      this.$emit('submit', id);
    },
  },
};
</script>
<style lang="scss" scoped>
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
</style>
