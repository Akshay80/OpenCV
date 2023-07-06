const WorkerPlugin = require('worker-plugin');

module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  plugins: [
    new WorkerPlugin()
    // other plugins...
  ],
//   webpack: function (config, env) {
//     // set resolve.fallback
//     config.resolve.fallback = {
//       fs: false,
//       path: false,
//       crypto: false,
//     };
//     return config;
//   },
};