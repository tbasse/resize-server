/*global module:false*/
module.exports = function (grunt) {

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'dot'
        },
        src: ['spec/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', [
    'mochaTest'
  ]);

};
