<template>
  <div v-if="$auth.loggedIn" class="admin wrapper">
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
import { checkRole } from '@/library';

export default {
  name: 'AdminView',

  async asyncData({ store, error }) {
    try {
      const actions = [
        'paths/GET_PATHS',
        'sprints/GET_SPRINTS',
        'materials/GET_MATERIALS',
        'users/GET_USERS',
        'files/GET_FILES',
      ];

      Promise.all(
        actions.map(async (action) => {
          await store.dispatch(action);
        }),
      );
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
        /* {
          index: '/admin/settings',
          icon: 'cog',
          label: 'Settings',
        }, */
      ],
      activeIndex: '/admin/paths',
      materialFormVisible: false,
    };
  },

  watch: {
    '$route.fullPath': function () {
      const { fullPath } = this.$route;
      console.log('### fullPath:', fullPath);
      console.log('### activeIndex:', this.activeIndex);

      if (fullPath === '/admin') {
        this.redirectToCorrectPlace('/admin/paths');
      } else {
        this.redirectToCorrectPlace(fullPath);
      }
    },
  },

  mounted() {
    if (!checkRole(this.$auth.user, 'teacher')) {
      this.redirectToCorrectPlace('/');
    }

    const { fullPath } = this.$route;

    if (fullPath.indexOf('/admin') === 0 && fullPath.length > 6) {
      this.redirectToCorrectPlace(fullPath);
    } else {
      this.redirectToCorrectPlace('/admin/paths');
    }
  },

  methods: {
    redirectToCorrectPlace(path) {
      this.activeIndex = path;
      this.$router.push(path);
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
