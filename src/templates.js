var fs = require('fs');

module.exports = {
   "nodes-list-view": fs.readFileSync(__dirname + "/../template/view/" + "nodes-list-view.html", "utf8"),
   "node-view": fs.readFileSync(__dirname + "/../template/view/" + "node-view.html", "utf8"),
   "clauses-view": fs.readFileSync(__dirname + "/../template/view/" + "clauses-view.html", "utf8")
};