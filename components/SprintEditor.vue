<template>
  <el-dialog
    class="editor-dialog"
    width="600px"
    :title="title"
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-tabs
      v-model="activeTab"
      @tab-click="handleChangeTab"
    >
      <el-tab-pane label="Configurations" name="config">
        <el-form
          ref="form"
          :disabled="working"
          :model="form"
          label-width="90px"
          class="form-wrapper"
        >
          <el-form-item label="Sprint name">
            <el-input class="input" v-model="form.name" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input
              type="textarea"
              class="input"
              :autosize="{ minRows: 3, maxRows: 6 }"
              v-model="form.description"
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
          <el-form-item label="Image">
            <el-upload
              list-type="picture-card"
              class="image-uploader"
              action="#"
              :before-upload="beforeUpload"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="onChange"
              :on-remove="onRemove"
            >
              <img v-if="form.image" :src="form.image" slot="default">
              <i v-else slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img :src="file.url" class="image">
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="onRemove"
                  >
                  <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="Manage materials" name="materials">
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
          <el-table-column>
            <template slot="header">
              <div class="custom-head">
                <span class="name">
                  Material name
                </span>

                <el-input
                  v-model="filter"
                  size="mini"
                  placeholder="Type to search"
                  clearable
                />
              </div>
            </template>

            <template slot-scope="{ row }">
              {{ row.name | truncate(45) }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="Position"
          >
            <template slot-scope="{ row }">
              <el-input
                :disabled="working"
                :min="0"
                :placeholder="0"
                class="position-input"
                size="mini"
                type="number"
                v-model.number="position[row._id]"
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
        v-if="paginated.length > 1 && activeTab === 'materials'"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        class="pagination"
        layout="prev, pager, next"
      />

      <div v-else class="empty">&nbsp;</div>

      <div class="buttons">
        <el-button
          :disabled="working"
          size="mini"
          @click="handleClose"
        >
          Close
        </el-button>
        <el-button
          type="success"
          size="mini"
          :disabled="!changed || working"
          @click="handleSubmit"
        >
          Save
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  chunk, debounce, flatten, isEqual,
} from 'lodash';
import { mapState } from 'vuex';

import { checkAuthor, checkRole } from '@/library';

export default {
  name: 'SprintEditor',

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
      changed: false,
      currentPage: 1,
      file: undefined,
      fileList: [],
      filter: '',
      form: {
        description: this.data.description || '',
        image: this.data.image || '',
        name: this.data.name || '',
        status: this.data.status || 'public',
      },
      pageSize: 6,
      position: {},
      selected: [],
      working: false,
    };
  },

  computed: {
    ...mapState('sprints', ['sprints']),
    ...mapState('materials', ['materials']),

    visibilities() {
      return [
        { value: 'public', label: 'Public' },
        { value: 'draft', label: 'Draft' },
        { value: 'unlisted', label: 'Unlisted' },
      ];
    },

    filteredMaterials() {
      const materials = [...this.materials];

      /* Dont know why, the sort makes selection lost
      const p = { ...this.position };
      materials.sort((a, b) => p[a._id] - p[b._id]); */

      return materials.filter((o) => this.matched(o) && this.canSee(o));
    },

    paginated() {
      return chunk(
        this.filteredMaterials,
        this.pageSize,
      );
    },

    // we need to do total this way to reflect correct total entries
    // after user filtering the results.
    total() {
      return flatten(this.paginated).length;
    },

    tableId() {
      return `sprint-editor-table-${this.currentPage}`;
    },

  },

  created() {
    if (this.data.materials) {
      this.selected = this.data.materials;
    }

    if (this.data.meta) {
      const { position } = this.data.meta;

      if (position) {
        this.position = { ...position };
      }
    }
  },

  mounted() {
    this.$router.push({ query: { id: this.data._id, tab: 'config' } });
    setTimeout(() => this.calculateSelections(), 50);
  },

  destroyed() {
    this.$router.push({ query: {} });
  },

  watch: {
    form: {
      handler: debounce(function () {
        this.changed = true;
      }, 100),
      deep: true,
    },

    filter: {
      handler: debounce(function () {
        if (this.filteredMaterials.length > 0) {
          this.calculateSelections();
        }
      }, 100),
    },

    /* position: {
      handler: debounce(function () {
        setTimeout(() => this.calculateSelections(), 10);
      }, 100),
      deep: true,
    }, */

    currentPage() {
      setTimeout(() => this.calculateSelections(), 10);
    },
  },

  methods: {
    matched(o) {
      return o.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    },

    canEdit(o) {
      const isAdmin = checkRole(this.$auth.user, 'admin');
      const isAuthor = checkAuthor(this.$auth.user, o);
      return isAdmin || isAuthor;
    },

    canSee(o) {
      return o.status === 'public' || this.canEdit(o);
    },

    calculateSelections() {
      this.selected.forEach((s) => {
        const i = this.materials.findIndex((e) => e._id === s._id);
        this.$refs[this.tableId].toggleRowSelection(this.materials[i], 'selected');
      });
    },

    beforeUpload(file) {
      this.file = file;

      const isBig = file.size / 1024 / 1024 < 10;

      if (!isBig) {
        this.$message.error('File size can not exceed 10MB!');
      }

      return isBig;
    },

    onChange(file, fileList) {
      this.file = file;
      this.fileList = fileList;
    },

    onRemove() {
      this.file = null;
      this.fileList = [];
    },

    handleChangeTab({ name }) {
      this.activeTab = name;
      this.$router.push({ query: { id: this.data._id, tab: name } });
    },

    handleSelections(selections) {
      if (!isEqual(this.data.materials, selections)) {
        this.changed = true;
      } else {
        this.changed = false;
      }
      this.selected = selections;
    },

    handleClose() {
      this.changed = false;
      this.$emit('on-close');
    },

    handleSubmit() {
      const data = {
        ...this.form,
        id: this.data._id,
        file: this.file,
        meta: {
          position: this.position,
          version: this.data.meta ? this.data.meta.version : 1,
        },
        materials: this.selected,
      };
      this.$emit('on-save', data);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-wrapper {
  padding-top: 10px;

  .input {
    width: 96%;
  }

  .image {
    width: 150px;
    height: 150px;
  }
}

.custom-head {
  display: flex;
  align-items: center;

  .name {
    min-width: 100px;
    margin-right: 20px;
  }
}

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
