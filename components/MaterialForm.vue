<template>
  <el-dialog
    title="Add New Material"
    :modal="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visible"
    width="50%"
    class="custom-dialog"
    @close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="Link">
        <el-autocomplete
          clearable
          class="url-input"
          placeholder="Paste material URL here..."
          v-model="form.url"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          :disabled="working"
          @select="handleSelect"
        >
          <i
            slot="suffix"
            class="el-input__icon"
            :class="working ? 'el-icon-loading' : ''"
          >&nbsp;</i>
        </el-autocomplete>
      </el-form-item>
      <el-form-item v-if="fetched || hasData" label="Title">
        <el-input
          v-model="form.name"
          placeholder="Title"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="fetched || hasData" label="Description">
        <el-input
          v-model="form.description"
          placeholder="Description..."
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
      </el-form-item>
    <el-form-item v-if="fetched || hasData" label="Preview">
      <img :src="form.image" class="material-image">
    </el-form-item>
    <el-form-item label="Sprint">
      <el-select
        v-model="currentSprint"
        placeholder="Select sprint"
        clearable
        filterable
      >
        <el-option
          v-for="sprint in sprints"
          :key="sprint._id"
          :label="sprint.name"
          :value="sprint._id"
        />
      </el-select>
    </el-form-item>

    <div class="controllers">
      <div class="empty">&nbsp;</div>

      <div class="buttons">
        <el-button
          size="mini"
          type="primary"
          :disabled="working || !form.url || !changed"
          :icon="working? 'el-icon-loading' : 'el-icon-refresh'"
          @click="handleRefetch"
        >
          Refetch
        </el-button>
        <el-button
          plain
          size="mini"
          :disabled="working"
          @click="handleClose"
        >
          Close
        </el-button>
        <el-button
          size="mini"
          type="success"
          :disabled="!changed || working"
          @click="onSubmit"
        >
          {{ hasData ? 'Save' : 'Add Material' }}
        </el-button>
      </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import consola from 'consola';
import { mapGetters } from 'vuex';
import { throttle } from 'lodash';

import { isValidUrl } from '@/library';

export default {
  name: 'MaterialForm',

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
      fetched: false,
      changed: false,
      working: false,
      form: {
        description: this.data.description || '',
        image: this.data.image || '',
        name: this.data.name || '',
        url: this.data.url || '',
      },
    };
  },

  computed: {
    ...mapGetters('files', ['files']),
    ...mapGetters('sprints', ['sprints', 'selectedSprint']),

    allFiles() {
      return this.files.map((f) => ({
        value: f.data.originalname.toLowerCase(),
        link: f.data.location,
      }));
    },

    hasData() {
      return Object.keys(this.data).length > 0 && this.data.constructor === Object;
    },

    currentSprint: {
      get() {
        return this.selectedSprint;
      },
      set(newValue) {
        this.$store.commit('sprints/SET_SELECTED_SRPINT', newValue);
      },
    },
  },

  watch: {
    form: {
      handler: throttle(function (obj) {
        const { url } = obj;
        this.changed = true;

        this.handleFetch(url);
      }, 500),
      deep: true,
    },
  },

  created() {
    if (this.sprints.length === 0) {
      this.$store.dispatch('sprints/GET_SPRINTS');
    }
  },

  mounted() {
    if (this.hasData) {
      this.fetched = true;
      this.currentSprint = '';
    }
  },

  methods: {
    querySearch(s, c) {
      c(this.allFiles.filter((f) => f.value.indexOf(s.toLowerCase()) !== -1));
    },

    handleFetch(url) {
      if (url && isValidUrl(url) && !this.fetched) {
        this.working = true;
        this.$nuxt.$loading.start();

        this.$axios.post('https://api.linkpreview.net', {
          q: this.form.url,
          key: '5c6e71509eafb0595e5860fe9c5eaba82fb617087dbc1',
        }).then(({ data }) => {
          if (data) {
            this.fetched = true;
            this.form = {
              url: this.form.url,
              name: data.title,
              description: data.description,
              image: data.image,
            };

            this.$nuxt.$loading.finish();
          }
        }).catch((error) => {
          this.$nuxt.$loading.fail();
          consola.error(error);
        });

        this.working = false;
      }
    },

    handleClose() {
      this.form = {
        url: '',
        name: '',
        description: '',
        image: '',
      };
      this.fetched = false;
      this.$emit('update:visible', false);
    },

    handleSelect(item) {
      this.form = {
        ...this.form,
        name: item.originalname,
        url: item.link,
      };
    },

    handleRefetch() {
      this.fetched = false;
      this.handleFetch(this.form.url);
    },

    onSubmit() {
      this.$emit('on-submit', {
        id: this.data._id,
        description: this.form.description,
        image: this.form.image,
        name: this.form.name,
        url: this.form.url,
        meta: {
          position: this.data.meta ? this.data.meta.position : {},
          version: this.data.meta ? this.data.meta.version : 1,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.url-input {
  width: 100%;
}
.controllers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.material-image {
  height: 150px;
  border: 1px solid #EEEEEE;
  border-radius: 4px;
}
</style>
