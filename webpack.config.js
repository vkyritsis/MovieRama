var path = require('path');

module.exports = {
    entry: './app/main.js',
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader'
                },
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        port: 3000
    }
};