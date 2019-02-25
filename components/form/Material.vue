<template>
    <el-dialog
        title="Add New Material"
        :modal="true"
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="80%"
        class="custom-dialog"
    >
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="Material URL">
                <el-input
                    v-model="form.url"
                    placeholder="url"
                    :disabled="loading"
                    clearable
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
                    <el-form-item v-if="fetched" label="Title">
                        <el-input
                            v-model="form.title"
                            placeholder="Title"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item v-if="fetched" label="Description">
                        <el-input
                            v-model="form.description"
                            placeholder="Title"
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 6}"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <img :src="form.image" class="material-image">
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="success" @click="onSubmit">
                    Add Material
                </el-button>
                <el-button type="danger" @click="handleClose">
                    Close
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import consola from 'consola'

export default {
    name: 'MaterialForm',

    props: {
        user: {
            type: Object,
            default: () => ({})
        },
        visible: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            form: {
                url: '',
                title: '',
                description: '',
                image: ''
            },
            loading: false,
            fetched: false,
            validUrl: false
        }
    },

    watch: {
        'form.url': function () {
            this.isValidUrl(this.form.url)
            if (this.form.url && this.validUrl) {
                this.loading = true
                this.$axios.post(
                    'https://api.linkpreview.net',
                    {
                        q: this.form.url,
                        key: '5c6e71509eafb0595e5860fe9c5eaba82fb617087dbc1'
                    }).then((res) => {
                    if (res) {
                        this.fetched = true
                        this.form.title = res.data.title
                        this.form.description = res.data.description
                        this.form.image = res.data.image

                        this.loading = false
                    }
                    consola.info(res.data)
                }).catch((error) => {
                    this.loading = false
                    consola.error(error)
                })
            }
        }
    },

    methods: {
        checkForm(done) {
            consola.info('are you sure?')
            done()
        },

        handleClose() {
            // this.form.url = ''
            this.$emit('update:visible', false)
        },

        onSubmit() {
        },

        isValidUrl(url) {
            const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
            this.validUrl = regex.test(url)
            return this.validUrl
        }
    }
}
</script>

<style lang="scss" scoped>
.material-image {
    width: 100%;
}
</style>
