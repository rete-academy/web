<template>
    <div class="name">
        <h1>{{ name }} <small>{{ description }}</small></h1>
        <el-button type="success">
            Enroll Now
        </el-button>
        <el-collapse v-model="activeItems" @change="handleChange">
            <el-collapse-item
                v-for="sprint in sprints"
                :key="sprint._id"
                :title="sprint.name"
                :name="sprint._id"
            >
                <div>{{ sprint.description }}</div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import consola from 'consola'
// import { mapState } from 'vuex'

export default {

    name: 'SinglePath',

    auth: false,

    layout: 'aside',

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
</style>
