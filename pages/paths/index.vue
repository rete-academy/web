<template>
  <section v-if="$auth.loggedIn" class="container paths items">
    <card-item
      v-for="path in paths"
      :key="path._id"
      :data="path"
      class="path item"
      @click.native="openSinglePath(path)"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { CardItem } from '@/components';

export default {
  name: 'Home',

  auth: false,

  components: { CardItem },

  computed: {
    ...mapGetters('paths', ['paths']),
  },

  created() {
    if (this.$auth.loggedIn) {
      if (this.paths.length === 0) {
        this.$store.dispatch('paths/GET_PATHS');
      }
    } else {
      this.$router.push('/login');
    }
  },

  methods: {
    openSinglePath(path) {
      this.$router.push(`/paths/${path.slug}`);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
