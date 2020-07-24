<template>
  <div class="main-content">
    <div class="title-buttons">
      <h2>Manage Sprints</h2>
      <el-button
        type="success"
        icon="el-icon-plus"
        class="create-new-btn"
        @click="handleDialog"
      >
        Create New Sprint
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="paginated[currentPage-1]"
      class="sprints-table"
      width="100%"
      border
    >
      <el-table-column
        align="center"
        type="selection"
        width="50"
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
          <material-popover
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

    <sprint-form :visible.sync="formVisible" />
  </div>
</template>

<script>
import consola from 'consola';
import { mapState } from 'vuex';
import { chunk, flatten } from 'lodash';
import MaterialPopover from '@/components/sprint/MaterialPopover';
import SprintForm from '@/components/sprint/SprintForm';

export default {
  name: 'AdminSprints',

  components: {
    SprintForm,
    MaterialPopover,
  },

  data() {
    return {
      selection: 'name',
      currentPage: 1,
      pageSize: 7,
      filter: '',
      selectedSprints: null,
      selectedMaterials: null,
      changed: false,
      loading: false,
      formVisible: false,
      changedPositions: {},
    };
  },

  computed: {
    ...mapState('paths', ['paths']),
    ...mapState('sprints', ['sprints']),
    ...mapState('materials', ['materials']),

    paginated() {
      return chunk(this.sprints.filter((o) => this.matched(o.name)), this.pageSize);
    },

    total() {
      // we need to do total this way to reflect correct total entries
      // after user filtering the results.
      return flatten(this.paginated).length;
    },
  },

  watch: {
    currentPage() {
      if (this.currentPage > 1) {
        this.$router.push({ query: { page: this.currentPage } });
      } else {
        this.$router.push({ query: {} });
      }
    },
  },

  created() {
    if (this.$route.query.page
            && this.$route.query.page < this.paginated.length) {
      this.currentPage = parseInt(this.$route.query.page, 10);
    } else {
      this.$router.push({ query: {} });
    }
  },

  methods: {
    matched(str) {
      return str.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    },

    handleDialog() {
      this.formVisible = !this.formVisible;
    },

    handleSelected(selections) {
      this.selectedMaterials = selections;
    },

    handlePositions(positions) {
      this.changedPositions = positions;
    },

    /*
         * Calculate and pre-select the sprints that already included
         * into this path.
         */
    calculateSelections() {
      this.sprints.forEach((s) => {
        this.$refs[s._id].clearSelection();
        s.materials.forEach((m) => {
          const index = this.materials.findIndex((e) => e._id === m._id);
          this.$refs[s._id].toggleRowSelection(this.materials[index], 'selected');
        });
      });
    },

    handleReset() {
      this.calculateSelections();
      this.changed = false;
    },

    async handleSubmit(id) {
      try {
        this.loading = true;
        this.$nuxt.$loading.start();

        const currentMaterials = this.sprints.find((s) => s._id === id).materials;
        const removed = currentMaterials.filter((c) => !this.selectedMaterials.find((o) => o._id === c._id));
        const added = this.selectedMaterials.filter((s) => !currentMaterials.find((o) => o._id === s._id));

        if (removed && removed.length > 0) {
          await this.$store.dispatch('sprints/REMOVE_MATERIALS', {
            sprintId: id,
            materialIds: removed.map((o) => o._id),
          });
        }

        if (added && added.length > 0) {
          await this.$store.dispatch('sprints/ADD_MATERIALS', {
            sprintId: id,
            materialIds: added.map((o) => o._id),
          });
        }
        this.loading = false;
        this.$nuxt.$loading.finish();
      } catch (e) {
        this.$nuxt.$loading.fail();
        consola.error(e.message);
        this.$message.error(e.message);
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
            center: true,
          },
        ).then(async () => {
          this.loading = true;
          this.$nuxt.$loading.start();
          await this.$store.dispatch('sprints/DELETE_SPRINT', id);
          this.$message({
            type: 'success',
            message: 'Delete completed',
            showClose: true,
            duration: 500,
          });
          this.loading = false;
          this.$nuxt.$loading.finish();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
            showClose: true,
            duration: 500,
          });
        });
      } catch (e) {
        this.$nuxt.$loading.fail();
        consola.error(e.message);
        this.$message.error(e.message);
      }
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
.manage-popover {
    min-width: 160px;
}
</style>
