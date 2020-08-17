<template>
  <el-card
    class="card-item"
    :body-style="{ padding: '0px' }"
    shadow="hover"
  >
    <div
      class="image-content"
      :style="{ width: width + 'px', height: width + 'px'}"
    >
      <img :src="pathImage" class="image" @error="imageLoadError">
    </div>
    <div
      v-if="!plain"
      style="padding: 15px 10px;"
    >
      <span class="title">{{ path.name }}</span>
      <div class="bottom clearfix">
        <time class="time">
          {{ path.createdTime | convertTime('DD.MM.YYYY') }}
        </time>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CardItem',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    plain: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 300,
    },
  },

  data() {
    return {
      imageError: false,
    };
  },

  computed: {
    path() {
      return { ...this.data };
    },

    pathImage() {
      if (!this.imageError) {
        return this.path.image;
      }
      return '/rete-icon-gray.png';
    },
  },

  // created() {},

  methods: {
    imageLoadError() {
      this.imageError = true;
    },

    go(slug) {
      // consola.info(slug)
      this.$router.push({
        path: `/paths/${slug}`,
        params: { slug },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card-item {
    text-align: center;
    border-radius: 5px;

    .image-content {
        background: #FFF;
        display: flex;
        align-items: center;

        .image {
            width: 100%;
        }
    }

    .title {
        font-size: 16px;
        font-weight: bold;
        color: #222222;
    }

    .time {
        font-size: 80%;
    }
    &:hover {
        cursor: pointer;
    }
}
</style>
