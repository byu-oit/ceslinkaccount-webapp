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
    // Ignore HASH of current path, just get path + query
    const currentPath = {
      path: context.route.path,
      query: context.route.query
    };
    switch (state) {
      case authn.STATE_UNAUTHENTICATED:
        window.sessionStorage.setItem('sitePreauthPath', JSON.stringify(currentPath));
        await authn.login();
        break;
      case authn.STATE_ERROR:
        await context.$alert.authentication()
        break
      case authn.STATE_AUTHENTICATED: {
        context.$axios.setToken(token.authorizationHeader);
        console.log(context)
        await context.store.dispatch('root/authenticate', user);
        const prePathString = window.sessionStorage.getItem('sitePreauthPath');
        window.sessionStorage.removeItem('sitePreauthPath');
        if (prePathString) {
          try {
            const prePath = JSON.parse(prePathString);
            if (!isEqual(prePath, currentPath) && prePath.path) {
              context.redirect(prePath.path, prePath.query);
            }
          }
          catch (e) {
            // Intentionally ignoring. If the stored path is malformed JSON, then just stay where we are
          }
        }
      }
    }
  });
}
