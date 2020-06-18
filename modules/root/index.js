const path = require('path');
exports.default = async function () {
    const state = {
        token: '',
        username: '',
        authenticated: false,
        user: {},
        alert: null
    };
    this.addPlugin({
        src: path.resolve(__dirname, './plugin.js'),
        fileName: 'ces/root.js',
        options: { state }
    });
};
