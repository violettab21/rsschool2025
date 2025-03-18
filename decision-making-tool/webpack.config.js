const path = require('path');

const mode = 'production';

const devtool = 'source-map';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
module.exports = {
    mode,
    devtool,
    devServer: {
        open: true,
        historyApiFallback: true,
    },
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[contenthash].js',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: 'main.[contenthash].css',
        }),
        /*new ESLintPlugin({ extensions: 'ts' }),*/
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')],
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: { mode: 'icss' },
                        },
                    },
                    'sass-loader',
                ],
            },

            {
                test: /\.jpe?g$|\.svg$|\.png$|\.ico$|\.mp3$/,
                use: ['file-loader'],
            },
        ],
    },
};
