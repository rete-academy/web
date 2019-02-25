<template>
    <el-container>
        <el-header>
            <nav-bar />
        </el-header>
        <el-main>
            <nuxt />
        </el-main>
    </el-container>
</template>

<script>
import NavBar from '@/components/header/NavBar'

export default {
    name: 'Default',

    components: { NavBar }
}
</script>
