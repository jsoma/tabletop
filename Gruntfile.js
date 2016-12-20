'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    uglify: {
      options: {
          mangle: false,
          quoteStyle: 1
      },
      tabletop: {
        files: {
          'src/tabletop.min.js': ['src/tabletop.js']
        }
      }
    },
    connect: {
      testing: {
        options: {
          port: 8080
        }
      },
      secure: {
        options: {
          port: 8081,
          keepalive: true,
          protocol: 'https'
        }
      }
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          'src/{,*/}*.js',
          '!src/{,*/}*.min.js',
        ]
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'uglify', 'connect']);
};