<template>
  <div class="main-content">
    <div class="title-buttons">
      <div class="left">
        <h2>Manage Files</h2>
        <el-button
          v-if="selectedFileIds.length > 0"
          plain
          size="mini"
          icon="el-icon-delete"
          type="danger"
          @click="deleteFiles(selectedFileIds)"
        />
      </div>
      <el-upload
        class="avatar-uploader"
        list-type="picture"
        :action="uploadEndpoint"
        :auto-upload="true"
        :http-request="submitUpload"
        :headers="uploadHeaders"
        :show-file-list="false"
        :on-change="onChange"
      >
        <el-button
          type="success"
          :disabled="loading"
          :icon="loading ? 'el-icon-loading' : 'el-icon-upload'"
          class="create-new-btn right"
        >
          Upload New File
        </el-button>
      </el-upload>
    </div>

    <el-table
      :data="paginatedFiles[currentPage - 1]"
      class="file-table"
      width="100%"
      border
      @selection-change="selectionChange"
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
          <p class="file-name">
            <span class="icon">
              <fa
                :icon="detectIcon(scope.row.data.originalname)"
                class="file-icon"
              />
            </span>
            <span class="name">
              <a
                :href="scope.row.data.location"
                target="_blank"
              >
                {{ scope.row.data.originalname }}
              </a>
            </span>
          </p>
          <p class="small">
            Size: {{ scope.row.data.size | convertByte() }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Author">
        <template slot-scope="{ row }">
          <span
            class="author-name"
            v-for="author in row.authors"
            :key="author._id"
          >
            {{ author.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Created">
        <template slot-scope="scope">
          {{ scope.row.createdTime | convertTime('HH:mm DD.MM.YYYY') }}
        </template>
      </el-table-column>
      <el-table-column
        label="Preview"
        width="80"
      >
        <template slot-scope="{ row }">
          <img
            v-if="isImage(row.data.originalname)"
            :src="row.data.location"
            class="preview"
          >
          <fa
            v-else
            :icon="detectIcon(row.data.originalname)"
            class="preview"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Actions"
        width="250"
      >
        <template slot-scope="{ row }">
          <el-button
            plain
            size="mini"
            icon="el-icon-document"
            @click="copyText(row._id)"
          />
          <el-button
            plain
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="deleteFiles([row._id])"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="paginatedFiles.length > 1"
      background
      class="pagination"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
    />
  </div>
</template>
<script>
import consola from 'consola';
import { mapGetters } from 'vuex';
import { chunk, flatten } from 'lodash';

import { checkAuthor, checkRole } from '@/library';

export default {
  name: 'AdminFiles',

  data() {
    return {
      file: null,
      selectedUsers: null,
      selectedFileIds: [],
      changed: false,
      loading: false,
      selection: 'name',
      currentPage: 1,
      pageSize: 7,
      filter: '',
      userFormVisible: false,
    };
  },

  computed: {
    ...mapGetters('users', ['users']),
    ...mapGetters('files', ['files']),

    paginatedFiles() {
      return chunk(
        this.files.filter((o) => this.matched(o) && this.canSee(o)),
        this.pageSize,
      );
    },

    total() {
      // we need to do total this way to reflect correct total entries
      // after user filtering the results.
      return flatten(this.paginatedFiles).length;
    },

    uploadEndpoint() {
      return `${this.$axios.defaults.baseURL}/api/files/upload`;
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
  },

  created() {
    const { page } = this.$route.query;
    if (page && page < this.paginatedFiles.length) {
      this.currentPage = parseInt(page, 10);
    } else {
      this.$router.push({ query: {} });
    }
  },

  methods: {
    matched({ data: { originalname: name } }) {
      return name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    },

    canEdit(p) {
      return checkRole(this.$auth.user, 'admin') || checkAuthor(this.$auth.user, p);
    },

    canSee(p) {
      return p.status === 'public' || this.canEdit(p);
    },

    selectionChange(selection) {
      this.selectedFileIds = selection.map((o) => o._id);
    },

    selectText(id) {
      this.$refs[id].select();
    },

    isAdmin(user) {
      if (user && user.role) {
        if (user.role.reduce((i, j) => i * j) === 0) return true;
        return false;
      }
      return false;
    },

    onChange(file) {
      this.file = file;
    },

    handleCommand(command) {
      switch (command) {
        case 'delete':
          this.deleteFiles(this.selectedFileIds);
          break;
        default:
          break;
      }
    },

    copyText(id) {
      this.$copyText(this.$refs[id].value);
      this.$refs[id].select();
      this.$notify({
        duration: 1200,
        message: 'File URL copied successfully',
        type: 'success',
      });
    },

    async submitUpload() {
      try {
        this.loading = true;
        this.$nuxt.$loading.start();
        const formData = new FormData();
        formData.append('files', this.file.raw);
        await this.$axios.post(this.uploadEndpoint, formData, {
          headers: this.uploadHeaders,
        });
        await this.$store.dispatch('files/GET_FILES');
        this.loading = false;
        this.$nuxt.$loading.finish();
        this.$message({
          message: 'Uploaded succesfully!',
          type: 'success',
        });
      } catch (error) {
        consola.error(error.message);
        this.$nuxt.$loading.fail();
        this.loading = false;
        this.$message.error(`Oops, ${error.message}`);
      }
    },

    deleteFiles(ids) {
      try {
        this.$confirm(
          'This will permanently delete thess files. Continue?',
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
          await this.$store.dispatch('files/DELETE_FILES', ids);
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

    detectIcon(file) {
      const fileName = file.split('.');

      switch (fileName[fileName.length - 1]) {
        case 'png':
        case 'jpg':
        case 'gif':
        case 'svg':
        case 'jpeg':
          return 'file-image';
        case 'pdf':
          return 'file-pdf';
        case 'txt':
        case 'log':
          return 'file-alt';
        case 'json':
          return 'file';
        case 'mov':
        case 'webm':
        case 'mp4':
        case 'avi':
          return 'file-video';
        case 'doc':
        case 'docx':
          return 'file-word';
        case 'xls':
        case 'xlsx':
          return 'file-excel';
        case 'ppt':
        case 'pptx':
          return 'file-powerpoint';
        case 'zip':
        case 'rar':
        case '7z':
          return 'file-archive';
        default:
          return 'file';
      }
    },

    isImage(file) {
      const fileName = file.split('.');

      switch (fileName[fileName.length - 1]) {
        case 'png':
        case 'svg':
        case 'jpg':
        case 'gif':
        case 'jpeg':
          return true;
        default:
          return false;
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
h2 {
    display: inline-block;
}
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.manage-popover {
    min-width: 160px;
}
.file-name {
  .name {
    font-weight: bold;
    font-size: 0.9rem;
  }
}
.success {
  color: green;
}
.preview {
    float: left;
    max-width: 30px;
    max-height: 30px;
    color: #CCC;
}
.file-icon {
    color: #999;
}
</style>
