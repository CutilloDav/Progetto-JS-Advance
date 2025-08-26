const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve( __dirname , 'dist'),
        filename: 'bundle.js'
    },
    mode: 'production',

    module: {rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        }
    ]},
    devServer: {
        port: 5000,
        open: true,
        static: path.resolve(__dirname)
    },
    plugins: [
        new HtmlWebpackPlugin({title: 'Applicazione webpack'})
    ],
};