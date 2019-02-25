<template>
  <section class="container">
    <card-item
      v-for="path in paths"
      :key="path._id"
      :data="path"
      @click.native="openSinglePath(path)"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import CardItem from '~/components/CardItem.vue'

export default {
    auth: false,

    components: {
        CardItem
    },

    computed: {
        ...mapState('paths', ['paths'])
    },

    created() {
        this.$store.dispatch('paths/GET_PATHS')
    },

    methods: {
        openSinglePath(p) {
            this.$router.push(`/paths/${p.slug}`)
        }
    }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
