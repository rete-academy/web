<template>
    <el-dialog
        title="Add New Path"
        :modal="true"
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="50%"
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
                    <img :src="form.image" class="image">
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
                image: 'http://www.markweb.in/primehouseware/images/noimage.png'
            },
            loading: false,
            taken: false
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
        handleClose() {
            // this.form.url = ''
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
                    this.$nuxt.$loading.finish()
                    this.$emit('update:visible', false)
                }).catch((err) => {
                    consola.error(err)
                })
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
