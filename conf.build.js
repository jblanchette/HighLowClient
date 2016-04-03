module.exports = {
  build_dir: "build",
  app_files: {
    js: [
      "src/**/*.js"
    ],
    html: ["src/index.html"],
    sass: ["src/sass/application.scss"]
  },
  vendor_files: {
    js: [
      "node_modules/socket.io/index.js",
      "node_modules/lodash/index.js",
      "node_modules/angular/angular.js",
      "node_modules/angular-ui-router/release/angular-ui-router.js",
    ]
  }
};
