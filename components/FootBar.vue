<template>
  <div class="wrapper">
    <div class="sys-info">
      <div class="copy">
        © 2019 Rete Academy Team.
        Made with  <fa icon="heart" />  in Finland.
      </div>
      <div class="social">
        <a
          href="https://twitter.com/reteacademy"
          target="_blank"
        >
          <fa :icon="['fab', 'twitter']" />
          @reteacademy
        </a>
        <a
          href="https://www.facebook.com/ReteAcademy"
          target="_blank"
        >
          <fa :icon="['fab', 'facebook']" />
          ReteAcademy
        </a>
      </div>
      <div class="version">
        v{{ version }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FootBar',

  computed: {
    version: () => process.env.version || '1.0.0',
  },
};
</script>

<style scoped>
.social a {
    margin: 0 20px;
}
</style>
