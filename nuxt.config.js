require('dotenv').config()

const pkg = require('./package')

module.exports = {
    mode: 'universal',

    env: {
        version: pkg.version,
        SOCKET_HOST_URL: process.env.SOCKET_HOST_URL || 'http://localhost:8000'
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
        duration: 1000,
        continuous: true
    },

    css: [
        'element-ui/lib/theme-chalk/index.css'
    ],

    // These plugins load before mounting the App
    plugins: [
        // '@/plugins/axios',
        '@/plugins/element-ui',
        '@/plugins/filters',
        '@/plugins/fontawesome',
        '@/plugins/chat-scroll.js',
        {
            src: '@/plugins/socket.io.js',
            ssr: false // <-- this line is required
        }
    ],

    modules: [
        '@nuxtjs/auth',
        '@nuxtjs/axios',
        '@nuxtjs/dotenv',
        '@nuxtjs/google-analytics',
        '@nuxtjs/pwa',
        'nuxt-clipboard2'
    ],

    auth: {
        redirect: {
            login: '/login',
            logout: '/',
            callback: '/login',
            home: '/'
        },
        token: {
            prefix: 'access_token.'
        },
        refresh_token: {
            prefix: 'refresh_token.'
        },
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/oauth/token',
                        method: 'post',
                        propertyName: 'access_token'
                    },
                    user: {
                        url: '/api/users/profile',
                        method: 'get',
                        propertyName: 'message.profile'
                    },
                    logout: false
                }
            }
        }
    },

    router: {
        // Set up auth module global
        middleware: ['auth']
    },

    googleAnalytics: {
        id: 'UA-3449304-35',
        dev: false
    },

    server: {
        // port: 8080, // default: 3000
        timing: false
    },

    serverMiddleware: [
        // Will register redirect-ssl npm package
        'redirect-ssl'
    ],

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
