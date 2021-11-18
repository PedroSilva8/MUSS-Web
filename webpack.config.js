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
    devtool: "source-map",
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
            "@customModules": path.resolve(__dirname, './src/custom_modules'),
            "@customElements": path.resolve(__dirname, './src/custom_modules/custom_elements')
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