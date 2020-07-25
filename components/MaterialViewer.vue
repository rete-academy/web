<template>
  <el-dialog
    fullscreen
    :visible="visible"
  >
    heheheheh
  </el-dialog>
</template>

<script>
// import consola from 'consola';
// import { mapGetters } from 'vuex';

export default {
  name: 'MaterialView',

  props: {
    material: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>

</style>
