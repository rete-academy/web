<template>
  <section class="container my-paths items">
    <div
      v-for="path in myPaths"
      :key="path._id"
      class="path-row"
    >
      <h2 :id="path.slug" class="title">
        {{ path.name }}
        <fa icon="cog" class="actions" />
      </h2>
      <div class="progress-wrapper">
        <div class="progress-inner">
          <el-steps
            :space="500"
            :align-center="true"
          >
            <el-step
              v-for="sprint in path.sprints"
              :key="sprint._id"
              :title="sprint.name"
              :description="sprint.description"
              class="sprint"
            />
          </el-steps>

          <div class="sprint-content">
            <div
              v-for="sprint in path.sprints"
              :key="sprint._id"
              class="sprint"
            >
              <div class="materials-list">
                <material-row
                  v-for="material in sprint.materials"
                  :key="material._id"
                  :data="{ path, sprint, material }"
                  @chat-open="handleChat"
                  @click="handleClick"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <chat-box
      v-if="chatVisible"
      :visible="chatVisible"
      :data="currentMaterial"
    />

    <el-dialog
      fullscreen
      class="preview-dialog"
      v-if="previewVisible"
      v-loading.fullscreen.lock="fullscreenLoading"
      :visible.sync="previewVisible"
    >
      <iframe
        class="preview-iframe"
        :src="currentMaterial.url"
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          icon="el-icon-close"
          @click="handleClose"
        >
          Close
        </el-button>
        <el-button
          size="medium"
          icon="el-icon-arrow-left"
          :disabled="!predictMaterials.previous"
          @click="handlePrevious"
        >
          Previous material
        </el-button>
        <el-button
          size="medium"
          type="success"
          :disabled="!predictMaterials.next"
          @click="handleFinishAndMove"
        >
          Finish and Go to next material
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
// import consola from 'consola'
import { mapGetters } from 'vuex';
import { MaterialRow, ChatBox } from '@/components';

export default {
  name: 'MyPaths',

  auth: true,

  components: {
    ChatBox,
    MaterialRow,
  },

  data() {
    return {
      activeStep: 0,
      currentMaterial: {},
      currentPath: {},
      currentSprint: {},
      previewVisible: false,
      fullscreenLoading: false,
    };
  },

  computed: {
    ...mapGetters('paths', ['paths']),
    ...mapGetters('conversations', ['chatVisible', 'currentId']),

    myPaths() {
      if (this.$auth.user && this.$auth.user.enrolled && this.paths) {
        return this.$auth.user.enrolled.map((id) => this.paths.find((p) => p._id === id));
      }
      return [];
    },

    predictMaterials() {
      const predict = {
        previous: undefined,
        next: undefined,
      };

      const { materials } = this.currentSprint;
      const foundIndex = (materials || []).findIndex((m) => m._id === this.currentMaterial._id);
      if (materials && materials[foundIndex - 1]) {
        predict.previous = materials[foundIndex - 1];
      }
      if (materials && materials[foundIndex + 1]) {
        predict.next = materials[foundIndex + 1];
      }
      return predict;
    },
  },

  watch: {
    fullscreenLoading() {
      if (this.fullscreenLoading) {
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1000);
      }
    },
  },

  async asyncData({ store, error }) {
    try {
      // make sure the paths are up to date
      await store.dispatch('paths/GET_PATHS');
    } catch (e) {
      error({ message: e, statusCode: 404 });
    }
  },

  methods: {
    openSinglePath(p) {
      this.$router.push(`/paths/${p.slug}`);
    },

    handleClose() {
      this.previewVisible = false;
    },

    handleClick({ path, sprint, material }) {
      this.fullscreenLoading = true;
      this.previewVisible = true;
      this.currentMaterial = material;
      this.currentPath = path;
      this.currentSprint = sprint;
    },

    handlePrevious() {
      this.fullscreenLoading = true;
      if (this.predictMaterials.previous) {
        this.currentMaterial = this.predictMaterials.previous;
      }
    },

    handleFinishAndMove() {
      this.fullscreenLoading = true;
      if (this.predictMaterials.next) {
        this.currentMaterial = this.predictMaterials.next;
      }
    },

    handleChat(material) {
      this.currentMaterial = material;
      if (material.conversation) {
        this.$store.dispatch('conversations/GET_CONVERSATION', material.conversation);
      } else {
        this.$store.dispatch('conversations/CREATE_CONVERSATION', {
          material: material._id,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
    font-size: 32px;

    .actions {
        font-size: 18px;
        color: #CCC;
    }
}

.progress-wrapper {
    width: auto;
    height: auto;
    margin: 40px auto 80px;
    padding: 20px 10px 10px;
    border-radius: 4px;
    overflow-y: hidden;
    overflow-x: scroll;
    background: #F5F5F5;
}
.el-steps {
    text-align: center;
    margin-left: 10px;
}
.sprint {
    min-width: 500px;
}

.sprint-content {
    display: flex;
}

.materials-list {
    width: 470px;
    padding: 10px;
    border-radius: 4px;
    background: #EEEEEE;

    h4 {
        padding: 10px 0 0 25px;
    }
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
}

.preview-dialog {
  display: flex;

  .preview-iframe {
    border: none;
    width: 100%;
    height: 100%;
  }
}
</style>
