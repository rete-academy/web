<template>
    <el-container>
        <el-header height="75">
            <nav-bar />
        </el-header>
        <el-main>
            <nuxt />
        </el-main>
        <el-footer>
            <div class="wrapper">
                <p class="sys-info">
                    <span class="copy">
                        Rete Academy Team made with <fa icon="heart" /> in Finland.
                    </span>
                    <span class="version">
                        v{{ version }}
                    </span>
                </p>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
import NavBar from '@/components/header/NavBar'

export default {
    name: 'Default',
    components: { NavBar },
    computed: {
        version() {
            return process.env.version
        }
    }
}
</script>
