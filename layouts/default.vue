<template>
  <el-container>
    <el-header height="75">
      <nav-bar />
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
    <el-footer>
      <foot-bar />
    </el-footer>
  </el-container>
</template>

<script>
import { NavBar, FootBar } from '@/components';

export default {
  name: 'Default',
  components: { NavBar, FootBar },
};
</script>
