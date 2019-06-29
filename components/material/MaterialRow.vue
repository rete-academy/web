<template>
  <div class="material-row">
    <el-checkbox
      :key="stepId"
      :value="isChecked"
      :disabled="isNew"
      @change="updateStatus"
    >
      {{ data.material.name | truncate(40) }}
    </el-checkbox>
    <div class="tools">
      <span v-if="isNew" class="new">
        New!
      </span>
      <fa
        v-if="isNew"
        icon="download"
        class="copy link"
        @click="copy"
      />
      <fa
        icon="comment-alt"
        class="comment link"
        :class="currentId === data.material._id ? 'open' : ''"
        @click="openChat(data.material._id)"
      />
      <a :href="data.material.url" target="_blank">
        <fa icon="external-link-alt" />
      </a>
    </div>
  </div>
</template>

<script>
import consola from 'consola'
import { mapGetters } from 'vuex'

export default {
  name: 'MaterialRow',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {}
  },

  computed: {
    ...mapGetters('conversations', ['chatVisible', 'currentId']),

    isChecked() {
      const found = this.$auth.user.progress
        .find(o => o.material === this.data.material._id &&
                    o.sprint === this.data.sprint._id &&
                    o.path === this.data.path._id)
      if (found) return !!found.status
      return false
    },

    stepId() {
      const found = this.$auth.user.progress
        .find(o => o.material === this.data.material._id &&
                    o.sprint === this.data.sprint._id &&
                    o.path === this.data.path._id)
      if (found) return found._id
      return ''
    },

    isNew() {
      const found = this.$auth.user.progress
        .find(o => o.material === this.data.material._id &&
                    o.sprint === this.data.sprint._id &&
                    o.path === this.data.path._id)
      if (found) return false
      return true
    }
  },

  methods: {
    updateStatus(status) {
      this.$nuxt.$loading.start()
      this.$store.dispatch('users/UPDATE_STATUS', {
        userId: this.$auth.user._id,
        data: {
          id: this.stepId,
          status: status ? 1 : 0
        }
      }).then(() => {
        this.$auth.fetchUser()
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        this.$nuxt.$loading.fail()
        consola.error(e.message)
        this.$message.error(e.message)
      })
    },

    copy() {
      this.$nuxt.$loading.start()
      this.$store.dispatch('users/UPDATE_PROGRESS', {
        userId: this.$auth.user._id,
        data: {
          path: this.data.path._id,
          sprint: this.data.sprint._id,
          material: this.data.material._id,
          status: 0
        }
      }).then(() => {
        this.$auth.fetchUser()
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        this.$nuxt.$loading.fail()
        consola.error(e.message)
        this.$message.error(e.message)
      })
    },

    openChat(id) {
      this.$emit('chat-open', this.data.material)
      this.$store.commit('conversations/SET_VISIBLE', {
        visible: true,
        material: id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.material-row {
    display: flex;
    justify-content: space-between;

    a, .link, .new {
        font-size: 12px;
    }

    padding: 10px;
    margin-bottom: 1px;
    border: 1px solid #EEEEEE;
    background: #FFF;
    border-radius: 4px;

    .tools {
        .new, .copy {
            color: #8BC34A;
        }
        .copy, .comment {
            margin-right: 10px;
        }

        .open {
            color: #8BC34A;
        }
    }
}
</style>
