<template>
  <el-container>
    <el-header height="75">
      <nav-bar />
    </el-header>
    <nuxt />
    <foot-bar />
  </el-container>
</template>

<script>
import { NavBar, FootBar } from '@/components';

export default {
  name: 'Landing',
  components: { NavBar, FootBar },
};
</script>
