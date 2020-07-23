<template>
  <div class="landing">
    <section class="container intro">
      <h1 class="flash">
        “Khai dân trí, chấn dân khí, hậu dân sinh”
        <small>– Phan Châu Trinh</small>
      </h1>
      <el-button
        type="success"
        class="jumbo-btn"
        @click="goTo('')"
      >
        Chọn Khoá Học
      </el-button>
    </section>

    <section class="container who">
      <div class="featured-paths">
        <card-item
          v-for="path in paths"
          :key="path._id"
          :data="path"
          :width="150"
          class="path item"
          plain
          @click.native="goTo(path.slug)"
        />
      </div>
      <div class="who-we-are">
        <h3 class="title">
          Rete Academy là gì?
        </h3>
        <p class="text">
          Với niềm tin rằng, sự học chính là con đường duy nhất giúp người Việt, dù ở bất kỳ nơi nào trên thế giới, thoát khỏi đói nghèo, lạc hậu, sự ươn hèn và nhút nhát. Rete Academy ra đời với niềm tin đó và sẽ kiên trì đi theo tôn chỉ đó, mong sao cho có thể lan truyền lòng trân quý sự học đến với càng nhiều người càng tốt.
        </p>
      </div>
    </section>

    <section class="container why">
      <div class="third">
        <h3 class="title">
          Tài liệu luôn được cập nhật theo xu hướng
        </h3>
        <p class="text">
          Ngôn ngữ lập trình cũng như công nghệ thay đổi với tốc độ chóng mặt, chúng ta cần phải chuẩn bị cho điều đó ngay trong lúc học. Ở đây, tài liệu luôn được cập nhật từ nhu cầu thực tế từ các công ty, startups hàng đầu.
        </p>
      </div>
      <div class="third">
        <h3 class="title">
          Người có kinh nghiệm thực tiễn dựng giáo án
        </h3>
        <p class="text">
          Bạn có thể học thuộc lòng, nhưng không thể thể hiện sự tự tin thông qua sách vở. Bằng việc học và thực hành từ kinh nghiệm thực tế của người đi trước, bạn biết rõ điều gì chờ đợi mình phía trước.
        </p>
      </div>
      <div class="third">
        <h3 class="title">
          Cơ hội nghề nghiệp với dự án thật
        </h3>
        <p class="text">
          Tốn nhiều tháng liền để làm đồ án tốt nghiệp rồi vứt xó? Ở đây bạn có thể quên điều đó đi. Chúng ta sẽ làm dự án thật, với người thật, việc thật. Cơ hội nghề nghiệp sẽ được khai mở ngay khi bạn chưa tốt nghiệp.
        </p>
      </div>
    </section>
    <section class="container start">
      <div class="half">
        <h2 class="title">
          Bắt đầu ngay hôm nay
        </h2>
        <el-button
          type="success"
          class="jumbo-btn"
          @click="goTo('')"
        >
          Chọn Khoá Học
        </el-button>
      </div>
      <!-- div class="half">
                <h3>Đăng ký nhận tin mới</h3>
                <el-form
                    :inline="true"
                    :model="form"
                    size="mini"
                    class="subscribe-form"
                >
                    <el-form-item>
                        <el-input
                            v-model="form.email"
                            placeholder="Địa chỉ email"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="onSubmit"
                        >
                            Subscribe
                        </el-button>
                    </el-form-item>
                </el-form>
            </div -->
    </section>
  </div>
</template>
<script>
import consola from 'consola';
import { mapGetters } from 'vuex';
import CardItem from '~/components/path/CardItem.vue';

export default {
  name: 'Home',

  layout: 'landing',

  auth: false,

  components: { CardItem },

  data() {
    return {
      doStuff: null,
      form: {
        email: '',
      },
    };
  },

  computed: {
    ...mapGetters('paths', ['paths']),

    featuredPaths() {
      return this.paths.filter((o) => o.featured);
    },
  },

  created() {
    this.doStuff = (arg) => {
      consola.info('Run at ', arg);
    };

    this.doStuff('created');

    if (this.paths.length === 0) this.$store.dispatch('paths/GET_PATHS');
  },

  mounted() {
    this.doStuff('mounted');
  },

  methods: {
    goTo(slug) {
      this.$router.push(`/paths/${slug}`);
    },

    onSubmit() {
    },
  },
};
</script>

<style lang="scss" scoped>
.intro, .who, .why, .start {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px;
}
.text {
    font-size: 16px;
    color: #888;
}
.intro {
    flex-direction: column;
    background: #2f3542;
    min-height: 30vh;

    .flash {
        margin: 0;
        text-align: center;
        color: #f1f2f6;
        margin-bottom: 50px;

        small {
            display: block;
            color: #a4b0be;
            font-size: 0.5em;
        }
    }
}
.who {
    .featured-paths {
        width: 320px;

        .path {
            float: left;
            margin-right: 10px;
            margin-bottom: 10px;

            &:nth-child(2n) {
                margin-right: 0;
            }
        }
    }

    .who-we-are {
        width: 450px;
        margin-left: 50px;

        h3 {
            margin-top: 0;
            font-size: 28px;
        }
    }
}

.why {
    background: #F1F1F1;
    .third {
        width: 22%;
        padding: 20px;
        margin: 20px;
        text-align: center;

        h3 {
            font-size: 28px;
        }
        .text {
            padding: 0 20px;
        }
    }
}

.start {
    .half {
        width: 30%;
        margin: 30px;
        text-align: center;
    }

    h2.title {
        font-size: 36px;
    }

    .subscribe-form {
        width: 100%;
    }
}
</style>
