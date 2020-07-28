<template>
  <div class="admin wrapper">
    <el-menu
      router
      class="admin-sub-menu"
      mode="horizontal"
      :default-active="activeIndex"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="/admin/paths">
        <fa icon="university" />
        <span slot="title">Paths</span>
      </el-menu-item>
      <el-menu-item index="/admin/sprints">
        <fa icon="tasks" />
        <span slot="title">Sprints</span>
      </el-menu-item>
      <el-menu-item index="/admin/materials">
        <fa icon="atlas" />
        <span slot="title">Materials</span>
      </el-menu-item>
      <el-menu-item index="/admin/files">
        <fa icon="folder" />
        <span slot="title">Files</span>
      </el-menu-item>
      <el-menu-item index="/admin/users">
        <fa icon="user" />
        <span slot="title">Users</span>
      </el-menu-item>
      <el-menu-item index="/admin/settings">
        <fa icon="cog" />
        <span slot="title">Settings</span>
      </el-menu-item>
    </el-menu>

    <nuxt-child class="main-content" />
  </div>
</template>

<script>
export default {
  name: 'AdminView',

  async asyncData({ store, error }) {
    try {
      if (store.getters['paths/paths'].length === 0) {
        await store.dispatch('paths/GET_PATHS');
      }
      if (store.getters['sprints/sprints'].length === 0) {
        await store.dispatch('sprints/GET_SPRINTS');
      }
      if (store.getters['materials/materials'].length === 0) {
        await store.dispatch('materials/GET_MATERIALS');
      }
      if (store.getters['users/users'].length === 0) {
        await store.dispatch('users/GET_USERS');
      }
      if (store.getters['files/files'].length === 0) {
        await store.dispatch('files/GET_FILES');
      }
    } catch (e) {
      error({ message: e, statusCode: 404 });
    }
  },

  data() {
    return {
      materialFormVisible: false,
    };
  },

  computed: {
    activeIndex() {
      return this.$route.fullPath;
    },
  },

  watch: {
    activeIndex() {
      if (this.activeIndex === '/admin') {
        this.redirectToDefault();
      }
    },
  },

  mounted() {
    this.redirectToDefault();
  },

  methods: {
    redirectToDefault() {
      this.$router.push('/admin/paths');
    },

    handleClose() {},

    handleOpen() {},
  },
};
</script>
<style lang="scss" scoped>
.main-content {
    width: 100%;
}
.el-menu-item {
    font-size: 14px;

    span {
        margin-left: 10px;
    }
}
</style>
