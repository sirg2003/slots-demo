const merge = require("webpack-merge");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpackBaseConfig = require("./webpack.config.base").config;
const webpack = require("webpack");
const paths = require("./paths");

const devConfig = merge(webpackBaseConfig, {
  mode: "development",
  devServer: {
    contentBase: paths.build,
    watchContentBase: true,
    open: false,
    compress: true,
    hot: true,
    port: 8000,
  },
  watch: true,
  // devtool: "eval-source-map",
  devtool: "cheap-module-eval-source-map",
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      // {
      //   test: /\.(jsx?)$/,
      //   loader: "babel-loader",
      //   exclude: /node_modules/,
      // },
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(scss|css)$/,
        use: [
          "vue-style-loader",
          // inject CSS to page
          "style-loader",
          // translates CSS into CommonJS modules
          {
            loader: "css-loader",
            // https://github.com/taniarascia/webpack-boilerplate/issues/46
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          // Run post css actions
          { loader: "postcss-loader", options: { sourceMap: false } },
          // { loader: "sass-loader", options: { sourceMap: false } },
        ],
      },
    ],
  },
  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      template: "src/template.html",
      filename: "index.html",
      title: "Demo",
      // hash: true,
      // minify: false,
    }),
  ],
});

module.exports = devConfig;
