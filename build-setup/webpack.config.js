import path from 'path';
import webpack from 'webpack';
import entryPoints from './entry-points';
import ManifestPlugin from 'webpack-manifest-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {webpackLoaderPath as i18nReplacerPath} from 'i18n-replacer';
import {webpackLoaderPath as htmlSourceIncludePath} from 'html-source-include';
import {webpackLoaderPath as flexDirectiveReplacerPath} from 'flex-directive-replacer';
import {
    srcPath,
    distPath,
    buildLanguage,
    isProductionBuildEnvironment,
    manifestName
} from './build-config';

const manifestPlugin = new ManifestPlugin({
    fileName: manifestName
});
const extractCssPlugin = new ExtractTextPlugin({
    filename: 'css/[name].[contenthash].css',
    allChunks: true
});
const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'shared',
    minChunks: 2
});
const uglifyJsPlugin = isProductionBuildEnvironment && new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    parallel: true
});
const contextReplacementPlugin = new webpack.ContextReplacementPlugin(/moment[/\\]locale/, new RegExp(buildLanguage));

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
        extractCssPlugin,
        commonsChunkPlugin,
        contextReplacementPlugin
    ].filter(Boolean),
    module: {
        rules: [{
            test: [
                /src\/.*\.js$/
            ],
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }, {
                loader: 'template-resolver-loader'
            }, {
                loader: i18nReplacerPath,
                options: {
                    preset: 'js'
                }
            }]
        }, {
            test: /css\/\.remote$/,
            use: extractCssPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false,
                        minimize: isProductionBuildEnvironment && {
                            discardComments: {
                                removeAll: true
                            }
                        }
                    }
                }, {
                    loader: 'fetch-resource-loader'
                }]
            })
        }, {
            test: /\.css$/,
            use: extractCssPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false,
                        minimize: isProductionBuildEnvironment && {
                            discardComments: {
                                removeAll: true
                            }
                        }
                    }
                }]
            })
        }, {
            test: /\.scss$/,
            use: extractCssPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false,
                        minimize: isProductionBuildEnvironment && {
                            discardComments: {
                                removeAll: true
                            }
                        },
                        importLoaders: 1
                    }
                }, {
                    loader: 'sass-loader'
                }]
            })
        }, {
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: isProductionBuildEnvironment,
                    ignoreCustomFragments: [
                        /\{\{[\s\S]*?}}/
                    ]
                }
            }, {
                loader: i18nReplacerPath,
                options: {
                    preset: 'html'
                }
            }, {
                loader: flexDirectiveReplacerPath
            }, {
                loader: htmlSourceIncludePath
            }]
        }, {
            test: /\.svg/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: isProductionBuildEnvironment
                }
            }]
        }]
    },
    devtool: isProductionBuildEnvironment
        ? 'nosources-source-map'
        : 'inline-source-map',
    bail: true
};
