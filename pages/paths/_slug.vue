<template>
  <div class="name">
    <h1>{{ path.name }} <small>{{ path.description }}</small></h1>
    <el-button type="success">
      Enroll Now
    </el-button>
    <el-collapse v-model="activeItems" @change="handleChange">
      <el-collapse-item
        v-for="sprint in sprints"
        :key="sprint._id"
        :title="sprint.name"
        :name="sprint._id"
      >
        <div>{{ sprint.description }}</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import consola from 'consola'
import { mapState } from 'vuex'

export default {
    layout: 'aside',

    name: 'SinglePath',

    data() {
        return {
            activeItems: []
        }
    },

    computed: {
        ...mapState('paths', ['path']),

        sprints() {
            if (this.path) {
                return this.path.sprints
            }
            return []
        }
    },

    created() {
        this.$store.dispatch('paths/GET_PATH', this.$route.params.slug)
    },

    methods: {
        handleChange() {
            consola.info('change')
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
