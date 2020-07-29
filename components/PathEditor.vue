<template>
  <el-dialog
    width="560px"
    :title="title"
    :visible="!!data"
    @close="handleClose"
  >
    <el-tabs
      v-model="activeTab"
      @tab-click="handleChangeTab"
    >
      <el-tab-pane label="Configurations" name="config">
        <el-form ref="form" :model="form" label-width="120">
          <el-form-item label="Path name">
            <el-input v-model="form.name" :debounce="200"/>
          </el-form-item>
          <el-form-item label="Description">
            <el-input
              type="textarea"
              v-model="form.description"
              :rows="3"
            />
          </el-form-item>
          <el-form-item label="Visibility">
            <el-select
              filterable
              placeholder="Select visibility"
              v-model="form.status"
            >
              <el-option
                v-for="v in visibilities"
                :key="v.value"
                :label="v.label"
                :value="v.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Manage sprints" name="sprints">
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
            <template slot-scope="{ row }">
              {{ row.name | truncate(45) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            label="Materials"
          >
            <template slot-scope="{ row }">
              {{ row.materials.length }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Position"
          >
            <template slot-scope="{ row }">
              <el-input
                class="position-input"
                v-model="position[row._id]"
                size="mini"
                placeholder="0"
                @change="changed = true"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <div class="controllers">
      <el-pagination
        background
        v-if="paginated.length > 1 && activeTab === 'sprints'"
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
import { chunk, debounce, flatten } from 'lodash';
import { mapState } from 'vuex';

export default {
  name: 'PathEditor',

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
      activeTab: 'config',
      selectedSprints: this.data.sprints,
      currentPage: 1,
      changed: false,
      position: {},
      filter: '',
      pageSize: 8,
      form: {
        name: this.data.name,
        description: this.data.description,
        status: this.data.status,
      },
    };
  },

  computed: {
    ...mapState('paths', ['paths']),
    ...mapState('sprints', ['sprints']),

    visibilities() {
      return [
        { value: 'public', label: 'Public' },
        { value: 'draft', label: 'Draft' },
        { value: 'unlisted', label: 'Unlisted' },
      ];
    },

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
    this.selectedSprints = this.data.sprints;
  },

  mounted() {
    // this.position = this.convertPositions(this.data.meta.position || {});
    this.$router.push({ query: { id: this.data._id, tab: 'config' } });
    setTimeout(() => this.calculateSelections(), 10);
  },

  destroyed() {
    this.$router.push({ query: {} });
  },

  watch: {
    position: {
      handler(pos) {
        this.changed = true;
        this.$emit('positions-changed', this.convertPositions(pos));
      },
      deep: true,
    },

    form: {
      handler: debounce(function (obj) {
        this.changed = true;
        this.$emit('data-changed', obj);
      }, 300),
      deep: true,
    },

    currentPage() {
      setTimeout(() => this.calculateSelections(), 10);
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
      this.selectedSprints.forEach((s) => {
        const i = this.sprints.findIndex((e) => e._id === s._id);
        this.$refs[this.tableId].toggleRowSelection(this.sprints[i], 'selected');
      });
    },

    handleChangeTab({ name }) {
      this.activeTab = name;
      this.$router.push({ query: { id: this.data._id, tab: name } });
    },

    handleSelections(selections) {
      this.changed = true;
      this.selectedSprints = selections;
      this.$emit('selected', selections);
    },

    handleClose() {
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
