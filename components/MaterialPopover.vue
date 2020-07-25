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
      Manage Materials ({{ data.materials.length }})
    </el-button>
    <el-table
      :ref="tableId"
      :data="currentData"
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
        property="name"
      >
        <template slot="header" slot-scope="scope">
          <div class="head-search">
            <span>
              Material Name
            </span>
            <el-input
              :key="scope.column.id"
              v-model="filter"
              size="mini"
              placeholder="Type to search"
              clearable
            />
          </div>
        </template>
        <template slot-scope="scope">
          <p class="name">
            {{ scope.row.name | truncate(50) }}
          </p>
          <p class="description">
            {{ scope.row.description | truncate(140) }}
          </p>
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
    <div class="controllers">
      <el-pagination
        v-if="paginated.length > 1"
        background
        small
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        class="small-pagination"
        @current-change="calculateSelections"
      />
      <div v-else class="empty">
                &nbsp;
      </div>
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
    </div>
  </el-popover>
</template>
<script>
// import consola from 'consola'
import { chunk, flatten } from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'MaterialPopover',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      selection: 'name',
      currentPage: 1,
      pageSize: 4,
      filter: '',
      selectedMaterials: null,
      changed: false,
      position: {},
    };
  },

  computed: {
    ...mapGetters('paths', ['paths']),
    ...mapGetters('sprints', ['sprints']),
    ...mapGetters('materials', ['materials']),

    paginated() {
      return chunk(this.materials
        .filter((o) => this.matched(o.name)), this.pageSize);
    },

    total() {
      // we need to do total this way to reflect correct total entries
      // after user filtering the results.
      return flatten(this.paginated).length;
    },

    currentData() {
      return this.paginated[this.currentPage - 1];
    },

    tableId() {
      return this.data._id + this.currentPage;
    },
  },

  watch: {
    position: {
      handler(pos) {
        this.changed = true;
        this.$emit('positions-changed', this.convertPositions(pos));
      },
      deep: true,
    },

    filter() {
    },
  },

  created() {
    this.position = this.convertPositions(this.data.meta.position || {});
  },

  updated() {
    this.calculateSelections();
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

    /*
         * Calculate and pre-select the sprints that already included
         * into this path.
         */
    calculateSelections() {
      // this.$refs[tableId].clearSelection()
      this.data.materials.forEach((s) => {
        const index = this.materials.findIndex((e) => e._id === s._id);
        this.$refs[this.tableId].toggleRowSelection(this.materials[index], 'selected');
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
.controllers {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
.name {
    font-weight: bold;
}
.description {
    line-height: 14px;
    font-size: 11px;
    color: #999;
}
.head-search {
    display: flex;
    justify-content: space-between;
    padding: 0;
}
</style>
