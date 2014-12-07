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
        jshint: {
          options: {
            reporter: require('jshint-stylish')
          },
          all: ['Gruntfile.js', 'src/**/*.js']
        }
    });

    grunt.registerTask("default", ["connect"]);
};
