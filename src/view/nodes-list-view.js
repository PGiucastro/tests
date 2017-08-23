const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');
const templates = require('./templates');
const SchemaBuilder = require('./../schema-builder');

class NodesListView {

   constructor(eventHub) {
      this._lastUsedId = 0;
      this._eventHub = eventHub;
      this._renderedNodeViews = [];
      this._clausesModel = null;

      this._root = $(templates["nodes-list-view"]);
      this._addButton = this._root.find("button.add");
      this._saveButton = this._root.find("button.save");
      this._loader = this._root.find(".loading");
      this._list = this._root.find(".list");
   }

   render() {

      $.when($.get("/mock-data/nodes.json"), $.get("/mock-data/clauses.json"))
         .then((nodes, clauses) => {
            nodes = nodes[0];
            this._clausesModel = clauses[0];
            this._loader.hide();

            for (var i = 0; i < nodes.length; i++) {
               if (this._lastUsedId < nodes[i].id) {
                  this._lastUsedId = nodes[i].id;
               }
               this._renderNode(nodes[i]);
            }

            this._updateNodesParentSelect();
            this._behaviour();
         });

      return this._root;
   }

   _behaviour() {

      this._saveButton.click((e) => {
         var sb = new SchemaBuilder(this._renderedNodeViews.map((view) => {
            return view.getModel();
         }));
         var json = sb.build();
         console.log(JSON.stringify(json, null, "   "));
      });

      this._addButton.click((e) => {
         e.preventDefault();
         this._lastUsedId++;
         var nodeModel = {
            id: this._lastUsedId
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
      if (this._renderedNodeViews.length === 0) {
         this._list.empty(); // removes the `no nodes` message
      }
      var nodeView = new NodeView(nodeModel, this._clausesModel, this._eventHub);
      this._list.append(nodeView.render());
      this._renderedNodeViews.push(nodeView);
   }
}

module.exports = NodesListView;