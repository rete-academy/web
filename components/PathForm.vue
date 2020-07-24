<template>
  <el-dialog
    title="Add New Path"
    :modal="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    width="50%"
    class="custom-dialog"
  >
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Path Name">
        <el-input
          clearable
          placeholder="Name"
          :disabled="loading"
          v-model="form.name"
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="Description">
            <el-input
              v-model="form.description"
              placeholder="Description text here..."
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-upload
            list-type="picture-card"
            class="image-uploader"
            :action="uploadEndpoint"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :file-list="fileList"
            :http-request="submitUpload"
            :headers="uploadHeaders"
            :on-change="onChange"
          >
          <i slot="default" class="el-icon-plus" />
          <div v-if="file" slot="file">
            <img :src="file.url" class="image">
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePreview()"
              >
                <i class="el-icon-zoom-in" />
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove()"
              >
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
          </el-upload>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button
          size="small"
          type="success"
          :disabled="taken"
          @click="onSubmit"
        >
          Create Path
        </el-button>
        <el-button
          plain
          size="small"
          @click="handleCancel"
        >
          Cancel
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import consola from 'consola';

export default {
  name: 'PathForm',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {
        name: '',
        description: '',
        image: '',
      },
      file: null,
      fileList: [],
      loading: false,
      taken: false,
      count: 0,
    };
  },

  computed: {
    hasImage() {
      if (this.form.image || this.file) {
        return true;
      }
      return false;
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

  methods: {
    onChange(file, fileList) {
      this.file = file;
      this.fileList = fileList;
    },

    handleCancel() {
      this.form = {
        name: '',
        description: '',
        image: '',
      };
      this.$emit('update:visible', false);
    },

    beforeUpload(file) {
      this.file = file;

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!');
      }

      return isLt2M;
    },

    handleRemove() {
      this.file = null;
      this.fileList = [];
    },

    async onSubmit() {
      consola.info('Begin add new path');

      this.$nuxt.$loading.start();
      if (!this.taken) {
        await this.submitUpload();

        this.$store.dispatch('paths/CREATE_PATH', {
          name: this.form.name,
          description: this.form.description,
          image: this.form.image,
        }).then(() => {
          this.handleCancel();
          this.$nuxt.$loading.finish();
        }).catch((err) => {
          consola.error(err);
        });
      }
    },

    async submitUpload() {
      try {
        this.$nuxt.$loading.start();

        const formData = new FormData();
        formData.append('files', this.file.raw);
        const { data } = await this.$axios.post(this.uploadEndpoint, formData, {
          headers: this.uploadHeaders,
        });

        if (data && data.success) {
          this.form.image = data.message.data.location;
        }

        // await this.$store.dispatch('users/FETCH_USER')
        this.$nuxt.$loading.finish();

        this.$message({
          message: 'Uploaded succesfully!',
          type: 'success',
        });
      } catch (error) {
        consola.error(error.message);
        this.$nuxt.$loading.fail();
        this.$message.error(`Oops, ${error.message}`);
      }
    },

    // Consider to use slugify plugin, fucking stupid Sang
    slugify(str) {
      let localStr;
      localStr = str.replace(/^\s+|\s+$/g, '').toLowerCase(); // trim

      // remove accents, swap ñ for n, etc
      const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
      const to = 'aaaaeeeeiiiioooouuuunc------';

      for (let i = 0, l = from.length; i < l; i++) {
        localStr = localStr.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }

      localStr = localStr
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

      return localStr;
    },

  },
};
</script>

<style lang="scss" scoped>
.image {
    width: 100%;
}
.taken {
    color: red;
}
.free {
    color: green;
}
</style>
