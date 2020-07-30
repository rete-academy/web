<template>
  <el-upload
    class="image-uploader"
    list-type="picture"
    :action="uploadEndpoint"
    :auto-upload="true"
    :http-request="submitUpload"
    :headers="uploadHeaders"
    :show-file-list="false"
    :on-change="onChange"
  >
    <img
      v-if="hasImage"
      :src="form.image"
      class="image"
    >
    <fa
      v-else
      icon="upload"
      class="avatar-uploader-icon"
    />
  </el-upload>
</template>

<script>
import consola from 'consola';

export default {
  name: 'FileUpload',

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
      loading: false,
      taken: false,
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
      const baseUrl = this.$axios.defaults.baseURL || 'http://localhost:8000';
      return `${baseUrl}/api/path/avatar`;
    },

    uploadHeaders() {
      return {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: this.$auth.getToken('local'),
      };
    },
  },

  methods: {
    onChange(file) {
      this.file = file;
    },

    handleClose() {
      this.form = {
        name: '',
        description: '',
        image: 'http://www.markweb.in/primehouseware/images/noimage.png',
      };
      this.$emit('update:visible', false);
    },

    onSubmit() {
      consola.info('Begin add new path');
      this.$nuxt.$loading.start();
      if (!this.taken) {
        this.$store.dispatch('paths/CREATE_PATH', {
          name: this.form.name,
          description: this.form.description,
        }).then(() => {
          this.handleClose();
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
        formData.append('image', this.file.raw);
        await this.$axios.post(this.uploadEndpoint, formData, {
          headers: this.uploadHeaders,
        });
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
