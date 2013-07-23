/*global module:false*/
module.exports = function (grunt) {

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['spec/**/*.js']
      }
    },
    clear: {
      tasks: ['clear']
    },
    watch: {
      test: {
        files: [
          'server.js',
          'lib/**/*.js',
          'spec/**/*.js'
        ],
        tasks: [
          'clear',
          'mochaTest'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-clear');

  grunt.registerTask('default', [
    'clear',
    'mochaTest'
  ]);

};
