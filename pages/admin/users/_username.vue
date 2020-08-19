<template>
  <div class="single-user">
    <div class="user-content">
      <div class="block">
        <h1>
          {{ name }}
          <small>
            {{ email }}
            <fa
              v-if="meta.confirm"
              icon="check"
              class="confirmed"
            />
          </small></h1>
      </div>
      <div class="progress block">
        <h2>Progress</h2>

        <p v-if="progresses.length === 0">
          You don't start any record yet.
        </p>

        <el-row
          v-for="pro in progresses"
          :key="pro.id"
          :gutter="10"
        >
          <el-col :span="20">
            <h4>{{ pro.name }}</h4>
          </el-col>
          <el-col :span="4">
            <el-progress
              type="circle"
              :width="50"
              :percentage="pro.percentage"
            />
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="user-avatar is-extra-large">
      <img
        :src="userImage"
        class="image"
        @error="imageLoadError"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleUser',

  auth: true,

  // Get the data of the path, the merge into this component's data
  async asyncData({ params, store }) {
    return store.dispatch('users/GET_USER', params.username);
  },

  data() {
    return {
      working: false,
      imageError: false,
    };
  },

  computed: {
    userImage() {
      if (!this.imageError && this.$data.avatar) {
        return this.$data.avatar.location;
      }
      return '/rete-icon-gray.png';
    },

    progresses() {
      if (this.$data.enrolled) {
        return this.$data.enrolled.map((path) => {
          const currentMaterials = path.sprints.reduce((a, sprint) => [
            ...a,
            ...sprint.materials,
          ], []);

          const finished = this.$data.progress.reduce((a, c) => {
            const found = currentMaterials.find((m) => m._id === c._id);

            return found ? a + 1 : a;
          }, 0);

          return {
            id: path._id,
            name: path.name,
            percentage: Math.floor((finished / path.materialTotal) * 100),
          };
        });
      }
      return [];
    },
  },

  methods: {
    handleChange() {},

    imageLoadError() {
      this.imageError = true;
    },

    async handleUser() {
      try {
        this.$nuxt.$loading.start();
        this.working = true;

        /*
        if (this.$auth.user) {
          const ACTION = this.isEnrolled ? 'UNENROLL' : 'ENROLL';

          await this.$store.dispatch(`users/${ACTION}`, {
            userId: this.$auth.user._id,
            data: this.$data._id.toString(),
          });

          await this.$auth.fetchUser();

          this.$message({
            type: 'success',
            message: `${ACTION} successfully!`,
            showClose: true,
            duration: 1000,
          });
        } else {
          this.$router.push({
            name: 'login',
            query: { prevPath: this.$route.fullPath },
          });
        }
        */
        this.$nuxt.$loading.finish();
        this.working = false;
      } catch (e) {
        this.$nuxt.$loading.fail();
        this.$message.error(e.message);
        this.working = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.single-user {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px 0;
  margin-bottom: 50px;

  .user-content {
    min-width: 400px;
    height: auto;

    .project-head {
      color: #FFF;

      .desc {
        color: #FFF;
        font-size: 90%;
        margin-bottom: 10px;
      }
    }

    .block {
      display: block;
      width: 100%;
      clear: both;
    }

    .wide-title {
      float: left;
      display: block;
      width: 100%;
      clear: both;
      color: #EEE;
      border-bottom: 1px solid #CCCCCC50;
    }

    .short-title {
      display: inline-block;
      line-height: 38px;
      margin: 0 10px 0 0;

      &:hover {
        cursor: pointer;
      }
    }

    .sort-icon {
      &:hover {
        cursor: pointer;
      }
    }
  }

  .right {
    float:right;
  }

  .report-btn {
    margin-left: 10px;
    width: 110px;
  }

  .download-link {
    font-size: 90%;
    font-weight: bold;
    color: #FFF;
  }
  .download-button {
    width: 110px;
  }

  .file-name {
    margin: 0;
    font-weight: bold;
  }
  .file-description {
    font-size: 90%;
    margin: 0;
    line-height: 14px;
  }

  .switch-text {
    font-size: 80% !important;
    margin-left: 5px;
  }

  .attachments-buttons {
    display: flex;
    justify-content: flex-end;

    .delete-btn {
      margin-left: 10px;
    }
  }

  .el-table {
    margin-bottom: 35px;
    clear: both;
  }

  h1 {
    font-size: 36px;
    margin: 0;
  }

  h1 small {
    display: block;
    color: #999;
    font-size: 55%;
    font-weight: 200 !important;
  }

  .confirmed {
    color: #67C23A;
  }

  .image {
    width: 100px;
    border-radius: 5px;
  }

  .block {
    width: 100%;
  }
}
</style>
