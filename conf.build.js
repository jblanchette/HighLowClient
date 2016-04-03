module.exports = {
  build_dir: "build",
  compile_dir: "dist",
  app_files: {
    js: [
      "src/**/*.js"
    ],
    jsunit: ["src/**/*.spec.js"],
    jse2e: ["src/**/*.scenario.js"],
    atpl: ["src/app/**/*.tpl.html"],
    ctpl: ["src/common/**/*.tpl.html"],
    html: ["src/index.html", "src/login-token.html"],
    sass: "src/sass/application.scss",
    svg_icon_dir: "src/assets/icons"
  },
  vendor_files: {
    js: [
      "node_modules/socket.io/index.js",
      "node_modules/lodash/index.js",
      "node_modules/angular/angular.js",
      "node_modules/angular-ui-router/release/angular-ui-router.js",
    ],
    css: [],
    assets: []
  }
};
