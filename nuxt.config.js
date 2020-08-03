require('dotenv').config();

const pkg = require('./package');

const PRIMARY_HOSTS = 'app.rete.academy';

module.exports = {
  mode: 'spa',

  telemetry: false,

  env: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    SOCKET_HOST_URL: process.env.SOCKET_HOST_URL || 'http://localhost:8000',
    version: pkg.version,
  },

  axios: {
    baseURL: process.env.API_URL || 'http://localhost:8000',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
  },

  head: {
    title: 'Rete Academy',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  loading: {
    color: '#FF9900',
    height: '2px',
    duration: 3000,
    continuous: true,
  },

  css: [
    'element-ui/lib/theme-chalk/index.css',
  ],

  // These plugins load before mounting the App
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/filters',
    '@/plugins/fontawesome',
    // '@/plugins/axios',
    // '@/plugins/chat-scroll.js',
    /*
    {
      src: '@/plugins/socket.io.js',
      ssr: false, // <-- this line is required
    },
    */
  ],

  modules: [
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/google-analytics',
    '@nuxtjs/pwa',
    'nuxt-clipboard2',
  ],

  auth: {
    cookie: false,
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/',
    },
    token: {
      prefix: 'access_token.',
    },
    refresh_token: {
      prefix: 'refresh_token.',
    },
    // scopeKey: 'role',
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/oauth/token',
            method: 'post',
            propertyName: 'access_token',
          },
          user: {
            url: '/api/users/profile',
            method: 'get',
            propertyName: 'message.profile',
          },
          logout: false,
        },
      },
    },
  },

  render: {
    csp: {
      reportOnly: true,
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': ["'self'"],
        'img-src': ['https:', '*.google-analytics.com'],
        'worker-src': ["'self'", 'blob:', PRIMARY_HOSTS, '*.logrocket.io'],
        'style-src': ["'self'", "'unsafe-inline'", PRIMARY_HOSTS],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          PRIMARY_HOSTS,
          'sentry.io',
          '*.sentry-cdn.com',
          '*.google-analytics.com',
          '*.logrocket.io',
        ],
        'connect-src': [PRIMARY_HOSTS, 'sentry.io', '*.google-analytics.com'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': [PRIMARY_HOSTS],
        'report-uri': [
          'https://sentry.io/api/<project>/security/?sentry_key=<key>',
        ],
      },
    },
  },

  router: {
    // Set up auth module global
    middleware: ['auth'],
  },

  googleAnalytics: {
    id: 'UA-3449304-35',
    dev: false,
  },

  server: {
    // port: 8080, // default: 3000
    timing: false,
  },

  serverMiddleware: [
    // Will register redirect-ssl npm package
    'redirect-ssl',
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
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
