<template>
  <div class="main-content">
    <div class="title-buttons">
      <h2>Manage Users</h2>
    </div>
    <el-table
      v-loading="loading"
      :data="users"
      class="user-table"
      width="100%"
      border
    >
      <el-table-column
        label="Name"
        width="320"
      >
        <template slot-scope="{ row }">
          <p class="material-name">
            <span class="icon">
              <fa
                :icon="userIcon(row)"
                class="user-role"
              />
            </span>
            <span class="name link" @click="handleClickUser(row)">
              {{ row.name }}
            </span>
          </p>
          <p class="small">
            Joined: {{ row.createdTime | convertTime('HH:mm DD.MM.YYYY') }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Progress">
        <template slot-scope="{ row }">
          {{ row.progress.length }}
        </template>
      </el-table-column>
      <el-table-column label="Info">
        <template slot-scope="{ row }">
          <span class="email">
            {{ row.email }}
            <fa
              v-if="row.meta.confirm"
              icon="check"
              class="confirmed"
            />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Actions"
        width="250"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="isAdmin"
            @click="handleEditUser(row)"
            icon="el-icon-setting"
            size="mini"
            plain
          />
          <el-button
            v-if="isAdmin"
            @click="handleDelete(row._id)"
            icon="el-icon-delete"
            size="mini"
            type="danger"
            plain
          />
        </template>
      </el-table-column>
    </el-table>

    <setting-popover
      v-if="currentUser"
      :data="currentUser"
      :visible="editorVisible"
      @on-close="handleClose"
      @on-submit="handleSubmit"
    />
  </div>
</template>

<script>
import consola from 'consola';
import { mapGetters } from 'vuex';
import { SettingPopover } from '@/components';

import { checkRole } from '@/library';

export default {
  name: 'AdminUsers',

  components: { SettingPopover },

  data() {
    return {
      selectedUsers: null,
      currentUser: undefined,
      changed: false,
      loading: false,
      editorVisible: false,
    };
  },

  computed: {
    ...mapGetters('users', ['users']),

    isAdmin() {
      return checkRole(this.$auth.user, 'admin');
    },
  },

  created() {},

  methods: {
    userIcon(o) {
      if (checkRole(o, 'admin')) {
        return 'user-shield';
      }
      if (o.meta.confirm) {
        return 'user-check';
      }
      return 'user';
    },

    handleMaterialDialog() {
      this.materialFormVisible = !this.materialFormVisible;
    },

    handleSelected(selected) {
      this.changed = true;
      consola.info(selected);
    },

    async handleSubmit({ id, role }) {
      try {
        this.$nuxt.$loading.start();
        await this.$store.dispatch('users/UPDATE_USER', {
          userId: id,
          data: { role: [role] },
        });
        this.$nuxt.$loading.finish();
      } catch (error) {
        this.$nuxt.$loading.fail();
        consola.info(error.message);
      }
      this.editorVisible = false;
    },

    handleEditUser(user) {
      this.currentUser = user;
      this.editorVisible = true;
    },

    handleClose() {
      this.currentUser = undefined;
      this.editorVisible = false;
    },

    handleClickUser(user) {
      this.$router.push(`/admin/users/${user.username}`);
    },

    handleDelete(id) {
      try {
        this.$confirm(
          'This will permanently delete this material. Continue?',
          'Warning',
          {
            confirmButtonText: 'OK, Delete',
            confirmButtonClass: 'el-button--danger',
            cancelButtonText: 'Cancel',
            type: 'warning',
            center: true,
          },
        ).then(async () => {
          this.loading = true;
          this.$nuxt.$loading.start();
          await this.$store.dispatch('materials/DELETE_MATERIAL', id);
          this.$message({
            type: 'success',
            message: 'Delete completed',
            showClose: true,
            duration: 1000,
          });
          this.loading = false;
          this.$nuxt.$loading.finish();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
            showClose: true,
            duration: 1000,
          });
        });
      } catch (e) {
        this.$nuxt.$loading.fail();
        consola.error(e.message);
        this.$message.error(e.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.paths-table {
    margin-bottom: 20px;
    width: 100%;
}
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.manage-popover {
    min-width: 160px;
}
.confirmed {
  color: #67C23A;
}

.user-role {
    width: 18px;
}
</style>
