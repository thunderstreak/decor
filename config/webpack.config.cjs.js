const merge = require("webpack-merge");
const nodeExternals = require('webpack-node-externals');
const common = require("./webpack.config.base");
const pkg = require("../package.json");

module.exports = merge(common, {
  output: {
    filename: pkg.main,

    libraryTarget: "commonjs2",
    libraryExport: "default"
  },
  // 只需打包组件的逻辑，那些依赖可以等实际生产项目的时候再进行解析或在运行时从外部获取
  externals: [nodeExternals()],
});
