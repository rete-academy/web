<template>
  <div class="wrapper">
    <div class="sys-info">
      <div class="copy">
        © 2020 Rete Academy.
        Made with <fa icon="heart" /> in Finland.
      </div>

      <div class="social">
        <a
          href="https://github.com/rete-academy"
          target="_blank"
        >
          <fa :icon="['fab', 'github']" />
          rete-academy
        </a>
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
      <!--div>
        <select v-model="$colorMode.preference">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div -->
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

<style>
.social a {
    margin: 0 20px;
}

/* body {
  background-color: #fff;
  color: rgba(0,0,0,0.8);
}
.dark-mode body {
  background-color: #1A1C20;
  color: #ebf4f1;
} */
</style>
