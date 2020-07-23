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
      <img :src="path.image" class="image">
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
import consola from 'consola';

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
    };
  },

  computed: {
    path() {
      return { ...this.data };
    },
  },

  created() {
    consola.info(this.plain);
  },

  methods: {
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
