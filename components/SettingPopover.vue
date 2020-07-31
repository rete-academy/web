<template>
  <el-dialog
    class="editor-dialog"
    width="30%"
    :visible="visible"
    title="Edit User"
    @show="calculateRoles"
    @close="handleClose"
  >
    <div class="actions">
      <div class="user-info">
        <img
          :src="profileImage"
          :alt="data.name"
          class="avatar"
        >
        <h2>{{ data.name }}</h2>
      </div>
      <el-radio-group
        v-model="role"
        class="roles-group"
        @change="handleSelection"
      >
        <el-radio
          :label="0"
          :disabled="!isAdmin"
        >
          Admin
        </el-radio>
        <el-radio
          :label="1"
          :disabled="isLower(1)"
        >
          Instructor
        </el-radio>
        <el-radio
          :label="2"
          :disabled="isLower(3)"
        >
          Student
        </el-radio>
      </el-radio-group>
    </div>
    <div class="buttons">
      <el-button
        type="success"
        size="mini"
        :disabled="!changed"
        @click="handleSubmit(data._id)"
      >
        Save
      </el-button>
      <el-button
        size="mini"
        @click="handleClose"
      >
        Close
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SprintPopover',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      role: 2,
      defaultAvatar: 'http://placeimg.com/300/300/people',
      selectedSprints: null,
      changed: false,
      position: {},
    };
  },

  computed: {
    profileImage() {
      const { avatar } = this.data;
      if (avatar && avatar.location && avatar.location.length > 0) {
        return avatar.location;
      }
      return this.defaultAvatar;
    },

    isAdmin() {
      if (this.$auth.user.role.includes(0)) return true;
      return false;
    },
  },

  mounted() {
    this.calculateRoles();
  },

  methods: {
    isLower(role) {
      if (this.$auth.user.role[0] >= role) {
        return true;
      }
      return false;
    },

    calculateRoles() {
      this.role = Math.min(this.data.role);
    },

    handleSelection(selected) {
      this.changed = true;
      this.$emit('selected', selected);
    },

    handleClose() {
      this.changed = false;
      this.$emit('on-close');
    },

    async handleSubmit() {
      this.$emit('on-submit', { id: this.data._id, role: this.role });
    },
  },
};
</script>
<style lang="scss" scoped>
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px auto 30px;

    .user-info {
        margin-top: 0px;
        margin-bottom: 20px;

        .avatar {
            width: 60px;
            height: 60px;
            float: left;
        }

        h2 {
            float: left;
            width: auto;
            margin-left: 10px;
        }
    }
}
</style>
