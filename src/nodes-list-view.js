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

      this._eventHub.on("node-removed", (e, model) => {
         var index = -1;
         
         for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            if (node.getModel() === model) {
               node.getRootNode().remove();
               index = i;
               break;
            }
         }
         
         if (index !== -1) {
            this._nodes.splice(index, 1);
         }
         
         console.log("remaining nodes", this._nodes);
      });
   }
}

module.exports = NodesListView;
