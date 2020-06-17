const importDynamicPolyfill = require('dynamic-import-polyfill')

export default async (context) => {
  // TODO: If Edge ever natively supports dynamic imports (i.e. "import(xxx)" returns a Promise), then use native
  importDynamicPolyfill.initialize()
  __import__(
    /* webpackIgnore: true */ 'https://cdn.byu.edu/browser-oauth-implicit/latest/implicit-grant.min.js'
  ).then(implicit => implicit.configure({ autoRefreshOnTimeout: true, clientId: context.env.NUXT_ENV_OAUTH_CLIENT_ID, callbackUrl: context.env.NUXT_ENV_OAUTH_CALLBACK_URL }))
}

