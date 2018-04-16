const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: './app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    context: path.resolve(__dirname, 'src'),
    module: {
        rules: [
            // babel-loader with 'env' preset
            { test: /\.js$/, include: /src/, exclude: /node_modules/, use: { loader: "babel-loader", options: { presets: ['env'] } } },
            // html-loader
            { test: /\.html$/, use: ['html-loader'] },
            // css-loader
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            // file-loader(for images)
            { test: /\.(jpg|png|gif|svg)$/, use: [{ loader: 'file-loader', options: { name: '[name].[ext]', outputPath: './' } }] },
            // this prevents a bug with @turf modules causing erroring
            { test: /\.mjs$/, include: /node_modules/, type: "javascript/auto", },
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}

module.exports = config;