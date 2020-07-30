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
          <el-form-item label="Path name">
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
          @click="handleSubmit(data._id)"
        >
          Save
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  chunk,
  debounce,
  flatten,
  isEqual,
} from 'lodash';
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
      changed: false,
      currentPage: 1,
      file: undefined,
      fileList: [],
      filter: '',
      form: {
        description: this.data.description,
        image: this.data.image || '',
        name: this.data.name,
        status: this.data.status,
      },
      pageSize: 6,
      position: {},
      selectedSprints: [],
      working: false,
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

    // we need to do total this way to reflect correct total entries
    // after user filtering the results.
    total() {
      return flatten(this.paginated).length;
    },

    tableId() {
      return `path-editor-table-${this.currentPage}`;
    },

  },

  created() {
    if (this.data.sprints) {
      this.selectedSprints = this.data.sprints;
    }

    if (this.data.meta) {
      this.position = this.convertPositions(this.data.meta.position);
    }
  },

  mounted() {
    this.$router.push({ query: { id: this.data._id, tab: 'config' } });
    setTimeout(() => this.calculateSelections(), 10);

    if (this.$route.query.id !== 'new') {
      // this.file = { url: this.data.image };
    }
  },

  destroyed() {
    this.$router.push({ query: {} });
  },

  watch: {
    form: {
      handler: debounce(function (obj) {
        const newForm = {
          description: this.data.description,
          image: this.data.image,
          name: this.data.name,
          status: this.data.status,
        };
        if (!isEqual(obj, newForm)) {
          this.changed = true;
        } else {
          this.changed = false;
        }
      }, 100),
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
      return Object.keys(pos).reduce((a, c) => ({
        ...a,
        [c]: pos[c] ? parseInt(pos[c], 10) : 0,
      }), {});
    },

    calculateSelections() {
      this.selectedSprints.forEach((s) => {
        const i = this.sprints.findIndex((e) => e._id === s._id);
        this.$refs[this.tableId].toggleRowSelection(this.sprints[i], 'selected');
      });
    },

    beforeUpload(file) {
      this.file = file;

      const isLt2M = file.size / 1024 / 1024 < 20;

      if (!isLt2M) {
        this.$message.error('File size can not exceed 20MB!');
      }

      return isLt2M;
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
      if (!isEqual(this.data.sprints, selections)) {
        this.changed = true;
      } else {
        this.changed = false;
      }
      this.selectedSprints = selections;
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
        meta: { position: this.position },
        sprints: this.selectedSprints,
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
