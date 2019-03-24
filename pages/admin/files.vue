<template>
    <div class="main-content">
        <div class="title-buttons">
            <div class="left">
                <h2>Manage Files</h2>
                <el-dropdown @command="handleCommand">
                    <el-button
                        type="info"
                        size="mini"
                        plain
                    >
                        Actions
                        <fa icon="chevron-down" class="icon" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="delete">
                            Delete Files
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-upload
                class="avatar-uploader"
                list-type="picture"
                :action="uploadEndpoint"
                :auto-upload="true"
                :http-request="submitUpload"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-change="onChange"
            >
                <el-button
                    type="success"
                    :disabled="loading"
                    :icon="loading ? 'el-icon-loading' : 'el-icon-upload'"
                    class="create-new-btn right"
                >
                    Upload New File
                </el-button>
            </el-upload>
        </div>

        <el-table
            :data="files"
            class="file-table"
            width="100%"
            border
            @selection-change="selectionChange"
        >
            <el-table-column
                type="selection"
                width="36"
            />
            <el-table-column
                label="Preview"
                width="77px"
            >
                <template slot-scope="scope">
                    <img
                        v-if="isImage(scope.row.data.originalname)"
                        :src="scope.row.data.location"
                        class="preview"
                    >
                    <fa
                        v-else
                        :icon="detectIcon(scope.row.data.originalname)"
                        class="preview"
                    />
                </template>
            </el-table-column>
            <el-table-column
                label="Name"
                width="320"
            >
                <template slot-scope="scope">
                    <p class="file-name">
                        <span class="icon">
                            <fa
                                :icon="detectIcon(scope.row.data.originalname)"
                                class="file-icon"
                            />
                        </span>
                        <span class="name">
                            <a
                                :href="scope.row.data.location"
                                target="_blank"
                            >
                                {{ scope.row.data.originalname }}
                            </a>
                        </span>
                    </p>
                    <p class="small">
                        Size: {{ scope.row.data.size | convertByte() }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="Author">
                <template slot-scope="scope">
                    {{ scope.row.author.name }}
                </template>
            </el-table-column>
            <el-table-column label="Created">
                <template slot-scope="scope">
                    {{ scope.row.createdTime | convertTime('HH:mm DD.MM.YYYY') }}
                </template>
            </el-table-column>
            <el-table-column
                label="URL"
                width="250"
            >
                <template slot-scope="scope">
                    <el-input
                        :ref="scope.row._id"
                        :value="scope.row.data.location"
                        size="mini"
                        placeholder="Please use valid data"
                        @focus="selectText(scope.row._id)"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-document"
                            @click="copyText(scope.row._id)"
                        />
                    </el-input>
                </template>
            </el-table-column>
        </el-table>
        <!-- material-form :visible.sync="userFormVisible" / -->
    </div>
</template>

<script>
import consola from 'consola'
import { mapGetters } from 'vuex'
// import SettingPopover from '@/components/user/SettingPopover'
// import MaterialForm from '@/components/form/Material'

export default {
    name: 'AdminFiles',

    // components: { SettingPopover },

    data() {
        return {
            file: null,
            selectedUsers: null,
            selectedFileIds: [],
            changed: false,
            loading: false,
            userFormVisible: false
        }
    },

    computed: {
        ...mapGetters('users', ['users']),
        ...mapGetters('files', ['files']),

        uploadEndpoint() {
            const baseUrl = this.$axios.defaults.baseURL || 'http://localhost:8000'
            return `${baseUrl}/api/files/upload`
        },

        uploadHeaders() {
            return {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: this.$auth.getToken('local')
            }
        }
    },

    /* async asyncData({ store, error }) {
        try {
            if (store.getters['files/files'].length === 0) {
                return await store.dispatch('users/FETCH_USER')
            }
        } catch (e) {
            error({ message: e, statusCode: 404 })
        }
    }, */

    methods: {
        handleCommand(command) {
            switch (command) {
            case 'delete':
                this.deleteFiles(this.selectedFileIds)
                break
            default:
                break
            }
        },

        selectionChange(selection) {
            this.selectedFileIds = selection.map(o => o._id)
        },

        selectText(id) {
            this.$refs[id].select()
        },

        copyText(id) {
            this.$copyText(this.$refs[id].value)
            this.$refs[id].select()
            this.$notify({
                duration: 1200,
                message: 'File URL copied successfully',
                type: 'success'
            })
            /*
            // this.$refs[id].$refs.input.selectionStart
            // this.$refs[id].$refs.input.selectionEnd
            if (typeof el.createTextRange != "undefined") {
            el.focus();
            var range = el.createTextRange();
            range.collapse(false);
            range.select();
            consola.info(this.$refs[id])
            */
        },

        isAdmin(user) {
            if (user && user.role) {
                if (user.role.reduce((i, j) => i * j) === 0) return true
                return false
            }
            return false
        },

        onChange(file) {
            this.file = file
        },

        async submitUpload() {
            try {
                this.loading = true
                this.$nuxt.$loading.start()
                const formData = new FormData()
                formData.append('files', this.file.raw)
                await this.$axios.post(this.uploadEndpoint, formData, {
                    headers: this.uploadHeaders
                })
                await this.$store.dispatch('files/GET_FILES')
                this.loading = false
                this.$nuxt.$loading.finish()
                this.$message({
                    message: 'Uploaded succesfully!',
                    type: 'success'
                })
            } catch (error) {
                consola.error(error.message)
                this.$nuxt.$loading.fail()
                this.loading = false
                this.$message.error(`Oops, ${error.message}`)
            }
        },

        deleteFiles(ids) {
            try {
                this.$confirm(
                    'This will permanently delete thess files. Continue?',
                    'Warning',
                    {
                        confirmButtonText: 'OK, Delete',
                        confirmButtonClass: 'el-button--danger',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                        center: true
                    }
                ).then(async () => {
                    this.loading = true
                    this.$nuxt.$loading.start()
                    await this.$store.dispatch('files/DELETE_FILES', ids)
                    this.$message({
                        type: 'success',
                        message: 'Delete completed',
                        showClose: true,
                        duration: 1000
                    })
                    this.loading = false
                    this.$nuxt.$loading.finish()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled',
                        showClose: true,
                        duration: 1000
                    })
                })
            } catch (e) {
                this.$nuxt.$loading.fail()
                consola.error(e.message)
                this.$message.error(e.message)
            }
        },

        detectIcon(file) {
            const fileName = file.split('.')

            switch (fileName[fileName.length - 1]) {
            case 'png':
            case 'jpg':
            case 'gif':
            case 'jpeg':
                return 'file-image'
            case 'pdf':
                return 'file-pdf'
            case 'txt':
            case 'log':
                return 'file-alt'
            case 'json':
                return 'file'
            case 'mov':
            case 'webm':
            case 'mp4':
            case 'avi':
                return 'file-video'
            case 'doc':
            case 'docx':
                return 'file-word'
            case 'xls':
            case 'xlsx':
                return 'file-excel'
            case 'ppt':
            case 'pptx':
                return 'file-powerpoint'
            case 'zip':
            case 'rar':
            case '7z':
                return 'file-archive'
            default:
                return 'file'
            }
        },

        isImage(file) {
            const fileName = file.split('.')

            switch (fileName[fileName.length - 1]) {
            case 'png':
            case 'jpg':
            case 'gif':
            case 'jpeg':
                return true
            default:
                return false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.paths-table {
    margin-bottom: 20px;
    width: 100%;
}
h2 {
    display: inline-block;
}
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.manage-popover {
    min-width: 160px;
}
.file-name {
    .name {
        font-weight: bold;
    }
}
.success {
    color: green;
}
.preview {
    float: left;
    width: 55px;
    height: 55px;
    color: #CCC;
}
.file-icon {
    color: #999;
}
</style>
