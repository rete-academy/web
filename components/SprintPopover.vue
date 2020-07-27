<template>
  <el-dialog
    width="560px"
    :title="title"
    :visible="visible"
    @show="calculateSelections"
    @close="handleClose"
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
      :ref="tableId"
      :data="paginated[currentPage - 1]"
      row-key="_id"
      @select="handleSelections"
      @select-all="handleSelections"
    >
      <el-table-column
        align="center"
        type="selection"
        width="50"
      />
      <el-table-column
        width="380"
        label="Sprint Name"
      >
        <template slot-scope="scope">
          {{ scope.row.name | truncate(45) }}
        </template>
      </el-table-column>
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
        width="100"
        label="Position"
      >
        <template slot-scope="scope">
          <el-input
            class="position-input"
            v-model="position[scope.row._id]"
            size="mini"
            placeholder="0"
            @change="changed = true"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="controllers">
      <el-pagination
        background
        v-if="paginated.length > 1"
        class="pagination"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      />

      <div v-else class="empty">&nbsp;</div>
      <div class="buttons">
        <el-button
          size="mini"
          @click="handleClose"
        >
          Close
        </el-button>
        <el-button
          type="success"
          size="mini"
          :disabled="!changed"
          @click="handleSubmit(data._id)"
        >
          Save
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { chunk, flatten } from 'lodash';
import { mapState } from 'vuex';

export default {
  name: 'SprintPopover',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selectedSprints: null,
      currentPage: 1,
      changed: false,
      position: {},
      filter: '',
      pageSize: 8,
    };
  },

  computed: {
    ...mapState('paths', ['paths']),
    ...mapState('sprints', ['sprints']),

    paginated() {
      return chunk(this.sprints.filter((o) => this.matched(o.name)), this.pageSize);
    },

    total() {
      // we need to do total this way to reflect correct total entries
      // after user filtering the results.
      return flatten(this.paginated).length;
    },

    tableId() {
      return this.data._id + this.currentPage;
    },
  },

  created() {
    this.position = this.convertPositions(this.data.meta.position || {});
  },

  updated() {
    this.calculateSelections();
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
    matched(str) {
      return str.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    },

    convertPositions(pos) {
      const toNum = {};
      // eslint-disable-next-line
      for (const id in pos) {
        toNum[id] = pos[id] ? parseInt(pos[id], 10) : 0;
      }
      // consola.info(toNum)
      return toNum;
    },

    calculateSelections() {
      // this.position = this.convertPositions(this.data.meta.position || {});
      this.data.sprints.forEach((s) => {
        const index = this.sprints.findIndex((e) => e._id === s._id);
        this.$refs[this.tableId].toggleRowSelection(this.sprints[index], 'selected');
      });
    },

    handleSelections(selections) {
      this.changed = true;
      this.selectedSprints = selections;
      this.$emit('selected', selections);
    },

    handleClose() {
      this.calculateSelections();
      this.changed = false;
      this.$emit('close', {});
    },

    handleSubmit(id) {
      this.$emit('submit', id);
    },
  },
};
</script>

<style lang="scss" scoped>
.controllers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.position-input {
  text-align: center;
  width: 60px;
}
</style>
