<template>
    <el-dialog
        title="Add New Path"
        :modal="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="visible"
        width="60%"
        class="custom-dialog"
    >
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="Path Name">
                <el-input
                    v-model="form.name"
                    placeholder="Name"
                    :disabled="loading"
                    clearable
                    @blur="checkPathBySlug"
                >
                    <i
                        slot="suffix"
                        class="el-input__icon "
                        :class="loading ? 'el-icon-loading' : ''"
                    >&nbsp;</i>
                </el-input>
            </el-form-item>

            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item label="Slug">
                        <el-input
                            v-model="form.slug"
                            :class="taken ? 'taken' : ''"
                            placeholder="slug"
                        >
                            <i
                                slot="suffix"
                                class="el-input__icon "
                                :class="taken ? 'el-icon-warning taken' : ''"
                            >&nbsp;</i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Description">
                        <el-input
                            v-model="form.description"
                            placeholder="Description text here..."
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 6}"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-upload
                        class="image-uploader"
                        list-type="picture"
                        :action="uploadEndpoint"
                        :auto-upload="true"
                        :http-request="submitUpload"
                        :headers="uploadHeaders"
                        :show-file-list="false"
                        :on-change="onChange"
                    >
                        <img
                            v-if="hasImage"
                            :src="form.image"
                            class="image"
                        >
                        <fa
                            v-else
                            icon="upload"
                            class="avatar-uploader-icon"
                        />
                    </el-upload>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button
                    size="small"
                    type="success"
                    :disabled="taken"
                    @click="onSubmit"
                >
                    Create Path
                </el-button>
                <el-button
                    size="small"
                    type="danger"
                    @click="handleClose"
                >
                    Close
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import consola from 'consola'

export default {
    name: 'PathForm',

    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            form: {
                name: '',
                slug: '',
                description: '',
                image: ''
            },
            file: null,
            loading: false,
            taken: false
        }
    },

    computed: {
        hasImage() {
            if (this.form.image || this.file) {
                return true
            }
            return false
        },

        uploadEndpoint() {
            const baseUrl = this.$axios.defaults.baseURL || 'http://localhost:8000'
            return `${baseUrl}/api/path/avatar`
        },

        uploadHeaders() {
            return {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: this.$auth.getToken('local')
            }
        }
    },

    watch: {
        'form.name': function () {
            if (this.form.name) {
                this.form.slug = this.slugify(this.form.name)
            }
        }
    },

    methods: {
        onChange(file) {
            this.file = file
        },

        handleClose() {
            this.form = {
                name: '',
                slug: '',
                description: '',
                image: 'http://www.markweb.in/primehouseware/images/noimage.png'
            }
            this.$emit('update:visible', false)
        },

        onSubmit() {
            consola.info('Begin add new path')
            this.$nuxt.$loading.start()
            if (!this.taken) {
                this.$store.dispatch('paths/CREATE_PATH', {
                    name: this.form.name,
                    description: this.form.description
                }).then(() => {
                    this.handleClose()
                    this.$nuxt.$loading.finish()
                }).catch((err) => {
                    consola.error(err)
                })
            }
        },

        async submitUpload() {
            try {
                this.$nuxt.$loading.start()
                const formData = new FormData()
                formData.append('image', this.file.raw)
                await this.$axios.post(this.uploadEndpoint, formData, {
                    headers: this.uploadHeaders
                })
                // await this.$store.dispatch('users/FETCH_USER')
                this.$nuxt.$loading.finish()
                this.$message({
                    message: 'Uploaded succesfully!',
                    type: 'success'
                })
            } catch (error) {
                consola.error(error.message)
                this.$nuxt.$loading.fail()
                this.$message.error(`Oops, ${error.message}`)
            }
        },

        checkPathBySlug() {
            this.$nuxt.$loading.start()
            this.$store.dispatch('paths/GET_PATH', this.form.slug)
                .then((path) => {
                    this.taken = true
                    this.$nuxt.$loading.finish()
                })
                .catch((err) => {
                    this.taken = false
                    this.$nuxt.$loading.fail()
                    consola.error(err)
                })
        },

        slugify(str) {
            str = str.replace(/^\s+|\s+$/g, '') // trim
            str = str.toLowerCase()

            // remove accents, swap ñ for n, etc
            const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
            const to = 'aaaaeeeeiiiioooouuuunc------'
            for (let i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
            }

            str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-') // collapse dashes

            return str
        }

    }
}
</script>

<style lang="scss" scoped>
.image {
    width: 100%;
}
.taken {
    color: red;
}
.free {
    color: green;
}
</style>
