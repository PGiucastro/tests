var fs = require('fs');

module.exports = {
   "nodes-list-view": fs.readFileSync(__dirname + "/../template/" + "nodes-list-view.html", "utf8"),
   "node-view": fs.readFileSync(__dirname + "/../template/" + "node-view.html", "utf8")
};