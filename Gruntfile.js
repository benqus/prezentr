module.exports = function (grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,

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
                    'src/js/Component.js',

                    'src/js/*.js',
                    'src/js/event/Emitter.js',
                    'src/js/view/View.js',

                    'src/js/**/*.js',

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

};