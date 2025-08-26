const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve( __dirname , 'dist'),
        filename: 'bundle.js',
        clean: true
    },

    module: {rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.js$/i,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options:{
                    presets: ['@babel/preset-env']
                }
            }
        }
    ]},
    plugins: [
        new HtmlWebpackPlugin({title: 'TONGUE - LATEST TECH NEWS',
            template: './index.html'
        })
    ],
    devServer: {
        port: 5000,
        open: true,
        static: path.resolve(__dirname)
    },

};