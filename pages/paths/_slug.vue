<template>
    <div class="single-path">
        <div class="path-content">
            <div class="block">
                <h1>{{ name }} <small>{{ description }}</small></h1>
                <el-button
                    :type="isEnrolled ? 'danger':'success'"
                    @click="handleEnroll"
                >
                    {{ isEnrolled ? 'Unenroll':'Enroll Now' }}
                </el-button>
                <el-button
                    v-if="isEnrolled"
                    type="success"
                    icon="el-icon-arrow-right"
                    @click="$router.push('/paths#' + $route.params.slug)"
                >
                    Go to path
                </el-button>
            </div>
            <div class="sprints block">
                <el-row :gutter="10">
                    <el-col :span="16">
                        <h2>Sprints</h2>
                    </el-col>
                    <el-col :span="8">
                        <h5>Materials: {{ totalMaterials }}</h5>
                    </el-col>
                </el-row>

                <el-collapse
                    v-model="activeItems"
                    class="sprints-list"
                    @change="handleChange"
                >
                    <el-collapse-item
                        v-for="sprint in sprints"
                        :key="sprint._id"
                        :title="sprint.name"
                        :name="sprint._id"
                    >
                        <el-row
                            v-for="m in sprint.materials"
                            :key="m._id"
                            :gutter="10"
                        >
                            <el-col :span="16">
                                <p class="material-name">
                                    <span class="icon">
                                        <fa :icon="m.icon" />
                                    </span>
                                    <span class="name">
                                        {{ m.name }}
                                        <!-- a :href="m.url" target="_blank">
                                            {{ m.name }}
                                        </a -->
                                    </span>
                                </p>
                            </el-col>
                            <el-col :span="8">
                                <p>{{ m.createdDate }}</p>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <div class="path-image is-extra-large">
            <img :src="image || 'http://placeimg.com/600/600/tech'" class="image">
        </div>
    </div>
</template>

<script>
// import consola from 'consola'
// import { mapState } from 'vuex'

export default {

    name: 'SinglePath',

    auth: false,

    data() {
        return {
            activeItems: []
        }
    },

    computed: {
        totalMaterials() {
            let sum = 0
            if (this.sprints && this.sprints.length > 0) {
                this.sprints.forEach((s) => {
                    // consola.info(s.materials)
                    sum += s.materials.length
                })
                return sum
            }
            return 0
        },

        isEnrolled() {
            if (this.$auth.user && this.$auth.user.progress) {
                return !!this.$auth.user.progress.find(o => o.path === this.$data._id)
            }
            return false
        }
    },

    async asyncData({ params, store, error }) {
        try {
            return await store.dispatch('paths/GET_PATH', params.slug)
        } catch (e) {
            error({ message: e, statusCode: 404 })
        }
    },

    methods: {
        handleChange() {},

        async handleEnroll() {
            try {
                this.$nuxt.$loading.start()
                if (this.$auth.user) {
                    const ACTION = this.isEnrolled ? 'UNENROLL' : 'ENROLL'
                    await this.$store.dispatch(`paths/${ACTION}`, {
                        pathId: this.$data._id,
                        userIds: this.$auth.user._id
                    })
                    await this.$auth.fetchUser()
                    this.$message({
                        type: 'success',
                        message: `${ACTION} successfully!`,
                        showClose: true,
                        duration: 1000
                    })
                } else {
                    this.$router.push({
                        name: 'login',
                        query: { prevPath: this.$route.fullPath }
                    })
                }
                this.$nuxt.$loading.finish()
            } catch (e) {
                this.$nuxt.$loading.fail()
                this.$message.error(e.message)
            }
        }

        /*
        async getSinglePath(slug) {
            try {
                this.$nuxt.$loading.start()
                const response = await this.$store.dispatch('paths/GET_PATH', slug)
                this.$nuxt.$loading.finish()
                return response
            } catch (e) {
                this.$nuxt.$loading.fail()
                this.$message.error(e.message)
            }
        },
        */

    }
}
</script>

<style lang="scss" scoped>
.single-path {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 50px;

    .project-content {
        padding: 20px !important;
        height: auto;

        .project-head {

            color: #FFF;

            .desc {
                color: #FFF;
                font-size: 90%;
                margin-bottom: 10px;
            }
        }

        .block {
            display: block;
            width: 100%;
            clear: both;
        }

        .wide-title {
            float: left;
            display: block;
            width: 100%;
            clear: both;
            color: #EEE;
            border-bottom: 1px solid #CCCCCC50;
        }

        .short-title {
            display: inline-block;
            line-height: 38px;
            margin: 0 10px 0 0;

            &:hover {
                cursor: pointer;
            }
        }

        .sort-icon {
            &:hover {
                cursor: pointer;
            }
        }
    }

    .right {
        float:right;
    }

    .report-btn {
        margin-left: 10px;
        width: 110px;
    }

    .download-link {
        font-size: 90%;
        font-weight: bold;
        color: #FFF;
    }
    .download-button {
        width: 110px;
    }

    .file-name {
        margin: 0;
        font-weight: bold;
    }
    .file-description {
        font-size: 90%;
        margin: 0;
        line-height: 14px;
    }

    .switch-text {
        font-size: 80% !important;
        margin-left: 5px;
    }

    .attachments-buttons {
        display: flex;
        justify-content: flex-end;

        .delete-btn {
            margin-left: 10px;
        }
    }

    .el-table {
        margin-bottom: 35px;
        clear: both;

    }

    h1 {
        font-size: 60px;
    }
    h1 small {
        display: block;
        color: #999;
        font-size: 55%;
        font-weight: 200 !important;
    }
    .image {
        width: 100%;
    }
    .block {
        width: 100%;
    }

}
</style>
