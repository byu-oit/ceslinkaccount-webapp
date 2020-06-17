import * as authn from '@byuweb/browser-oauth'
import importDynamicPolyfill from 'dynamic-import-polyfill'

const config = <%= JSON.stringify(options) %>

export default async (context) => {
  // TODO: If Edge ever natively supports dynamic imports (i.e. "import(xxx)" returns a Promise), then use native
  importDynamicPolyfill.initialize()
  __import__(
    /* webpackIgnore: true */ 'https://cdn.byu.edu/browser-oauth-implicit/latest/implicit-grant.min.js'
  ).then(implicit => implicit.configure(config))

  new authn.AuthenticationObserver(async ({ state, token, user }) => {
    switch (state) {
      case authn.STATE_UNAUTHENTICATED:
        window.sessionStorage.setItem('sitePreauthPath', context.route.fullPath)
        await authn.login()
        break
      case authn.STATE_ERROR:
        await context.$aim.alert.authentication()
        break
      case authn.STATE_AUTHENTICATED: {
        // Set auth token globally in Axios
        context.$axios.setToken(token.authorizationHeader)

        // Save auth info in store
        await context.store.dispatch('root/authenticate', user)

        // Check for pre-auth path
        const prePath = window.sessionStorage.getItem('sitePreauthPath')
        window.sessionStorage.removeItem('sitePreauthPath')
        if (prePath && prePath !== context.route.fullPath) {
          context.redirect(prePath)
        }
      }
    }
  })
}
