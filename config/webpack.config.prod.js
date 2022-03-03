const webpack = require('webpack')
const path = require('path');
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const TerserPlugin = require("terser-webpack-plugin")

const env = process.env.NODE_ENV
const isProduction = env === 'production'

module.exports = merge(baseConfig, {
  entry: './index.js',
  mode: isProduction ? 'production' : 'development',
  output: {
    filename: isProduction ? 'decor-core.production.min.js' : 'decor-core.development.js',
    path: path.resolve('./dist'),
    library: 'decor-core',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  optimization:{
    minimizer: [
      new TerserPlugin()
    ]
  }
})
