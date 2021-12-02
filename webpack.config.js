const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: ['./src/index.tsx'],
        vendor: ['react', 'react-dom']
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js'
    },
    devtool: "cheap-module-source-map",
    devServer: {
        liveReload: true,
        port: 8080,
        historyApiFallback: true
    },
    optimization: {
        runtimeChunk: 'single'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        alias: {
            "@modules": path.resolve(__dirname, './private_modules/'),
            "@elements": path.resolve(__dirname, './private_modules/elements/'),
            "@global": path.resolve(__dirname, './private_modules/global/'),
            "@rest": path.resolve(__dirname, './src/rest'),
            "@scss": path.resolve(__dirname, './src/scss'),
            "@customElements": path.resolve(__dirname, './src/custom_elements'),
            "@interface": path.resolve(__dirname, './src/interface'),
            "@context": path.resolve(__dirname, './src/context')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  "style-loader",
                  "css-loader",
                  "sass-loader",
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./public/index.html"
        })
    ]
};