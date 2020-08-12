require('dotenv').config();

const pkg = require('./package');

module.exports = {
  mode: 'spa',

  telemetry: false,

  env: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    SOCKET_HOST_URL: process.env.SOCKET_HOST_URL || 'http://localhost:8000',
    version: pkg.version,
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
    throttle: 1000,
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
    '@nuxtjs/sentry',
    'nuxt-clipboard2',
  ],

  axios: {
    baseURL: process.env.API_URL || 'http://localhost:8000',
    /* headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }, */
  },

  sentry: {
    config: {}, // Additional config
    dsn: process.env.SENTRY_DSN,
  },

  auth: {
    cookie: false,
    redirect: {
      login: '/login',
      logout: '/',
      home: '/',
      // callback: '/login/callback',
    },
    token: {
      prefix: 'access_token.',
    },
    refresh_token: {
      prefix: 'refresh_token.',
    },
    // scopeKey: 'role',
    strategies: {
      facebook: {
        client_id: process.env.FB_APP_ID,
        display: 'popup',
        scope: ['email', 'public_profile'],
        userinfo_endpoint: process.env.FB_USER_ENDPOINT,
      },
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
    csp: true,
  },
  /* render: {
    csp: {
      reportOnly: true,
      addMeta: true,
      hashAlgorithm: 'sha256',
      unsafeInlineCompatibility: true,
      policies: {
        'default-src': ["'none'"],
        'img-src': [
          "'self'",
          'blob:',
          PRIMARY_HOSTS,
          '*.amazonaws.com',
          '*.google-analytics.com',
        ],
        'worker-src': [
          "'self'",
          'blob:',
          PRIMARY_HOSTS,
          '*.logrocket.io',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          PRIMARY_HOSTS,
          '*.googleapis.com',
        ],
        'font-src': [
          "'self'",
          PRIMARY_HOSTS,
          '*.gstatic.com',
        ],
        'script-src-elem': [
          "'self'",
          "'unsafe-inline'",
          PRIMARY_HOSTS,
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          PRIMARY_HOSTS,
          'sentry.io',
          '*.sentry-cdn.com',
          '*.google-analytics.com',
          '*.logrocket.io',
        ],
        'connect-src': [
          "'self'",
          PRIMARY_HOSTS,
          'sentry.io',
          '*.google-analytics.com',
        ],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': [PRIMARY_HOSTS],
        'report-uri': [
          'https://o130909.ingest.sentry.io/api/5375104/security/?sentry_key=45275bbf095c47eeadeeea9d3432ab07',
        ],
      },
    },
  },
  */

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

  buildModules: [
    ['@nuxtjs/google-analytics', {
      id: 'UA-3449304-35',
    }],
  ],
};
