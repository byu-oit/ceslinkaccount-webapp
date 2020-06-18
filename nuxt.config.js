require('dotenv').config()
export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s',
    title: 'CES Link Account',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'This is for the CES linking account thingy'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.byu.edu/byu-theme-components/2.x.x/byu-theme-components.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.byu.edu/theme-fonts/1.x.x/ringside/fonts.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.byu.edu/theme-fonts/1.x.x/public-sans/fonts.css'
      }
    ],
    script: []
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#002E5D' },
  /*
   ** Global CSS
   */
  css: ['~/assets/style/app.sass', '~/assets/style/page-transition.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
    // '@byu-oit/aim-nuxt-builder',
    // '@byu-oit/sis-vue-nuxt'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '~/modules/auth/index.js'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: '#002E5D',
          secondary: '#666666',
          accent: '#0062B8',
          error: '#A3082A',
          info: '#006073',
          success: '#10A170',
          warning: '#FFB700',
          light: '#FAFAFA'
        }
      }
    }
  },
  /*
   ** AIM module configuration
   */
  aim: {
    routes: {
      classic: true
    },
    core: {
      clientId: process.env.NUXT_ENV_OAUTH_CLIENT_ID,
      callbackUrl: process.env.NUXT_ENV_OAUTH_CALLBACK_URL,
      autoRefreshOnTimeout: process.env.NUXT_ENV_AUTO_REFRESH_ON_TIMEOUT
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config) {
      /*
       ** TODO SIS Vue Library should precompile templates during build
       ** Doc: https://github.com/nuxt/nuxt.js/issues/1142#issuecomment-317272538
       */
      config.resolve.alias.vue = 'vue/dist/vue.common'
    }
  }
}
