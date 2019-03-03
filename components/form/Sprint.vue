<template>
    <el-dialog
        title="Add New Sprint"
        :modal="true"
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="50%"
        class="custom-dialog"
    >
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="Sprint Name">
                <el-input
                    v-model="form.name"
                    placeholder="Name"
                    :disabled="loading"
                    clearable
                />
            </el-form-item>
            <el-form-item label="Description">
                <el-input
                    v-model="form.description"
                    placeholder="Description text here..."
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    size="small"
                    type="success"
                    :disabled="taken"
                    @click="onSubmit"
                >
                    Create Sprint
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
    name: 'SprintForm',

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
                description: ''
            },
            loading: false,
            taken: false
        }
    },

    methods: {
        handleClose() {
            this.form = {
                name: '',
                description: ''
            }
            this.$emit('update:visible', false)
        },

        onSubmit() {
            consola.info('Begin add new sprint')
            this.$nuxt.$loading.start()
            this.$store.dispatch('sprints/CREATE_SPRINT', {
                name: this.form.name,
                description: this.form.description
            }).then(() => {
                this.handleClose()
                this.$nuxt.$loading.finish()
            }).catch((e) => {
                this.$nuxt.$loading.fail()
                consola.error(e.message)
                this.$message.error(e.message)
            })
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
