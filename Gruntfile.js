module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-connect");

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
        }
    });

    grunt.registerTask("default", ["connect"]);
}