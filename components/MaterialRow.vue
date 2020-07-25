<template>
  <div class="material-row">
    <el-checkbox
      :key="stepId"
      :value="isChecked"
      @change="updateProgress"
    >
      {{ data.material.name | truncate(40) }}
    </el-checkbox>
    <div class="tools">
      <span v-if="isNew" class="new">
        New!
      </span>

      <fa
        icon="eye"
        class="preview button"
        @click="handleClick(data)"
      />

      <a :href="data.material.url" class="button" target="_blank">
        <fa icon="external-link-alt" />
      </a>
    </div>
  </div>
</template>
<script>
import consola from 'consola';
import { mapGetters } from 'vuex';

export default {
  name: 'MaterialRow',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      // clickCheckbox: false,
    };
  },

  computed: {
    ...mapGetters('conversations', ['chatVisible', 'currentId']),

    isChecked() {
      const { material } = this.data;
      return !!this.$auth.user.progress.find((id) => id === material._id);
    },

    stepId() {
      const found = this.$auth.user.progress
        .find((o) => o.material === this.data.material._id
                    && o.sprint === this.data.sprint._id
                    && o.path === this.data.path._id);
      if (found) return found._id;
      return '';
    },

    isNew() {
      const { material } = this.data;
      const updatedTime = (new Date(material.updatedTime)).getTime();
      return Date.now() - updatedTime < 60480000;
    },
  },

  methods: {

    handleClick(data) {
      this.$emit('click', data);
    },

    async updateProgress(status) {
      this.$nuxt.$loading.start();
      const DIRECTION = status ? 'INCREASE' : 'DECREASE';

      await this.$store.dispatch(`users/${DIRECTION}_PROGRESS`, {
        userId: this.$auth.user._id,
        data: this.data.material._id,
      }).then(() => {
        this.$auth.fetchUser();
        this.$nuxt.$loading.finish();
        this.clickCheckbox = false;
      }).catch((e) => {
        this.$nuxt.$loading.fail();
        consola.error(e.message);
        this.$message.error(e.message);
      });
    },

    openChat(id) {
      this.$emit('chat-open', this.data.material);
      this.$store.commit('conversations/SET_VISIBLE', {
        visible: true,
        material: id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.material-row {
  display: flex;
  justify-content: space-between;

  // &:hover { cursor: pointer; }

  &.selected {
    background: #EEEEEE;
  }

  a, .link, .new, .preview {
    font-size: 12px;
    line-height: 100%;
    margin-right: 10px;
  }

  padding: 10px;
  margin-bottom: 1px;
  border: 1px solid #EEEEEE;
  background: #FFF;
  border-radius: 4px;

  .tools {
    .button {
      color: #F9A825;

      &:hover {
        cursor: pointer;
      }
    }

    .new {
      color: #8BC34A;
    }
  }
}
</style>
