<template>
    <section class="container paths items">
        <div
            v-for="path in myPaths"
            :key="path._id"
            class="path-row"
        >
            <h2>{{ path.name }}</h2>
            <p>{{ path.description }}</p>
            <div class="progress-wrapper">
                <div class="progress-inner">
                    <el-steps
                        :active="1"
                        :space="500"
                    >
                        <el-step
                            v-for="sprint in path.sprints"
                            :key="sprint._id"
                            :title="sprint.name"
                            :description="sprint.description"
                            class="sprint"
                        />
                    </el-steps>

                    <div
                        v-for="sprint in path.sprints"
                        :key="sprint._id"
                        class="sprint"
                    >
                        <ul>
                            <li
                                v-for="m in sprint.materials"
                                :key="m._id"
                            >
                                <el-checkbox :value="check(m._id)">
                                    {{ m.name }}
                                </el-checkbox>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex'
// import consola from 'consola'
// import CardItem from '~/components/CardItem.vue'

export default {
    name: 'MyPaths',

    auth: true,

    components: {
        // CardItem
    },

    computed: {
        ...mapState('paths', ['paths']),

        myPaths() {
            if (this.$auth.user && this.$auth.user.progress && this.paths) {
                const tempPaths = []
                this.$auth.user.progress.forEach((o) => {
                    if (!tempPaths.includes(o.path)) { tempPaths.push(o.path) }
                })

                // consola.info('tempath final ' + tempPaths.length)
                return tempPaths.map(id => this.paths.find(p => p._id === id))
            }

            return []
        }
    },

    async asyncData({ params, store, error }) {
        try {
            await store.dispatch('paths/GET_PATHS')
            return {}
        } catch (e) {
            error({ message: e, statusCode: 404 })
        }
    },

    methods: {
        check(id) {
            const found = this.$auth.user.progress.find(o => o.material === id)
            if (found) return found.status
        },

        openSinglePath(p) {
            this.$router.push(`/paths/${p.slug}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.progress-wrapper {
    width: 100%;
    height: 50vh;
    margin: 20px auto;
    overflow-y: hidden;
    overflow-x: scroll;
}
.progress-inner {
}
.sprint {
    float: left;
    min-width: 500px;
    display: block;
}
</style>
