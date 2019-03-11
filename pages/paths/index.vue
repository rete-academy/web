<template>
    <section class="container paths items">
        <div
            v-for="path in myPaths"
            :key="path._id"
            class="path-row"
        >
            <h2 :id="path.slug" class="title">
                {{ path.name }}
                <fa icon="cog" class="actions" />
            </h2>
            <div class="progress-wrapper">
                <div class="progress-inner">
                    <el-steps
                        :active="1"
                        :space="500"
                        :align-center="true"
                    >
                        <el-step
                            v-for="sprint in path.sprints"
                            :key="sprint._id"
                            :title="'Sprint: ' + sprint.name"
                            :description="sprint.description"
                            class="sprint"
                        />
                    </el-steps>

                    <div class="sprint-content">
                        <div
                            v-for="sprint in path.sprints"
                            :key="sprint._id"
                            class="sprint"
                        >
                            <div class="materials-list">
                                <material-row
                                    v-for="material in sprint.materials"
                                    :key="material._id"
                                    :data="{ path, sprint, material }"
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
// import consola from 'consola'
import { mapState } from 'vuex'
import MaterialRow from '@/components/material/MaterialRow'

export default {
    name: 'MyPaths',

    auth: true,

    components: { MaterialRow },

    computed: {
        ...mapState('paths', ['paths']),

        myPaths() {
            if (this.$auth.user && this.$auth.user.progress && this.paths) {
                const tempPaths = []
                for (const singleStep of this.$auth.user.progress) {
                    if (!tempPaths.includes(singleStep.path)) {
                        tempPaths.push(singleStep.path)
                    }
                }
                return tempPaths.map(id => this.paths.find(p => p._id === id))
            }
            return []
        }
    },

    async asyncData({ params, store, error }) {
        try {
            await store.dispatch('paths/GET_PATHS')
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
    height: auto;
    margin: 40px auto 80px;
    padding: 20px 10px 10px;
    border-radius: 4px;
    overflow-y: hidden;
    overflow-x: scroll;
    background: #F5F5F5;
}
.progress-inner {
}
.el-steps {
    text-align: center;
    margin-left: 10px;
}
.sprint {
    min-width: 500px;
}

.sprint-content {
    display: flex;
}

.materials-list {
    width: 470px;
    padding: 10px;
    border-radius: 4px;
    background: #EEEEEE;

    h4 {
        padding: 10px 0 0 25px;
    }
}
</style>
