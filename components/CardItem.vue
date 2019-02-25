<template>
  <el-card
    class="card-item"
    :body-style="{ padding: '0px' }"
    shadow="hover"
  >
    <div class="image-content">
      <img src="https://datamartsolutions.com/wp-content/uploads/2018/08/Full-time-hiring-8.2015-09-e1440676083937.png" class="image">
    </div>
    <div style="padding: 15px 10px;">
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
import consola from 'consola'

export default {
    name: 'CardItem',

    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
        }
    },

    computed: {
        path() {
            return { ...this.data }
        }
    },

    methods: {
        go(slug) {
            consola.info(slug)
            this.$router.push({
                path: `/paths/${slug}`,
                params: { slug: slug }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.card-item {
    text-align: center;
    max-width: 300px;
    max-height: 366px;
    border-radius: 5px;

    .image-content {
        background: #FFF;
        width: 300px;
        height: 300px;
        display: flex;
        align-items: center;

        .image {
            width: 100%;
        }
    }

    .title {
        font-size: 16px;
        font-weight: bold;
    }

    .time {
        font-size: 80%;
    }
    &:hover {
        cursor: pointer;
    }
}
</style>
