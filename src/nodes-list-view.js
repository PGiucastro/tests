const NodeView = require('./node-view');
const templates = require('./templates');
const _ = require('underscore');
const $ = require('jquery');

var _models_ = [{
      id: 4,
      name: "a_node_name",
      title: "A node title",
      type: "text",
      parent: null
   }, {
      id: 5,
      name: "another_node_name",
      title: "Another node title",
      type: "checkbox",
      parent: 4
   }];

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

      for (var i = 0; i < _models_.length; i++) {
         this._addNode(_models_[i]);
      }

      this._updateNodesParentSelect();
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
         this._addNode(nodeModel);
         this._updateNodesParentSelect();
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

         this._updateNodesParentSelect();
      });

      this._eventHub.on("node-name-updated", (e, model) => {
         this._updateNodesParentSelect();
      });
   }

   _updateNodesParentSelect() {
      for (var i = 0; i < this._nodes.length; i++) {
         this._nodes[i].updateParentSelect(this._nodes.map((n) => {
            return n.getModel();
         }));
      }
   }

   _addNode(nodeModel) {
      var nodeView = new NodeView(nodeModel, this._eventHub);
      this._list.append(nodeView.render());
      this._nodes.push(nodeView);
   }
}

module.exports = NodesListView;