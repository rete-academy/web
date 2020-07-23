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
import NavBar from '@/components/header/NavBar';
import FootBar from '@/components/footer/Footer';

export default {
  name: 'Landing',
  components: { NavBar, FootBar },
};
</script>
