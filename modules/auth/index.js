const path = require('path');
exports.default = async function () {
  console.log('AAAAAAAAAAAAAAAAAAA')
  console.log(process.env.NUXT_ENV_OAUTH_CLIENT_ID)
  console.log(process.env.NUXT_ENV_OAUTH_CALLBACK_URL)
  if (!process.env.NUXT_ENV_OAUTH_CLIENT_ID || !process.env.NUXT_ENV_OAUTH_CALLBACK_URL) {
    throw new Error('Missing OAuth config in environment variables')
  }
  this.addPlugin({
    src: path.resolve(__dirname, './plugin.js'),
    fileName: 'ces/auth.js',
    options: {
      autoRefreshOnTimeout: process.env.NUXT_ENV_AUTO_REFRESH_ON_TIMEOUT || true,
      clientId: process.env.NUXT_ENV_OAUTH_CLIENT_ID,
      callbackUrl: process.env.NUXT_ENV_OAUTH_CALLBACK_URL
    }
  });
};
