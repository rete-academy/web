<template>
  <div class="main-content">
    <div class="title-buttons">
      <h2>Manage Materials</h2>
      <el-button
        type="success"
        icon="el-icon-plus"
        class="create-new-btn right"
        @click="handleDialog"
      >
        Add New Material
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="paginated[currentPage-1]"
      class="material-table"
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
        width="380"
      >
        <template slot-scope="scope">
          <p class="material-name">
            <span class="icon">
              <fa :icon="scope.row.icon" />
            </span>
            <span class="name">
              {{ scope.row.name }}
            </span>
          </p>
          <p class="time">
            Updated: {{ scope.row.updatedTime | convertTime('HH:mm DD.MM.YYYY') }}
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
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="warning"
            plain
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
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      class="pagination"
    />

    <material-form :visible.sync="formVisible" />
  </div>
</template>
<script>
import consola from 'consola';
import { mapState } from 'vuex';
import { chunk, flatten } from 'lodash';

import { MaterialForm } from '@/components';

export default {
  name: 'AdminMaterials',

  components: { MaterialForm },

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
    };
  },

  computed: {
    ...mapState('paths', ['paths']),
    ...mapState('sprints', ['sprints']),
    ...mapState('materials', ['materials']),

    paginated() {
      return chunk(this.materials
        .filter((o) => this.matched(o.name)), this.pageSize);
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
    if (this.$route.query.page && this.$route.query.page < this.paginated.length) {
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

    handleSelections(selection) {
      this.changed = true;
      this.selectedMaterials = selection;
    },

    /*
         * Calculate and pre-select the sprints that already included
         * into this path.
         */

    async handleSubmit(id) {
      try {
        this.loading = true;
        this.$nuxt.$loading.start();
        await this.$store.dispatch('materials/UPDATE_MATERIAL', id);
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
          'This will permanently delete this material. Continue?',
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
          await this.$store.dispatch('materials/DELETE_MATERIAL', id);
          this.$message({
            type: 'success',
            message: 'Delete completed',
            showClose: true,
            duration: 1000,
          });
          this.loading = false;
          this.$nuxt.$loading.finish();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
            showClose: true,
            duration: 1000,
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
.paths-table {
    margin-bottom: 20px;
    width: 100%;
}
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.manage-popover {
    min-width: 160px;
}
</style>
