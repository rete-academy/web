<template>
  <div class="profile wrapper profile-box">
    <div class="avatar">
      <img
        :src="hasAvatar ? profile.avatar.location : '/rete-icon-gray.png'"
        class="image"
      >
    </div>

    <div class="content">
      <el-row>
        <el-col :span="16">
          <h1 class="big-name">{{ profile.name }}</h1>
        </el-col>
        <el-col :span="8" class="big-button">
          <el-button plain round type="success" @click="handleEdit">
            Edit Profile
          </el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <fa icon="calendar" class="info-icon" />
          Joined {{ joinedDate }}
        </el-col>

        <el-col :span="12">
          <fa icon="envelope" class="info-icon" />
          {{ profile.email }}

          <fa
            v-if="profile.meta.confirm"
            icon="check"
            class="confirmed"
          />

          <span
            class="link"
            @click="resendConfirm"
          >
            Resend confirmation
          </span>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="Edit Profile"
      class="edit-profile-dialog"
      width="40%"
      v-if="editProfileVisible"
      :visible.sync="editProfileVisible"
      :before-close="dialogClose"
    >
      <el-form
        ref="profileForm"
        :model="form"
        label-width="180px"
        label-position="top"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Avatar" class="avatar">
              <el-upload
                class="avatar-uploader"
                list-type="picture"
                :action="uploadEndpoint"
                :auto-upload="false"
                :http-request="submitUpload"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-change="onChange"
              >
                <img :src="profileImage" class="image">
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="Name" class="name">
              <el-input v-model="form.name" :disabled="loading" />
            </el-form-item>
            <el-form-item label="Email" class="email">
              <el-input v-model="form.email" :disabled="loading" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          :disabled="loading"
          @click="handleCancel"
        >
          Cancel
        </el-button>
        <el-button
          size="medium"
          type="success"
          :loading="loading"
          icon="el-icon-check"
          @click="handleSave"
        >
          Save
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import consola from 'consola';
import { mapGetters } from 'vuex';

export default {

  name: 'Profile',

  data() {
    return {
      file: null,
      defaultAvatar: '',
      editProfileVisible: false,
      loading: false,
      form: {
        name: '',
        email: '',
      },
    };
  },

  computed: {
    ...mapGetters('users', ['profile']),

    hasAvatar() {
      if ((this.profile.avatar && this.profile.avatar.location
        && this.profile.avatar.location.length > 0) || this.file) {
        return true;
      }
      return false;
    },

    joinedDate() {
      const d = new Date(parseInt(this.profile.createdTime, 10));
      return `${d.getMonth() + 1}.${d.getFullYear()}`;
    },

    profileImage() {
      if (this.hasAvatar && !this.file) {
        return this.profile.avatar.location;
      } if (this.file) {
        return this.file.url;
      }
      return '/rete-icon-gray.png';
    },

    uploadEndpoint() {
      const baseUrl = this.$axios.defaults.baseURL || 'http://localhost:8000';
      return `${baseUrl}/api/users/${this.profile._id}/avatar`;
    },

    uploadHeaders() {
      return {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: this.$auth.getToken('local'),
      };
    },
  },

  async asyncData({ store }) {
    return store.dispatch('users/FETCH_USER');
    // error({ message: e, statusCode: 404 });
  },

  methods: {
    onChange(file) {
      this.file = file;
    },

    handleEdit() {
      this.form = {
        name: this.profile.name,
        email: this.profile.email,
      };

      this.editProfileVisible = true;
    },

    dialogClose(done) {
      this.file = null;
      done();
    },

    async handleSave() {
      this.$nuxt.$loading.start();
      this.loading = true;

      if (this.file) {
        await this.submitUpload();
      }

      await this.$store.dispatch('users/UPDATE_USER', {
        userId: this.$auth.user._id,
        data: this.form,
      });

      this.editProfileVisible = false;
      this.loading = false;
      this.$nuxt.$loading.finish();
    },

    async submitUpload() {
      try {
        this.$nuxt.$loading.start();
        const formData = new FormData();
        formData.append('avatar', this.file.raw);
        await this.$axios.post(this.uploadEndpoint, formData, {
          headers: this.uploadHeaders,
        });
        await this.$store.dispatch('users/FETCH_USER');
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

    async resendConfirm() {
      try {
        this.$nuxt.$loading.start();
        if (this.$auth.user) {
          await this.$store.dispatch(
            'users/RESEND_CONFIRM',
            this.profile.email,
          );

          // await this.$auth.fetchUser();

          this.$message({
            type: 'success',
            message: 'Confirmation sent successfully!',
            showClose: true,
            duration: 1000,
          });
        }
        this.$nuxt.$loading.finish();
      } catch (e) {
        this.$nuxt.$loading.fail();
        this.$message.error(e.message);
      }
    },

    handleCancel() {
      this.file = null;
      this.editProfileVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  justify-content: space-between;
  margin: 0 auto 50px;

  .big-button {
    text-align: right;
    margin: 1rem 0;
  }

  .big-name {
    font-size: 3rem;
    padding: 0;
    margin: 1rem 0;
    line-height: 100%;
  }

  .avatar {
    width: 200px;
    height: 200px;

    img {
      width: 100%;
      border-radius: 4px;
    }

    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 36px;
      height: 36px;
      padding: 124px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      line-height: 200px;
      text-align: center;
    }

    .image {
      width: 200px;
      display: block;
    }
  }

  .content {
    width: auto;
    margin-left: 20px;
    flex: 1;
    color: #333333;

    .info-icon {
      color: #666666;
      margin-right: 10px;
    }
  }

  .confirmed {
    color: #67C23A;
  }
  .link {
    margin-left: 20px;
  }
}
</style>
