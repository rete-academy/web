<template>
  <div class="profile wrapper">
    <div class="avatar">
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
        <img
          v-if="hasAvatar"
          :src="profileImage"
          class="avatar"
        >
        <fa
          v-else
          icon="upload"
          class="avatar-uploader-icon"
        />
      </el-upload>
    </div>
    <div class="content">
      <h1>Hi, {{ profile.name }}</h1>
      <el-form
        ref="profileForm"
        :model="profile"
        label-width="180px"
        label-position="top"
      >
        <el-form-item label="Email" class="email">
          <el-row :gutter="5">
            <el-col :span="18">
              <el-input v-model="profile.email" />
            </el-col>
            <el-col :span="6">
              <el-button
                v-if="!profile.meta.confirm"
                type="text"
                @click="resendConfirm"
              >
                Resend Confirmation
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="updateProfile"
          >
            Update Profile
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import consola from 'consola'
import { mapGetters } from 'vuex'

export default {

  name: 'Profile',

  data() {
    return {
      file: null,
      defaultAvatar: ''
    }
  },

  computed: {
    ...mapGetters('users', ['profile']),

    hasAvatar() {
      if ((this.profile.avatar && this.profile.avatar.location &&
                this.profile.avatar.location.length > 0) || this.file) {
        return true
      }
      return false
    },

    profileImage() {
      if (this.hasAvatar && !this.file) {
        return this.profile.avatar.location
      } if (this.file) {
        return this.file.url
      }
      return ''
    },

    uploadEndpoint() {
      const baseUrl = this.$axios.defaults.baseURL || 'http://localhost:8000'
      return `${baseUrl}/api/users/${this.profile._id}/avatar`
    },

    uploadHeaders() {
      return {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: this.$auth.getToken('local')
      }
    }
  },

  async asyncData({ store, error }) {
    try {
      return await store.dispatch('users/FETCH_USER')
    } catch (e) {
      error({ message: e, statusCode: 404 })
    }
  },

  methods: {
    onChange(file) {
      this.file = file
    },

    async updateProfile() {
      if (this.file) {
        await this.submitUpload()
      }
    },

    async submitUpload() {
      try {
        this.$nuxt.$loading.start()
        const formData = new FormData()
        formData.append('avatar', this.file.raw)
        await this.$axios.post(this.uploadEndpoint, formData, {
          headers: this.uploadHeaders
        })
        await this.$store.dispatch('users/FETCH_USER')
        this.$nuxt.$loading.finish()
        this.$message({
          message: 'Uploaded succesfully!',
          type: 'success'
        })
      } catch (error) {
        consola.error(error.message)
        this.$nuxt.$loading.fail()
        this.$message.error(`Oops, ${error.message}`)
      }
    },

    async resendConfirm() {
      try {
        this.$nuxt.$loading.start()
        if (this.$auth.user) {
          await this.$store.dispatch(
            'users/RESEND_CONFIRM',
            this.profile.email
          )
          await this.$auth.fetchUser()
          this.$message({
            type: 'success',
            message: 'Confirmation sent successfully!',
            showClose: true,
            duration: 1000
          })
        }
        this.$nuxt.$loading.finish()
      } catch (e) {
        this.$nuxt.$loading.fail()
        this.$message.error(e.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
    display: flex;
    justify-content: space-between;
    margin: 0 auto 50px;

    .avatar {
        width: 300px;
        height: 300px;

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
            line-height: 298px;
            text-align: center;
          }
          .avatar {
            width: 298px;
            height: 298px;
            display: block;
          }
    }

    .content {
        width: auto;
        margin-left: 20px;
        flex: 1;
    }
}
</style>
