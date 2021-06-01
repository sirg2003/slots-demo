const path = require("path");
const WebpackBar = require("webpackbar");
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const paths = require("./paths");

// const resolve = (file) => path.resolve(__dirname, "../", file);
// const isDev = process.env.NODE_ENV === "development";

const baseConfig = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + "/index.js"],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: "[name].bundle.js",
    publicPath: "/",
  },

  resolve: {
    modules: [paths.src, "node_modules"],
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": paths.src,
    },
  },
  watchOptions: {
    ignored: ["node_modules"],
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      {
        // test: /\.(jsx?)$/,
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        // use: {
        //   loader: "babel-loader",
        // },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|m4a)(\?.*)?$/,
        loader: "url-loader",
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
      },
    ],
  },
  plugins: [
    new WebpackBar({
      name: "Demo",
      profile: false,
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      // CANVAS_RENDERER: JSON.stringify(true),
      // WEBGL_RENDERER: JSON.stringify(false),
      // PLUGIN_FBINSTANT: JSON.stringify(false),
      // "typeof SHADER_REQUIRE": JSON.stringify(false),
      // "typeof CANVAS_RENDERER": JSON.stringify(true),
      // "typeof WEBGL_RENDERER": JSON.stringify(false),
      // "typeof EXPERIMENTAL": JSON.stringify(false),
      // "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
      // "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
    }),
  ],
};

module.exports.config = baseConfig;
