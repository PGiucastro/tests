const fs = require('fs');

const PATH = __dirname + "/../../metis/";

function copyFile(src, dest) {

   let readStream = fs.createReadStream(src);

   readStream.once('error', (err) => {
      console.log(err);
   });

   readStream.once('end', () => {

   });

   readStream.pipe(fs.createWriteStream(dest));
}

if (fs.existsSync(PATH)) {
   copyFile(__dirname + "/../build/terms-nodes-generator-bundle.js", PATH + "/app/assets/javascripts/admin/terms_nodes_generator_bundle.js");
   copyFile(__dirname + "/../build/terms-nodes-generator-bundle.css", PATH + "/app/assets/stylesheets/admin/terms_nodes_generator_bundle.css");
} else {
   console.log('project `metis` does not exist or is not a sinbling of the current project');
}
