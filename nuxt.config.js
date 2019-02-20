const pkg = require('./package')

module.exports = {
    mode: 'universal',

    /*
  ** Headers of the page
  */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    /*
  ** Customize the progress-bar color
  */
    loading: { color: '#fff' },

    /*
  ** Global CSS
  */
    css: [
        'element-ui/lib/theme-chalk/index.css'
    ],

    /*
  ** Plugins to load before mounting the App
  */
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/filters'
    ],

    /*
  ** Nuxt.js modules
  */
    modules: [
    // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        '@nuxtjs/auth'
    ],
    auth: {
        redirect: {
            login: '/login',
            logout: '/',
            callback: '/login',
            home: '/'
        },
        strategies: {
            local: {
                endpoints: {
                    login: { url: '/oauth/token', method: 'post', propertyName: 'access_token' },
                    user: { url: '/api/users/profile', method: 'get', propertyName: 'message.profile' },
                    logout: false
                }
            }
        }
    },
    /*
  ** Axios module configuration
  */
    axios: {
    // See https://github.com/nuxt-community/axios-module#options
        baseUrl: 'http://localhost:3000'
    },

    router: {
        // Set up auth module global
        middleware: ['auth']
    },
    server: {
        port: 8080, // default: 3000
        timing: false
    },
    /*
  ** Build configuration
  */
    build: {
        transpile: [/^element-ui/],

        /*
    ** You can extend webpack config here
    */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    }
}
