// Karma configuration
// Generated on Fri Jul 21 2017 09:34:42 GMT+0200 (CEST)

module.exports = function(config) {
   config.set({

      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '',

      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ["jasmine"],

      plugins: [
         require("karma-jasmine"),
         require("karma-webpack"),
         require("karma-verbose-reporter"),
         require("karma-chrome-launcher")
      ],

      webpack: {
         module: {
            rules: [
               {
                  test: /-view\.html$/,
                  use: 'raw-loader'
               }
            ]
         }
      },

      // list of files / patterns to load in the browser
      files: [

         /* json fixtures */
         {
            pattern: 'mock-data/*.json',
            watched: true,
            served: true,
            included: false
         },

         /* tests */
         'test/**/*-spec.js'
      ],

      // list of files to exclude
      exclude: [
      ],

      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
         'test/**/*.js': ['webpack']
      },

      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['progress', 'verbose'],

      // web server port
      port: 9876,

      // enable / disable colors in the output (reporters and logs)
      colors: true,

      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: true,

      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['Chrome'],

      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: false,

      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity
   });
};