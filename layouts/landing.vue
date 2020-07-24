<template>
  <el-container>
    <el-header height="75">
      <nav-bar />
    </el-header>
    <nuxt />
    <footer />
  </el-container>
</template>

<script>
import { NavBar, Footer } from '@/components';

export default {
  name: 'Landing',
  components: { NavBar, Footer },
};
</script>
