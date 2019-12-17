import path from 'path';
import webpack from 'webpack';
import entryPoints from './entry-points';
import ManifestPlugin from 'webpack-manifest-plugin';
import {webpackLoaderPath as i18nReplacerPath} from 'i18n-replacer';
import {webpackLoaderPath as htmlSourceIncludePath} from 'html-source-include';
import {
    srcPath,
    distPath,
    isProductionBuildEnvironment,
    manifestName
} from './build-config';

// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const manifestPlugin = new ManifestPlugin({
    fileName: manifestName
});
const uglifyJsPlugin = isProductionBuildEnvironment && new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    parallel: true
});

module.exports = {
    entry: entryPoints,
    output: {
        path: path.join(process.cwd(), distPath),
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js'
    },
    resolve: {
        modules: [
            path.join(process.cwd(), srcPath),
            path.join(process.cwd(), 'node_modules')
        ]
    },
    plugins: [
        manifestPlugin,
        uglifyJsPlugin,
        // new BundleAnalyzerPlugin({
        //     openAnalyzer: false
        // })
    ].filter(Boolean),
    module: {
        rules: [{
            test: [
                /src\/.*\.json$/
            ],
            use: [{
                loader: 'json-loader'
            }, {
                loader: i18nReplacerPath,
                options: {
                    preset: 'json'
                }
            }]
        }, {
            test: [
                /src\/.*\.js$/
            ],
            use: [{
                loader: i18nReplacerPath,
                options: {
                    preset: 'js'
                }
            }, {
                loader: htmlSourceIncludePath
            }]
        }, {
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: isProductionBuildEnvironment
                }
            }, {
                loader: i18nReplacerPath,
                options: {
                    preset: 'html'
                }
            }]
        }]
    },
    devtool: isProductionBuildEnvironment
        ? 'nosources-source-map'
        : 'inline-source-map',
    bail: true
};
