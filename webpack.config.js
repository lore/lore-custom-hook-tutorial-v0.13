/**
 * Webpack config for the project
 *
 * This file tells webpack how to build your project, and includes instructions for both development and production
 * environments. For an understanding of what each setting is for, see the official webpack documentation:
 *
 * https://webpack.js.org/configuration/
 *
 * If you're new to webpack, you may find this video series by Kent Dodds helpful for getting up to speed quickly:
 * https://egghead.io/courses/using-webpack-for-production-javascript-applications
 */

var path = require('path');
var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var { getIfUtils, removeEmpty } = require('webpack-config-utils');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');
var fs = require('fs');

module.exports = function(env) {
  var { ifProduction, ifNotProduction } = getIfUtils(env.webpack || env);
  var BASENAME = env.basename || '';

  return {
    devtool: ifProduction('source-map', 'eval'),
    entry: {
      main: './index.js',
      vendor: [
        'react',
        'react-dom',
        'react-router'
      ]
    },
    output: {
      filename: ifProduction(
        'bundle.[name].[chunkhash].js',
        'bundle.[name].js'
      ),
      path: path.resolve('dist'),
      pathinfo: ifNotProduction(),
      publicPath: `${BASENAME}/`
    },
    resolve: {
      alias: {
        'react': path.resolve(__dirname, 'node_modules/react')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css/,
          use: ifProduction(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              'postcss-loader'
            ]
          }), [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ])
        },
        {
          test: /\.less$/,
          use: ifProduction(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              'postcss-loader',
              'less-loader'
            ]
          }), [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader',
            'less-loader'
          ])
        },
        {
          test: /\.scss$/,
          use: ifProduction(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              'postcss-loader',
              'sass-loader'
            ]
          }), [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader',
            'sass-loader'
          ])
        },
        {
          test: /\.(png|jpg|jpeg|gif|tif|tiff|bmp|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: ifProduction(
                'assets/images/[name].[hash:8].[ext]',
                'assets/images/[name].[ext]'
              )
            }
          }
        },
        {
          test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: ifProduction(
                'assets/fonts/[name].[hash:8].[ext]',
                'assets/fonts/[name].[ext]'
              )
            }
          }
        },
        {
          test: /\.json/,
          use: 'json-loader'
        }
      ]
    },
    plugins: removeEmpty([
      new webpack.DefinePlugin({
        __LORE_ROOT__: JSON.stringify(__dirname),
        __BASENAME__: JSON.stringify(BASENAME),
        'process.env': {
          'LORE_ENV': JSON.stringify(env.lore || env),
          'NODE_ENV': JSON.stringify(env.webpack || env)
        }
      }),
      new ProgressBarPlugin(),
      new ExtractTextPlugin(ifProduction(
        'styles.[name].[chunkhash].css',
        'styles.[name].css'
      )),
      ifProduction(new ManifestPlugin({
        fileName: 'asset-manifest.json'
      })),
      ifProduction(new webpack.optimize.CommonsChunkPlugin({
        names: [
          'vendor'
        ]
      })),
      ifProduction(new CopyWebpackPlugin([{
        from: 'assets/images',
        to: 'assets/images'
      }])),
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body',
        publicPath: `${BASENAME}/`
      }),
      new FaviconsWebpackPlugin({
        logo: './assets/images/favicon.png',
        prefix: 'favicons-[hash]/',
        emitStats: true,
        statsFilename: 'favicon-manifest.json',
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false
        }
      })
    ]),
    devServer: {
      https: env.https || false,
      host: env.host || 'localhost',
      port: env.port || 3000,
      key: env.key ? fs.readFileSync(env.key) : '',
      cert: env.cert ? fs.readFileSync(env.cert) : '',
      historyApiFallback: {
        index: `${BASENAME}/index.html`,
      }
    }
  };
};
