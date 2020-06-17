const path = require('path');
exports.default = async function (config) {
  if (!process.env.NUXT_ENV_OAUTH_CLIENT_ID || !process.env.NUXT_ENV_OAUTH_CALLBACK_URL) {
    throw new Error('Missing OAuth config in environment variables')
  }
  this.addPlugin({
    src: path.resolve(__dirname, './plugin.js'),
    fileName: 'implicitgrant.js',
    options: {
      autoRefreshOnTimeout: process.env.NUXT_ENV_AUTO_REFRESH_ON_TIMEOUT || true,
      clientId: process.env.NUXT_ENV_OAUTH_CLIENT_ID,
      callbackUrl: process.env.NUXT_ENV_OAUTH_CALLBACK_URL
    }
  });
};
