const NodeView = require('./node-view');
const templates = require('./templates');
const _ = require('underscore');
const $ = require('jquery');

class NodesListView {

   constructor(eventHub) {
      this._counter = 0;
      this._eventHub = eventHub;
      this._renderedNodeViews = [];
      this._root = $(templates["nodes-list-view"]);
      this._addButton = this._root.find("button");
      this._loader = this._root.find(".loading");
      this._list = this._root.find(".list");
   }

   render() {

      $.get("/mock-data/nodes.json")
         .then((data) => {
            this._loader.hide();
            for (var i = 0; i < data.length; i++) {
               if (this._counter < data[i].id) {
                  this._counter = data[i].id;
               }
               this._renderNode(data[i]);
            }
            this._updateNodesParentSelect();
            this._behaviour();
         });

      return this._root;
   }

   _behaviour() {

      this._addButton.click((e) => {
         e.preventDefault();
         this._counter++;
         var nodeModel = {
            id: this._counter
         };
         this._renderNode(nodeModel);
         this._updateNodesParentSelect();
      });

      this._eventHub.on("node-removed", (e, model) => {
         var index = -1;

         for (var i = 0; i < this._renderedNodeViews.length; i++) {
            var node = this._renderedNodeViews[i];
            if (node.getModel() === model) {
               node.getRootNode().remove();
               index = i;
               break;
            }
         }

         if (index !== -1) {
            this._renderedNodeViews.splice(index, 1);
         }

         this._updateNodesParentSelect();
      });

      this._eventHub.on("node-name-updated", (e, model) => {
         this._updateNodesParentSelect();
      });
   }

   _updateNodesParentSelect() {
      for (var i = 0; i < this._renderedNodeViews.length; i++) {
         this._renderedNodeViews[i].updateParentSelect(this._renderedNodeViews.map((n) => {
            return n.getModel();
         }));
      }
   }

   _renderNode(nodeModel) {
      var nodeView = new NodeView(nodeModel, this._eventHub);
      this._list.append(nodeView.render());
      this._renderedNodeViews.push(nodeView);
   }
}

module.exports = NodesListView;