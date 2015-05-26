"use strict";
module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.initConfig({
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
          protocol: "https"
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
          'src/{,*/}*.js'
        ]
      },
      // test: { // TODO re-enable once unit tests are done.
      //   options: {
      //     jshintrc: 'test/.jshintrc'
      //   },
      //   src: ['test/spec/{,*/}*.js']
      // }
    }
  });

  grunt.registerTask("default", ["jshint", "connect"]);
};
