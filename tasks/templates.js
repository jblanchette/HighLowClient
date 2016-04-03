var filterForJS = function (files) {
  return files.filter(function (file) {
    return file.match(/\.js$/);
  });
};

var filterForCSS = function (files) {
  return files.filter(function (file) {
    return file.match(/\.css$/);
  });
};

module.exports = function (grunt) {
  grunt.registerMultiTask("templates", "Process template", function () {
    var dirRE = new RegExp("^" + grunt.config("build_dir") + "\/", "g");
    var jsFiles = filterForJS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, "");
    });
    var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, "");
    });

    var templateData = {
      scripts: jsFiles,
      settings: this.options(),
      styles: cssFiles,
      version: grunt.config("pkg.version")
    };

    grunt.file.copy("src/" + this.data.file, this.data.dir + "/" + this.data.file, {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: templateData
        });
      }
    });
    grunt.log.writeln("Built templates.");
  });
};
