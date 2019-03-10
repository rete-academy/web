<template>
    <div class="profile wrapper">
        <h1>Hi, {{ profile.name }}</h1>
        <el-form
            ref="profileForm"
            :model="profile"
            label-width="180px"
            label-position="top"
        >
            <el-form-item label="Email" class="email">
                <el-row :gutter="5">
                    <el-col :span="18">
                        <el-input v-model="profile.email" />
                    </el-col>
                    <el-col :span="6">
                        <el-button
                            v-if="!profile.meta.confirm"
                            type="text"
                            @click="resendConfirm"
                        >
                            Resend Confirmation
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="success"
                    @click="updateProfile"
                >
                    Update Profile
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// import consola from 'consola'
// import { mapState } from 'vuex'

export default {

    name: 'Profile',

    data() {
        return {
            profile: {},
            activeItems: []
        }
    },

    computed: {
    },

    created() {
        this.profile = { ...this.$auth.user }
    },

    methods: {
        async updateProfile() {},

        async resendConfirm() {
            try {
                this.$nuxt.$loading.start()
                if (this.$auth.user) {
                    await this.$store.dispatch('users/RESEND_CONFIRM', {
                        email: this.profile.email
                    })
                    await this.$auth.fetchUser()
                    this.$message({
                        type: 'success',
                        message: 'Confirmation sent successfully!',
                        showClose: true,
                        duration: 1000
                    })
                }
                this.$nuxt.$loading.finish()
            } catch (e) {
                this.$nuxt.$loading.fail()
                this.$message.error(e.message)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.profile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 600px;
    margin: 0 auto 50px;

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
