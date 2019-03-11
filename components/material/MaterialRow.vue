<template>
    <div class="material-row">
        <el-checkbox
            :key="stepId"
            v-loading="loading"
            :value="isChecked"
            :disabled="isNew"
            @change="updateStatus"
        >
            {{ data.material.name | truncate(55) }}
        </el-checkbox>
        <div class="tools">
            <span v-if="isNew" class="new">
                New!
            </span>
            <fa
                v-if="isNew"
                icon="download"
                class="copy link"
                @click="copy"
            />
            <a :href="data.material.url" target="_blank">
                <fa icon="external-link-alt" />
            </a>
        </div>
    </div>
</template>

<script>
import consola from 'consola'

export default {
    name: 'MaterialRow',

    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            loading: false
        }
    },

    computed: {
        isChecked() {
            const found = this.$auth.user.progress
                .find(o => o.material === this.data.material._id &&
                    o.sprint === this.data.sprint._id &&
                    o.path === this.data.path._id)
            if (found) return !!found.status
            return false
        },

        stepId() {
            const found = this.$auth.user.progress
                .find(o => o.material === this.data.material._id &&
                    o.sprint === this.data.sprint._id &&
                    o.path === this.data.path._id)
            if (found) return found._id
            return ''
        },

        isNew() {
            const found = this.$auth.user.progress
                .find(o => o.material === this.data.material._id &&
                    o.sprint === this.data.sprint._id &&
                    o.path === this.data.path._id)
            if (found) return false
            return true
        }
    },

    methods: {
        updateStatus(status) {
            this.loading = true
            this.$nuxt.$loading.start()
            this.$store.dispatch('users/UPDATE_STATUS', {
                userId: this.$auth.user._id,
                data: {
                    id: this.stepId,
                    status: status ? 1 : 0
                }
            }).then(() => {
                this.loading = false
                this.$auth.fetchUser()
                this.$nuxt.$loading.finish()
            }).catch((e) => {
                this.loading = false
                this.$nuxt.$loading.fail()
                consola.error(e.message)
                this.$message.error(e.message)
            })
        },

        copy() {
            this.$nuxt.$loading.start()
            this.$store.dispatch('users/UPDATE_PROGRESS', {
                userId: this.$auth.user._id,
                data: {
                    path: this.data.path._id,
                    sprint: this.data.sprint._id,
                    material: this.data.material._id,
                    status: 0
                }
            }).then(() => {
                this.loading = false
                this.$auth.fetchUser()
                this.$nuxt.$loading.finish()
            }).catch((e) => {
                this.loading = false
                this.$nuxt.$loading.fail()
                consola.error(e.message)
                this.$message.error(e.message)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.material-row {
    display: flex;
    justify-content: space-between;

    a, .link, .new {
        font-size: 12px;
    }

    padding: 10px;
    margin-bottom: 1px;
    border: 1px solid #EEEEEE;
    background: #FFF;
    border-radius: 4px;

    .tools {
        .new {
            color: #8BC34A;
        }
        .copy {
            margin: 0 10px;
        }
    }
}
</style>
