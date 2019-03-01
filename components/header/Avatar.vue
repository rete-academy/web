<template>
    <div class="avatar">
        <el-button
            type="info"
            class="icon"
            circle
            plain
        >
            <fa icon="user" />
        </el-button>
    </div>
</template>

<script>
export default {
    name: 'Avatar',

    data() {
        return { }
    },

    methods: { }
}
</script>

<style lang="scss" scoped>
.icon {
    width: 55px;
    height: 55px;
}
</style>
