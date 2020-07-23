<template>
  <section class="container paths items">
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
              :title="'Sprint: ' + sprint.name"
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <chat-box
      :visible="chatVisible"
      :data="currentMaterial"
    />
  </section>
</template>
<script>
// import consola from 'consola'
import { mapGetters } from 'vuex'
import MaterialRow from '@/components/material/MaterialRow'
import ChatBox from '@/components/material/ChatBox'

export default {
  name: 'MyPaths',

  auth: true,

  components: {
    ChatBox,
    MaterialRow
  },

  data() {
    return {
      activeStep: 0,
      currentMaterial: {}
    }
  },

  computed: {
    ...mapGetters('paths', ['paths']),
    ...mapGetters('conversations', ['chatVisible', 'currentId']),

    myPaths() {
      if (this.$auth.user && this.$auth.user.progress && this.paths) {
        const tempPaths = []
        for (const singleStep of this.$auth.user.progress) {
          const had = tempPaths.includes(singleStep.path)
          const found = this.paths.find(p => p._id === singleStep.path)
          if (found && !had) { tempPaths.push(singleStep.path) }
        }
        return tempPaths.map(id => this.paths.find(p => p._id === id))
        // TODO: Make an easier way to detect current active sprint.
        // const currentSprints = foundPath.sprints.map(e => e._id)
        // consola.info(currentSprints)
        // if (foundPath) return foundPath
      }
      return []
    }
  },

  async asyncData({ params, store, error }) {
    try {
      // make sure the paths are up to date
      await store.dispatch('paths/GET_PATHS')
    } catch (e) {
      error({ message: e, statusCode: 404 })
    }
  },

  methods: {
    openSinglePath(p) {
      this.$router.push(`/paths/${p.slug}`)
    },

    handleChat(material) {
      this.currentMaterial = material
      if (material.conversation) {
        this.$store.dispatch('conversations/GET_CONVERSATION', material.conversation)
      } else {
        this.$store.dispatch('conversations/CREATE_CONVERSATION', {
          material: material._id
        })
      }
    }
  }
}
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
</style>
