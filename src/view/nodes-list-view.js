const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');
const templates = require('./../templates');
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
      this._noNodesYet = this._root.find(".no-nodes-yet");
   }

   render() {

      $.when($.get("/mock-data/schema.json"), $.get("/mock-data/clauses.json"))
         .then((schema, clauses) => {
            setTimeout(() => {
               var nodes = schema[0].properties;

               this._clausesModel = clauses[0];
               this._loader.hide();

               for (var name in nodes) {
                  this._lastUsedId++;
                  this._renderNode(this._lastUsedId, name, nodes[name]);
               }

               this._updateNodesParentSelect();
               this._handleNoNodesYetMessage();
               this._behaviour();
            }, 500);
         });

      return this._root;
   }

   _behaviour() {

      this._saveButton.click((e) => {
         var sb = new SchemaBuilder(this._renderedNodeViews);
         var json = sb.build();
         console.log(JSON.stringify(json, null, "   "));
      });

      this._addButton.click((e) => {
         e.preventDefault();
         this._lastUsedId++;
         this._renderNode(this._lastUsedId, "", {});
         this._updateNodesParentSelect();
         this._handleNoNodesYetMessage();
      });

      this._eventHub.on("node-removed", (e, id) => {
         var index = -1;

         for (var i = 0; i < this._renderedNodeViews.length; i++) {
            var node = this._renderedNodeViews[i];
            if (node.getId() === id) {
               node.getRootNode().remove();
               index = i;
               break;
            }
         }

         if (index !== -1) {
            this._renderedNodeViews.splice(index, 1);
         }

         this._updateNodesParentSelect();
         this._handleNoNodesYetMessage();
      });

      this._eventHub.on("node-name-updated", (e, model) => {
         this._updateNodesParentSelect();
      });
   }

   _updateNodesParentSelect() {
      var data = this._renderedNodeViews.map((view) => {
         return view.getData();
      });
      for (var i = 0; i < this._renderedNodeViews.length; i++) {
         this._renderedNodeViews[i].updateParentSelect(data);
      }
   }

   _renderNode(id, name, nodeModel) {
      var nodeView = new NodeView(id, name, nodeModel, this._clausesModel, this._eventHub);
      this._list.append(nodeView.render());
      this._renderedNodeViews.push(nodeView);
   }

   _handleNoNodesYetMessage() {
      if (this._renderedNodeViews.length === 0) {
         this._noNodesYet.show();
      } else {
         this._noNodesYet.hide();
      }
   }
}

module.exports = NodesListView;