<template>
    <el-dialog
        title="Add New Material"
        :modal="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="visible"
        width="60%"
        class="custom-dialog"
    >
        <el-form ref="form" :model="form" label-width="150px">
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form-item label="Material URL">
                        <el-input
                            v-model="form.url"
                            placeholder="Paste material URL here..."
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
                    <el-form-item v-if="fetched" label="Title">
                        <el-input
                            v-model="form.name"
                            placeholder="Title"
                            clearable
                        />
                    </el-form-item>
                    <el-form-item v-if="fetched" label="Description">
                        <el-input
                            v-model="form.description"
                            placeholder="Description..."
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 6}"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-select
                        v-model="localSelected"
                        placeholder="Select sprint"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="sprint in sprints"
                            :key="sprint._id"
                            :label="sprint.name"
                            :value="sprint._id"
                        />
                    </el-select>
                    <img :src="form.image" class="material-image">
                </el-col>
            </el-row>
            <el-form-item>
                <el-button
                    size="small"
                    type="success"
                    @click="onSubmit"
                >
                    Add Material
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
import { mapGetters } from 'vuex'

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
                name: '',
                description: '',
                image: ''
            },
            loading: false,
            fetched: false,
            validUrl: false
        }
    },

    computed: {
        ...mapGetters('sprints', ['sprints', 'selectedSprint']),

        localSelected: {
            get() {
                return this.selectedSprint
            },
            set(newValue) {
                consola.info(newValue)
                this.$store.commit('sprints/SET_SELECTED_SRPINT', newValue)
            }
        }
    },

    watch: {
        'form.url': function () {
            this.isValidUrl(this.form.url)
            if (this.form.url && this.validUrl) {
                this.loading = true
                this.$nuxt.$loading.start()
                this.$axios.post(
                    'https://api.linkpreview.net',
                    {
                        q: this.form.url,
                        key: '5c6e71509eafb0595e5860fe9c5eaba82fb617087dbc1'
                    }).then((res) => {
                    if (res) {
                        this.fetched = true
                        this.form.name = res.data.title
                        this.form.description = res.data.description
                        this.form.image = res.data.image

                        this.loading = false
                        this.$nuxt.$loading.finish()
                    }
                    consola.info(res.data)
                }).catch((error) => {
                    this.loading = false
                    this.$nuxt.$loading.fail()
                    consola.error(error)
                })
            }
        }
    },

    created() {
        if (this.sprints.length === 0) {
            this.$store.dispatch('sprints/GET_SPRINTS')
        }
    },

    methods: {
        handleClose() {
            this.form = {
                url: '',
                name: '',
                description: '',
                image: ''
            }
            this.$emit('update:visible', false)
        },

        onSubmit() {
            this.$nuxt.$loading.start()
            this.$store.dispatch('materials/CREATE_MATERIAL', this.form)
                .then((result) => {
                    if (this.localSelected) {
                        this.$store.dispatch('sprints/ADD_MATERIALS', {
                            sprintId: this.localSelected,
                            materialIds: result._id
                        })
                    }
                    this.handleClose()
                    this.$nuxt.$loading.finish()
                }).catch((e) => {
                    this.$nuxt.$loading.fail()
                    consola.error(e.message)
                    this.$message.error(e.message)
                })
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
