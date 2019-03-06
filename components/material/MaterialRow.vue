<template>
    <div class="material-row">
        <el-checkbox
            v-loading="loading"
            :value="check(data._id)"
            @change="updateStatus"
        >
            {{ data.name | truncate(55) }}
        </el-checkbox>
        <a :href="data.url" target="_blank">
            <fa icon="external-link-alt" />
        </a>
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

    methods: {
        check(id) {
            const found = this.$auth.user.progress.find(o => o.material === id)
            if (found) return !!found.status
            return false
        },

        updateStatus(status) {
            consola.info('status is ' + status)
            this.loading = true
            this.$nuxt.$loading.start()

            this.$store.dispatch('materials/UPDATE_MATERIAL_STATUS', {
                userId: this.$auth.user._id,
                materialId: this.data._id,
                status: status ? 1 : 0
                // status: status
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
    // width: 100%;

    a {
        font-size: 12px;
    }

    padding: 10px;
    margin-bottom: 1px;
    border: 1px solid #EEEEEE;
    background: #FFF;
    border-radius: 4px;
}
</style>
