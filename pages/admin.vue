<template>
  <div class="admin wrapper">
    <el-menu
      mode="horizontal"
      :default-active="activeIndex"
      class="admin-sub-menu"
    >
      <el-menu-item v-for="item in items"
        :key="item.index"
        :index="item.index"
        @click="clickMenuItem"
      >
        <fa :icon="item.icon" />
        <span slot="title">{{ item.label }}</span>
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
      items: [
        {
          index: '/admin/paths',
          icon: 'university',
          label: 'Paths',
        },
        {
          index: '/admin/sprints',
          icon: 'tasks',
          label: 'Sprints',
        },
        {
          index: '/admin/materials',
          icon: 'atlas',
          label: 'Materials',
        },
        {
          index: '/admin/files',
          icon: 'folder',
          label: 'Files',
        },
        {
          index: '/admin/users',
          icon: 'user',
          label: 'Users',
        },
        {
          index: '/admin/settings',
          icon: 'cog',
          label: 'Settings',
        },
      ],
      activeIndex: '/admin/paths',
      materialFormVisible: false,
    };
  },

  watch: {
    activeIndex() {
      if (this.activeIndex === '/admin') {
        this.redirectToCorrectPlace();
      }
    },
  },

  mounted() {
    const { fullPath } = this.$route;

    if (fullPath.indexOf('/admin') === 0 && fullPath.length > 6) {
      this.redirectToCorrectPlace(fullPath);
    } else {
      this.redirectToCorrectPlace();
    }
  },

  methods: {
    redirectToCorrectPlace(path) {
      if (path) {
        this.activeIndex = path;
        this.$router.push(path);
      } else {
        this.$router.push('/admin/paths');
      }
    },

    clickMenuItem(item) {
      if (item.index !== this.activeIndex) {
        this.activeIndex = item.index;
        this.$router.push(item.index);
      }
    },
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
