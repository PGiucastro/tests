var fs = require('fs');

module.exports = {
   "nodes-list-view": fs.readFileSync(__dirname + "/../template/view/nodes-list-view.html", "utf8"),
   "node-view": fs.readFileSync(__dirname + "/../template/view/node-view.html", "utf8"),
   "clauses-view": fs.readFileSync(__dirname + "/../template/view/clauses-view.html", "utf8"),
   "checkbox-config-view": fs.readFileSync(__dirname + "/../template/view/config/checkbox-config-view.html", "utf8"),
   "number-config-view": fs.readFileSync(__dirname + "/../template/view/config/number-config-view.html", "utf8"),
   "text-config-view": fs.readFileSync(__dirname + "/../template/view/config/text-config-view.html", "utf8"),
   "radio-config-view": fs.readFileSync(__dirname + "/../template/view/config/radio-config-view.html", "utf8")
};