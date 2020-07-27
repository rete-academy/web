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
              class="search-input"
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
            {{ scope.row.description | truncate(60) }}
          </p>
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

    calculateSelections() {
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
.name {
  font-weight: bold;
}
.description {
  line-height: 1rem;
  font-size: 0.8rem;
  color: #999;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.head-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;

  .search-input {
    text-align: left;
    width: 60%;
  }
}

.position-input {
  text-align: center;
  width: 60px;
}
</style>
