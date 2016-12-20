module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');

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
                    protocol: 'https'
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            tabletop: {
              files: {
                'src/tabletop.min.js': ['src/tabletop.js']
              }
            }
        }
    });

    grunt.registerTask("default", ["uglify","connect"]);
}