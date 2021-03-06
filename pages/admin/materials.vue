<template>
  <div class="main-content">
    <div class="title-buttons">
      <h2>Manage Materials</h2>
      <el-button
        type="success"
        icon="el-icon-plus"
        class="create-new-btn right"
        @click="handleEdit({})"
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
        <template slot-scope="{ row }">
          <p class="material-name">
            <span class="icon">
              <fa :icon="row.icon" />
            </span>
            <span class="name">
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.url | truncate(95)"
                :open-delay="900"
                placement="top-start"
              >
                <a :href="row.url" class="button" target="_blank">
                  {{ row.name | truncate(45) }}
                </a>
              </el-tooltip>
            </span>
          </p>
          <p class="time small">
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
            size="mini"
            icon="el-icon-edit"
            plain
            :disabled="!canEdit(row)"
            @click="handleEdit(row)"
          />
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            plain
            :disabled="!canEdit(row)"
            @click="handleDelete(row._id)"
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

    <material-form
      v-if="formVisible"
      :visible.sync="formVisible"
      :data="currentMaterial"
      @on-submit="handleSubmit"
    />
  </div>
</template>
<script>
import consola from 'consola';
import { mapState } from 'vuex';
import { chunk, flatten } from 'lodash';

import { MaterialForm } from '@/components';
import {
  checkAuthor,
  checkRole,
  sanitizeData,
} from '@/library';

export default {
  name: 'AdminMaterials',

  components: { MaterialForm },

  data() {
    return {
      selection: 'name',
      currentPage: 1,
      currentMaterial: undefined,
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
    ...mapState('sprints', ['sprints', 'selectedSprint']),
    ...mapState('materials', ['materials']),

    paginated() {
      return chunk(
        this.materials.filter((o) => this.matched(o) && this.canSee(o)),
        this.pageSize,
      );
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
    matched({ name }) {
      return name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    },

    canEdit(p) {
      return checkRole(this.$auth.user, 'admin') || checkAuthor(this.$auth.user, p);
    },

    canSee(p) {
      return p.status === 'public' || this.canEdit(p);
    },

    handleEdit(material) {
      this.formVisible = true;
      this.currentMaterial = material;
    },

    handleSelections(selection) {
      this.changed = true;
      this.selectedMaterials = selection;
    },

    async handleSubmit(data) {
      try {
        const { id } = data;

        const cleanData = sanitizeData(data);

        this.loading = true;
        this.$nuxt.$loading.start();

        const ACTION = `${id ? 'UPDATE' : 'CREATE'}_MATERIAL`;
        this.$store.dispatch(`materials/${ACTION}`, {
          materialId: id,
          data: cleanData,
        }).then((result) => {
          if (this.selectedSprint) {
            this.$store.dispatch('sprints/ADD_MATERIALS', {
              sprintId: this.selectedSprint,
              materialIds: result._id,
            });
          }

          this.$nuxt.$loading.finish();
          this.formVisible = false;
        }).catch((e) => {
          this.$nuxt.$loading.fail();
          consola.error(e.message);
          this.$message.error(e.message);
        });

        this.loading = false;
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
