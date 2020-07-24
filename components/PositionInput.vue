<template>
  <el-input
    v-model="position"
    size="mini"
    placeholder="0"
  />
</template>
<script>
// import consola from 'consola'

export default {
  name: 'PositionInput',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {};
  },

  computed: {
    // ...mapState('paths', ['paths']),
    // ...mapState('sprints', ['sprints']),

    position: {
      get() {
        if (this.data.path.meta.position
                    && this.data.path.meta.position[this.data.sprint._id]) {
          return this.data.path.meta.position[this.data.sprint._id];
        }
        return 0;
      },
      set(newValue) {
        // consola.info(newValue)
        this.$emit('position-change', {
          [this.data.sprint._id]: parseInt(newValue, 10),
        });
      },
    },
  },

  methods: {
    updatePosition() {},
  },
};
</script>
<style lang="scss" scoped>
</style>
