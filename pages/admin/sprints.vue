<template>
  <div class="main-content">
    <div class="title-buttons">
      <h2>Manage Sprints</h2>
      <el-button
        type="success"
        icon="el-icon-plus"
        class="create-new-btn"
        @click="handleEditSprint({})"
      >
        Create New Sprint
      </el-button>
    </div>
    <el-table
      border
      v-loading="loading"
      :data="paginated[currentPage-1]"
      class="sprints-table"
      width="100%"
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
            {{ row.name }}
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
            @click="handleEditSprint(row)"
          />
          <el-button
            plain
            size="mini"
            icon="el-icon-delete"
            type="danger"
            :disabled="!canEdit(row)"
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

    <sprint-editor
      v-if="visible.editorDialog"
      :visible="visible.editorDialog"
      :data="currentSprint"
      title="Sprint Editor"
      @on-close="visible.editorDialog = false"
      @on-save="handleSubmit"
    />
  </div>
</template>

<script>
import consola from 'consola';
import { mapState } from 'vuex';
import { chunk, flatten, isEqual } from 'lodash';
import { SprintEditor } from '@/components';
import {
  checkAuthor,
  checkRole,
  diff,
  sanitizeData,
} from '@/library';

export default {
  name: 'AdminSprints',

  components: {
    SprintEditor,
  },

  data() {
    return {
      selection: 'name',
      currentPage: 1,
      currentSprint: undefined,
      pageSize: 8,
      filter: '',
      selectedMaterials: [],
      changed: false,
      loading: false,
      visible: {
        formDialog: false,
        materialDialog: false,
        editorDialog: false,
      },
      changedPositions: {},
    };
  },

  computed: {
    ...mapState('paths', ['paths']),
    ...mapState('sprints', ['sprints']),
    ...mapState('materials', ['materials']),

    paginated() {
      return chunk(
        this.sprints.filter((o) => this.matched(o) && this.canSee(o)),
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

    currentSprint: {
      handler(sprint) {
        this.selectedMaterials = sprint.materials || [];
      },
      deep: true,
    },

  },

  mounted() {
    if (this.$route.query.page < this.paginated.length) {
      this.currentPage = parseInt(this.$route.query.page, 10);
    } else {
      this.$router.push({ query: {} });
    }
  },

  methods: {
    matched(o) {
      return o.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    },

    canEdit(p) {
      return checkRole(this.$auth.user, 'admin') || checkAuthor(this.$auth.user, p);
    },

    canSee(p) {
      return p.status === 'public' || this.canEdit(p);
    },

    handleVisible(key, state) {
      this.visible[key] = typeof state !== 'undefined' ? state : !this.visible[key];
    },

    handleSelected(selections) {
      this.selectedMaterials = selections;
    },

    handlePositions(positions) {
      this.changedPositions = positions;
    },

    handleEditSprint(sprint) {
      this.currentSprint = sprint;
      this.visible.editorDialog = true;
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

    async handleSubmit(currentSprint) {
      try {
        this.working = true;
        this.$nuxt.$loading.start();

        const {
          file,
          id,
          materials,
        } = currentSprint;

        const newData = sanitizeData({ ...currentSprint });
        const oldData = sanitizeData(this.currentSprint);

        if (file) {
          const uploadedUrl = await this.handleUpload(file);
          newData.image = uploadedUrl;
        }

        const removed = diff(this.selectedMaterials, materials);

        // Can't remove if create new path
        if (oldData && removed && removed.length > 0) {
          await this.$store.dispatch('sprints/REMOVE_MATERIALS', {
            sprintId: id,
            materialIds: removed.map((o) => o._id),
          });
        }

        let newId = '';
        if (!isEqual(newData, oldData)) {
          const ACTION = `${id ? 'UPDATE' : 'CREATE'}_SPRINT`;
          const response = await this.$store.dispatch(`sprints/${ACTION}`, {
            sprintId: id,
            data: newData,
          });

          newId = response._id;
        }

        // Can not add without ID
        const added = diff(materials, this.selectedMaterials);

        if (added && added.length > 0) {
          await this.$store.dispatch('sprints/ADD_MATERIALS', {
            sprintId: id || newId,
            materialIds: added.map((o) => o._id),
          });
        }

        this.visible.editorDialog = false;
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
