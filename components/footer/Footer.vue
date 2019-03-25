<template>
    <div class="wrapper">
        <p class="sys-info">
            <span class="copy">
                © 2019 Rete Academy Team.
                Made with <fa icon="heart" /> in Finland.
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
