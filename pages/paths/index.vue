<template>
    <section class="container paths items">
        <div
            v-for="path in myPaths"
            :key="path._id"
            class="path-row"
        >
            <h2 class="title">
                {{ path.name }}

                <fa
                    icon="cog"
                    class="actions"
                />
            </h2>
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
                            :title="'Sprint: ' + sprint.name"
                            :description="sprint.description"
                            class="sprint"
                            :align-center="true"
                        />
                    </el-steps>

                    <div class="sprint-content">
                        <div
                            v-for="sprint in path.sprints"
                            :key="sprint._id"
                            class="sprint"
                        >
                            <div class="materials-list">
                                <h4>Materials</h4>
                                <material-row
                                    v-for="material in sprint.materials"
                                    :key="material._id"
                                    :data="material"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex'
import MaterialRow from '@/components/material/MaterialRow'
// import consola from 'consola'
// import CardItem from '~/components/CardItem.vue'

export default {
    name: 'MyPaths',

    auth: true,

    components: {
        // CardItem,
        MaterialRow
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
        openSinglePath(p) {
            this.$router.push(`/paths/${p.slug}`)
        }
    }
}
</script>

<style lang="scss" scoped>
h2 {
    font-size: 32px;

    .actions {
        font-size: 18px;
        color: #CCC;
    }
}
.progress-wrapper {
    width: 100%;
    height: 50vh;
    margin: 40px auto 80px;
    padding: 20px 10px 10px;
    border-radius: 4px;
    overflow-y: hidden;
    overflow-x: scroll;
    background: #F5F5F5;
}
.progress-inner {
}
.sprint {
    min-width: 500px;
}

.sprint-content {
    display: flex;
}

.materials-list {
    width: 470px;
    padding: 0 10px 10px;
    border-radius: 4px;
    background: #EEEEEE;

    h4 {
        padding: 10px 0 0 25px;
    }
}
</style>
