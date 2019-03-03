require('dotenv').config()

const pkg = require('./package')

module.exports = {
    mode: 'universal',

    env: {
        version: pkg.version
    },

    axios: {
        baseURL: process.env.API_URL || 'http://localhost:8000'
    },

    head: {
        title: 'Rete Academy',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    loading: {
        color: '#FFEB3B',
        height: '5px',
        continuous: true
    },

    css: [
        'element-ui/lib/theme-chalk/index.css'
    ],

    plugins: [ // load before mounting the App
        // '@/plugins/axios',
        '@/plugins/element-ui',
        '@/plugins/filters',
        '@/plugins/fontawesome'
    ],

    modules: [
    // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/auth',
        '@nuxtjs/axios',
        '@nuxtjs/dotenv',
        '@nuxtjs/pwa'
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

    router: {
        // Set up auth module global
        middleware: ['auth']
    },

    server: {
        // port: 8080, // default: 3000
        timing: false
    },

    build: {
        transpile: [/^element-ui/],
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
