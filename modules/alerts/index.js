const path = require('path');
exports.default = async function () {
    this.addPlugin({
        src: path.resolve(__dirname, './plugin.js'),
        fileName: 'ces/alerts.js',
        options: {}
    });
};
