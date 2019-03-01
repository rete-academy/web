<template>
    <div class="single-path">
        <div class="path-content">
            <div class="block">
                <h1>{{ name }} <small>{{ description }}</small></h1>
                <el-button type="success">
                    Enroll Now
                </el-button>
            </div>
            <div class="sprints block">
                <el-row :gutter="10">
                    <el-col :span="16">
                        <h3>Sprints</h3>
                    </el-col>
                    <el-col :span="8">
                        <h5>Materials: 1024</h5>
                    </el-col>
                </el-row>

                <el-collapse v-model="activeItems" @change="handleChange">
                    <el-collapse-item
                        v-for="sprint in sprints"
                        :key="sprint._id"
                        :title="sprint.name"
                        :name="sprint._id"
                    >
                        <el-row :gutter="10">
                            <el-col :span="16">
                                <p>{{ sprint.description }}</p>
                            </el-col>
                            <el-col :span="8">
                                <p>241</p>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <div class="path-image is-extra-large">
            <img :src="image" class="image">
        </div>
    </div>
</template>

<script>
import consola from 'consola'
// import { mapState } from 'vuex'

export default {

    name: 'SinglePath',

    auth: false,

    data() {
        return {
            activeItems: []
        }
    },

    async asyncData({ params, store, error }) {
        try {
            const response = await store.dispatch('paths/GET_PATH', params.slug)
            return response
        } catch (e) {
            error({ message: e, statusCode: 404 })
        }
    },

    methods: {
        handleChange() {
            consola.info('change')
        }
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
