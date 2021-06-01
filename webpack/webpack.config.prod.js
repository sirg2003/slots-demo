// const path = require("path");
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base').config;
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const DROP_CONSOLE = true;
const MINIFY_HTML = true;
const MINIMIZE = true;

const paramMinifyHtml = MINIFY_HTML
  ? {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      //   useShortDoctype: true,
      //   //
      //   html5: true,
      //   minifyCSS: true,
      //   minifyJS: true,
      //   minifyURLs: true,
      removeEmptyAttributes: true,
    }
  : {};

const prodConfig = merge(webpackBaseConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'bundle.min.js',
  },
  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCSSExtractPlugin.loader,
          // translates CSS into CommonJS modules
          // {loader: 'css-loader', options: {sourceMap: true, importLoaders: 1, modules: true }},
          {
            loader: 'css-loader',
            // https://github.com/taniarascia/webpack-boilerplate/issues/46
            options: { sourceMap: false, importLoaders: 1, modules: false },
          },
          { loader: 'postcss-loader', options: { sourceMap: false } },
          // { loader: "sass-loader", options: { sourceMap: false } },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    minimize: MINIMIZE,
    usedExports: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          safe: true,
          map: { inline: false },
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
      new TerserPlugin({
        sourceMap: false,
        // extractComments: "all",
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: 'extracted-comments.js',
          banner: (licenseFile) => {
            //return `License information can be found in ${licenseFile}`;
            return '';
          },
        },
        terserOptions: {
          ecma: 5,
          warnings: false,
          parse: {},
          compress: { drop_console: DROP_CONSOLE },
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          // extractComments: true,
          // Deprecated
          output: { comments: false },
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: true,
          // mangle: { module: true },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      // filename: "[name].css",
    }),
    new HTMLWebpackPlugin({
      template: 'src/template.html',
      filename: 'index.html',
      // hash: true,
      // minify: false,
      inject: true,
      inlineSource: '.(js|css)$',
      minify: paramMinifyHtml,
    }),
    // new HtmlWebpackInlineSourcePlugin(),
  ],
});

module.exports = prodConfig;
