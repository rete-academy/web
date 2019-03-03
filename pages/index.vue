<template>
    <section class="container paths items">
        <card-item
            v-for="path in paths"
            :key="path._id"
            :data="path"
            class="path item"
            @click.native="openSinglePath(path)"
        />
    </section>
</template>

<script>
import { mapState } from 'vuex'
import CardItem from '~/components/CardItem.vue'

export default {
    name: 'Home',

    auth: false,

    components: {
        CardItem
    },

    computed: {
        ...mapState('paths', ['paths'])
    },

    created() {
        this.$store.dispatch('paths/GET_PATHS')
    },

    methods: {
        openSinglePath(p) {
            this.$router.push(`/paths/${p.slug}`)
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
