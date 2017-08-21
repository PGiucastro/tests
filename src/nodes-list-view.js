const NodeView = require('./node-view');
const templates = require('./templates');
const _ = require('underscore');
const $ = require('jquery');

class NodesListView {

   constructor(eventHub) {
      this._counter = 0;
      this._eventHub = eventHub;
      this._nodes = [];
      this._root = $(templates["nodes-list-view"]);
      this._addButton = this._root.find("button");
      this._list = this._root.find(".list");
   }

   render() {
      this._behaviour();
      return this._root;
   }

   _behaviour() {

      this._addButton.click((e) => {
         e.preventDefault();
         this._counter++;
         var nodeModel = {
            id: this._counter
         };
         var nodeView = new NodeView(nodeModel, this._eventHub);
         this._list.append(nodeView.render());
         this._nodes.push(nodeView);
      });

      this._eventHub.on("node-removed", function(e, model) {
         console.log(model);
      });
   }
}

module.exports = NodesListView;
