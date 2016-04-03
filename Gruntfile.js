var _ = require("lodash");

module.exports = function (grunt) {
  grunt.loadTasks("tasks");
  require("load-grunt-tasks")(grunt);

  var userConfig = require("./conf.build.js");

  var taskConfig = {
    pkg: grunt.file.readJSON("package.json"),

    meta: {
      banner: "HLJ"
    },

    clean: [
      "<%= build_dir %>",
      "<%= compile_dir %>"
    ],

    connect: {
      options: {
        hostname: "*",
        port: grunt.option("http-port") || 4001 // SauceLabs only proxies certain ports. (4001 is one.)
      },

      compile: {
        options: {
          base: "<%= compile_dir %>"
        }
      },

      watch: {
        options: {
          base: "<%= build_dir %>",
          livereload: 40092
        }
      }
    },

    copy: {
      build_app_assets: {
        files: [
          {
            src: ["**"],
            dest: "<%= build_dir %>/assets/",
            cwd: "src/assets",
            expand: true
          }
        ]
      },
      build_vendor_assets: {
        files: [
          {
            src: ["<%= vendor_files.assets %>"],
            dest: "<%= build_dir %>/assets/",
            cwd: ".",
            expand: true,
            flatten: true
          }
        ]
      },
      build_appjs: {
        files: [
          {
            src: ["<%= app_files.js %>"],
            dest: "<%= build_dir %>/",
            cwd: ".",
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: ["<%= vendor_files.js %>"],
            dest: "<%= build_dir %>/",
            cwd: ".",
            expand: true
          }
        ]
      },
      build_vendorjson: {
        files: [
          {
            src: ["<%= vendor_files.json %>"],
            dest: "<%= build_dir %>/",
            cwd: ".",
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: ["**", "!*.css"],
            dest: "<%= compile_dir %>/assets",
            cwd: "<%= build_dir %>/assets",
            expand: true
          }
        ]
      },
      build_static: {
        files: [{
          src: ["src/robots.txt"],
          dest: "<%= build_dir %>/robots.txt",
          expand: false
        }]
      },
      compile_static: {
        files: [{
          src: ["src/robots.txt"],
          dest: "<%= compile_dir %>/robots.txt",
          expand: false
        }]
      }
    },

    exec: {
      options: {
        stdout: true,
        stderr: true,
        stdin: false
      }
    },

    shell: {
      options: {
        stdout: true,
        stderr: true,
        stdin: false
      }
    },

    sass: {
      build: {
        options: {
          includePaths: "<%= vendor_files.sass_include_dirs %>"
        },
        files: {
          "<%= build_dir %>/assets/application.css": "<%= app_files.sass %>",
          "<%= build_dir %>/assets/menu-app.css": "<%= menu_files.sass %>"
        }
      }
    },

    concat: {
      build_css: {
        options: {
          banner: "<%= meta.banner %>"
        },
        src: [
          "<%= vendor_files.css %>",
          "<%= build_dir %>/assets/application.css"
        ],
        dest: "<%= build_dir %>/assets/application.css"
      },
      build_menu_css: {
        options: {
          banner: "<%= meta.banner %>"
        },
        src: [
          "<%= build_dir %>/assets/menu-app.css"
        ],
        dest: "<%= build_dir %>/assets/menu-app.css"
      },
      compile_app_js: {
        options: {
          banner: "<%= meta.banner %>"
        },
        files: {
          "<%= compile_dir %>/assets/vendor.js": ["<%= vendor_files.js %>"],
          "<%= compile_dir %>/assets/app.js": [
            "<%= build_dir %>/src/**/*.js",
            "<%= build_dir %>/assets/cldr-data.js",
            "<%= html2js.app.dest %>",
            "<%= html2js.common.dest %>"
          ]
        }
      },
      build_menu_js: {
        options: {
          banner: "<%= meta.banner %>"
        },
        files: {
          "<%= build_dir %>/assets/menu-vendor.js": ["<%= menu_files.vendor_js %>"],
          "<%= build_dir %>/assets/menu-app.js": [
            "<%= menu_files.js %>",
            "<%= html2js.menu_app.dest %>",
            "/assets/cldr-data.js",
            "<%= html2js.menu_common.dest %>"
          ]
        }
      },
      compile_menu_js: {
        options: {
          banner: "<%= meta.banner %>"
        },
        files: {
          "<%= compile_dir %>/assets/menu-vendor.js": ["<%= menu_files.vendor_js %>"],
          "<%= compile_dir %>/assets/menu-app.js": [
            "<%= menu_files.js %>",
            "/assets/cldr-data.js",
            "<%= html2js.menu_app.dest %>",
            "<%= html2js.menu_common.dest %>"
          ]
        }
      }
    },

    cssmin: {
      compile: {
        src: ["<%= build_dir %>/assets/application.css"],
        dest: "<%= compile_dir %>/assets/app.css"
      },

      compile_menu: {
        src: ["<%= build_dir %>/assets/menu-app.css"],
        dest: "<%= compile_dir %>/assets/menu-app.css"
      }
    },

    html2js: {
      app: {
        options: {
          base: "src/app"
        },
        src: ["<%= app_files.atpl %>"],
        dest: "<%= build_dir %>/templates-app.js"
      },

      common: {
        options: {
          base: "src/common"
        },
        src: ["<%= app_files.ctpl %>"],
        dest: "<%= build_dir %>/templates-common.js"
      },

      menu_app: {
        options: {
          base: "src/app",
          module: "templates-menu-app"
        },
        src: ["<%= menu_files.templates_app %>"],
        dest: "<%= build_dir %>/templates-menu-app.js"
      },

      menu_common: {
        options: {
          base: "src/common",
          module: "templates-menu-common"
        },
        src: ["<%= menu_files.templates_common %>"],
        dest: "<%= build_dir %>/templates-menu-common.js"
      }
    },

 
    ngAnnotate: {
      compile: {
        files: [
          {
            src: ["<%= app_files.js %>"],
            cwd: "<%= build_dir %>",
            dest: "<%= build_dir %>",
            expand: true
          }
        ]
      }
    },

    uglify: {
      compile: {
        options: {
          banner: "<%= meta.banner %>"
        },
        files: {
          "<%= compile_dir %>/assets/vendor.js": "<%= compile_dir %>/assets/vendor.js",
          "<%= compile_dir %>/assets/menu-vendor.js": "<%= compile_dir %>/assets/menu-vendor.js"
        }
      }
    },

    templates: {
      options: {
        get version () {
          // This is an ES5 getter to defer execution until we actually try to
          // build the template; otherwise we get this config value while grunt
          // is configuring its tasks, before we've run anything, which means
          // that we don't actually have a pkg.version value yet.
          return grunt.config("pkg.version");
        }
      },
      build_index: {
        dir: "<%= build_dir %>",
        file: "index.html",
        src: [
          "<%= vendor_files.js %>",
          "<%= html2js.common.dest %>",
          "<%= html2js.app.dest %>",
          "<%= build_dir %>/src/**/*.js",
          "<%= build_dir %>/assets/cldr-data.js",
          "<%= build_dir %>/assets/application.css"
        ]
      },
      compile_index: {
        dir: "<%= compile_dir %>",
        file: "index.html",
        src: [
          "<%= compile_dir %>/assets/vendor.js",
          "<%= compile_dir %>/assets/app.js",
          "<%= cssmin.compile.dest %>"
        ]
      },

      build_login: {
        dir: "<%= build_dir %>",
        file: "login-token.html",
        src: []
      },
      compile_login: {
        dir: "<%= compile_dir %>",
        file: "login-token.html",
        src: []
      },

      build_settings: {
        dir: "<%= build_dir %>/src",
        file: "app/settings.js",
        src: []
      },
      compile_settings: {
        dir: "<%= compile_dir %>/src",
        file: "app/settings.js",
        src: []
      }
    },

    revmd5: {
      options: {
        relativePath: "./",
        safe: true
      },
      compile: {
        src: ["<%= compile_dir %>/**/*.html", "<%= compile_dir %>/**/*.css"]
      }
    },

    delta: {
      options: {
        livereload: 40092,
        spawn: false,
        interrupt: !grunt.option("no-watch-interrupt")
      },

      html: {
        files: ["<%= app_files.html %>"],
        tasks: ["templates:build_index", "templates:build_login"]
      },

      sass: {
        files: [
          "src/sass/**/*.scss"
        ],
        tasks: ["sass:build"]
      },

      jssrc: {
        files: ["<%= app_files.js %>"],
        tasks: ["karma:watch:run", "copy:build_appjs", "templates:build_settings", "templates:build_index"]
      },

      assets: {
        files: ["src/assets/**/*"],
        tasks: ["copy:build_app_assets"]
      },

      gruntfile: {
        files: ["Gruntfile.js", "conf.build.js"],
        tasks: [],
        options: { livereload: false }
      }
    }
  };

  grunt.renameTask("watch", "delta");

  delete taskConfig.delta.jsunit;
  delete taskConfig.delta.jse2e;
  taskConfig.delta.jssrc.tasks = ["copy:build_appjs", "templates:build_settings", "concat:build_menu_js", "templates:build_index"];

  grunt.registerTask("watch", [
    "build",
    "connect:watch",
    "delta"
  ]);

  grunt.registerTask("skip", [
    "build",
    "connect:watch",
    "delta"
  ]);

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  grunt.registerTask("build", [
    "clean",
    "html2js",
    "sass:build",
    "concat:build_css",
    "concat:build_menu_css",
    "copy:build_app_assets",
    "copy:build_vendor_assets",
    "compile-json",
    "copy:build_appjs",
    "copy:build_vendorjs",
    "templates:build_settings",
    "copy:build_static",
    "templates:build_index",
    "templates:build_login"
  ]);

  grunt.registerTask("reckless-version-metadata", "Backfill placeholder Git revision into environment variable for reckless builds", function () {
    if (!process.env.WHOOP_WEB_GIT_REVISION) {
      process.env.WHOOP_WEB_GIT_REVISION = "reckless_build";
    }
  });

  grunt.registerTask("compile-json", function () {
    var jsonFiles = grunt.config.get("vendor_files.json");
    var data = {};

    jsonFiles.forEach(function (file) {
      var fileKey = _.camelCase(_.last(file.split("/"))).replace(".json", "");
      data[fileKey] = grunt.file.readJSON(file);
    });
    var jsonData = "angular.module('whoop.cldrData', []).constant('cldrData', " + JSON.stringify(data) + ");";

    var buildDir = grunt.config.get("build_dir") + "/assets/";
    grunt.file.write(buildDir + "cldr-data.js", jsonData);
  });

  grunt.registerTask("reckless-compile", [
    "build",
    "copy:compile_assets",
    "copy:compile_static",
    "ngAnnotate",
    "cssmin",
    "templates:compile_settings",
    "concat:compile_app_js",
    "concat:compile_menu_js",
    "uglify",
    "templates:compile_index",
    "templates:compile_login",
    "revmd5"
  ]);

  grunt.registerTask("compile", [
    "clean",
    "build",
    "shell:install_webdriver",
    "protractor_webdriver",
    "karma:once",
    "copy:compile_assets",
    "copy:compile_static",
    "ngAnnotate",
    "cssmin",
    "templates:compile_settings",
    "concat:compile_app_js",
    "concat:compile_menu_js",
    "uglify",
    "templates:compile_index",
    "templates:compile_login",
    "revmd5",
    "connect:compile",
    "exec:run_tests"
  ]);

  grunt.registerTask("compile-sync", [
    "clean",
    "build",
    "copy:compile_assets",
    "copy:compile_static",
    "ngAnnotate",
    "cssmin",
    "templates:compile_settings",
    "concat:compile_app_js",
    "concat:compile_menu_js",
    "uglify",
    "templates:compile_index",
    "templates:compile_login",
    "revmd5",
    "connect:compile",
    "keepalive"
  ]);

  grunt.registerTask("run-regression", [
    "clean",
    "build",
    "karma:once",
    "testconfig",
    "exec:run_tests"
  ]);

  grunt.registerTask("run-scenario", [
    "testconfig",
    "exec:run_tests"
  ]);

  grunt.registerTask("run-tests", [
    "testconfig",
    (grunt.option("e2e-local") ? "shell:protractor_watch" : "exec")
  ]);

  grunt.registerTask("compile-test", ["compile", "keepalive"]);

  grunt.registerTask("default", ["watch"]);
};
