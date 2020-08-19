<template>
  <div class="main-content">
    <div class="title-buttons">
      <h2>Manage Paths</h2>
      <el-button
        type="success"
        icon="el-icon-plus"
        class="create-new-btn right"
        @click="handleEditPath({})"
      >
        Create New Path
      </el-button>
    </div>
    <el-table
      :data="paginated[currentPage - 1]"
      class="paths-table"
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
        <template slot-scope="{ row }">
          <p class="name">
            {{ row.name | truncate(45) }}
          </p>
          <p class="time">
            Updated: {{ row.updatedTime | convertTime('HH:mm DD.MM.YYYY') }}
            – Version: {{ row.meta.version }}
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
        <template slot-scope="{ row }">
          <el-button
            plain
            size="mini"
            icon="el-icon-edit"
            :disabled="!canEdit(row)"
            @click="handleEditPath(row)"
          />
          <el-button
            :disabled="!canEdit(row)"
            size="mini"
            icon="el-icon-delete"
            type="danger"
            plain
            @click="handleDelete(row._id)"
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

    <path-editor
      v-if="visible.sprintDialog"
      :visible="visible.sprintDialog"
      :data="currentPath"
      title="Path Editor"
      @on-close="visible.sprintDialog = false"
      @on-save="handleSubmit"
    />
  </div>
</template>

<script>
import consola from 'consola';
import { mapState } from 'vuex';
import { chunk, flatten, isEqual } from 'lodash';

import { PathEditor } from '@/components';
import {
  checkAuthor,
  checkRole,
  diff,
  sanitizeData,
} from '@/library';

export default {
  name: 'AdminPaths',

  components: { PathEditor },

  data() {
    return {
      selection: 'name',
      currentPage: 1,
      currentPath: undefined,
      pageSize: 7,
      filter: '',
      formVisible: false,
      selectedSprints: [],
      changedPositions: {},
      visible: {
        formDialog: false,
        sprintDialog: false,
      },
      working: false,
    };
  },

  computed: {
    ...mapState('paths', ['paths']),
    ...mapState('sprints', ['sprints']),

    paginated() {
      return chunk(
        this.paths.filter((p) => this.matched(p) && this.canSee(p)),
        this.pageSize,
      );
    },

    total() {
      // we need to do total this way to reflect correct total entries
      // after user filtering the results.
      return flatten(this.paginated).length;
    },

    uploadHeaders() {
      return {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: this.$auth.getToken('local'),
      };
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

    currentPath: {
      handler(path) {
        this.selectedSprints = path.sprints || [];
      },
      deep: true,
    },
  },

  mounted() {
    if (this.$route.query.page && this.$route.query.page < this.paginated.length) {
      this.currentPage = parseInt(this.$route.query.page, 10);
    // } else {
      // this.$router.push({ query: {} });
    }
  },

  methods: {
    matched(p) {
      return p.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    },

    canEdit(p) {
      return checkRole(this.$auth.user, 'admin') || checkAuthor(this.$auth.user, p);
    },

    canSee(p) {
      return p.status === 'public' || this.canEdit(p);
    },

    handleEditPath(path) {
      this.currentPath = path;
      this.visible.sprintDialog = true;
    },

    async handleUpload(file) {
      try {
        this.$nuxt.$loading.start();

        const formData = new FormData();
        formData.append('files', file.raw);
        const { data } = await this.$axios.post(
          `${this.$axios.defaults.baseURL}/api/files/upload`,
          formData,
          { headers: this.uploadHeaders },
        );

        if (data && data.success && data.message.data.location) {
          this.$nuxt.$loading.finish();
          this.$message({
            message: 'Uploaded succesfully!',
            type: 'success',
          });

          return data.message.data.location;
        }

        return 'Can not find url from S3';
      } catch (error) {
        consola.error(error.message);
        this.$nuxt.$loading.fail();
        this.$message.error(`Oops, ${error.message}`);

        return 'Error';
      }
    },

    async handleSubmit(currentPath) {
      try {
        this.working = true;
        this.$nuxt.$loading.start();

        const {
          file,
          id,
          sprints,
        } = currentPath;

        const newData = sanitizeData({ ...currentPath });
        const oldData = sanitizeData(this.currentPath);

        if (file) {
          const uploadedUrl = await this.handleUpload(file);
          newData.image = uploadedUrl;
        }

        const removed = diff(this.selectedSprints, sprints);

        // Can't remove if create new path
        if (oldData && removed && removed.length > 0) {
          await this.$store.dispatch('paths/REMOVE_SPRINTS', {
            pathId: id,
            sprintIds: removed.map((o) => o._id),
          });
        }

        let newId = '';
        if (!isEqual(newData, oldData)) {
          const ACTION = `${id ? 'UPDATE' : 'CREATE'}_PATH`;
          const response = await this.$store.dispatch(`paths/${ACTION}`, {
            pathId: id,
            data: newData,
          });

          newId = response._id;
        }

        // Can not add without ID
        const added = diff(sprints, this.selectedSprints);

        if (added && added.length > 0) {
          await this.$store.dispatch('paths/ADD_SPRINTS', {
            pathId: id || newId,
            sprintIds: added.map((o) => o._id),
          });
        }

        this.visible.sprintDialog = false;
        this.$nuxt.$loading.finish();
      } catch (e) {
        this.$nuxt.$loading.fail();
        consola.error(e.message);
        this.$message.error(e.message);
      }
      this.working = false;
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
            center: true,
          },
        ).then(async () => {
          this.working = true;
          this.$nuxt.$loading.start();
          await this.$store.dispatch('paths/DELETE_PATH', id);
          this.$message({
            type: 'success',
            message: 'Delete completed',
            showClose: true,
            duration: 1000,
          });
          this.working = false;
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
.manage-popover {
    min-width: 160p;
}
</style>
