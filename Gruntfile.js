module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,

    uglify: {
      options: {
        banner: "/**\n" +
          " * <%= pkg.name %> - <%= pkg.version %>\n" +
          " * url: <%= pkg.repository.url %>\n" +
          " * license: GPLv3 - https://github.com/benqus/prezentr/blob/master/LICENSE\n" +
          " */\n"
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    concat: {
      options: {
        separator: '\n\n',
        banner: [
          "/**",
          " * <%= pkg.name %> - <%= pkg.version %>",
          " */",
          ""
        ].join("\n")
      },
      dist: {
        src: [
          'utils/intro',

          'src/js/prezentr.js',
          'src/js/merge.js',

          'src/js/EventHub.js',
          'src/js/Component.js',
          'src/js/AnimationQueue.js',
          'src/js/View.js',
          'src/js/Presenter.js',
          'src/js/PresenterGroup.js',
          'src/js/Block.js',

          'utils/outro'
        ],
        dest: 'build/<%= pkg.name %>.js'
      }
    },

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      files: ['build/prezentr.js']
    },

    watch: {
      files: ['src/js/**/*.js'],
      tasks: ['concat', 'jshint']
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask('dev', ['concat', 'jshint', 'watch']);
  grunt.registerTask('deploy', ['concat', 'jshint', 'uglify']);
};