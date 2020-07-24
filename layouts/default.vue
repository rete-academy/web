<template>
  <el-container>
    <el-header height="75">
      <nav-bar />
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
    <el-footer>
      <footer />
    </el-footer>
  </el-container>
</template>

<script>
import { NavBar, Footer } from '@/components';

export default {
  name: 'Default',
  components: { NavBar, Footer },
};
</script>
