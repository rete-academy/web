<template>
  <div class="wrapper">
    <p class="sys-info">
      <span class="copy">
        © 2019 Rete Academy Team.
        Made with <fa icon="heart" /> in Finland.
      </span>
      <span class="social">
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
      </span>
      <span class="version">
        v{{ version }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Footer',

  computed: {
    version() { return process.env.version }
  }
}
</script>
<style scoped>
.social a {
    margin: 0 20px;
}
</style>
