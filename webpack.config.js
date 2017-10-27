const path = require('path');

module.exports = {
   entry: {
      demo: './src/main-4-demo.js',
      prod: './src/main-4-prod.js'
   },
   output: {
      filename: '[name]/terms_nodes_generator.js',
      path: __dirname + '/dist'
   },
   module: {
      rules: [
         {
            test: /-view\.html$/,
            use: 'raw-loader'
         }
      ]
   },
   externals: {
      jquery: 'jQuery',
      underscore: '_'
   }
};