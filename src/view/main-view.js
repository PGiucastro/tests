const _ = require('underscore');
const $ = require('jquery');
const NodeView = require('./node-view');
const ValueView = require('./value-view');
const templates = require('./../templates');
const SchemaBuilder = require('./../schema-builder');
const ReparentNodeView = require('./reparent-node-view');

class MainView {

   constructor(eventHub) {
      this._lastUsedId = 0;
      this._eventHub = eventHub;
      this._nodeViews = [];
      this._clausesModel = null;

      this._root = $(templates["main-view"]);
      this._addButton = this._root.find("button.add");
      this._saveButton = this._root.find("button.save");
      this._loader = this._root.find(".loading");
      this._list = this._root.find(".list");
      this._noNodesYet = this._root.find(".no-nodes-yet");
   }

   render() {

      $.when($.get("/mock-data/schema.json"), $.get("/mock-data/clauses.json"))
         .then((schema, clauses) => {
            setTimeout(() => { // TODO: remove timeout
               var nodes = schema[0].properties;

               this._loader.hide();
               this._clausesModel = clauses[0];

               for (var name in nodes) {
                  let type = nodes[name].type === "boolean" || nodes[name].type === "string" && nodes[name].enum ? "node" : "value-input"; // TODO: refactor
                  this._buildNode(type, String(this._getNextId()), name, nodes[name]);
               }

               this._setNodeViewsParentId(); // only done at startup to map parents names (available in the model) onto ids (assigned to nodes at runtime)

               for (var i = 0; i < this._nodeViews.length; i++) {
                  this._renderNode(this._nodeViews[i]);
               }

               this._handleNoNodesYetMessage();
               this._behaviour();
            }, 300);
         });

      this._reparentNodeview = new ReparentNodeView(this._eventHub);
      this._root.append(this._reparentNodeview.render());
      this._reparentNodeview.hide();

      return this._root;
   }

   _behaviour() {

      this._saveButton.click((e) => {
         var sb = new SchemaBuilder(this._nodeViews);
         var json = sb.build();
         console.log(JSON.stringify(json, null, "   "));
      });

      this._addButton.click((e) => {
         var newNode;
         newNode = this._buildNode("node", String(this._getNextId()), "", {});
         this._renderNode(newNode);
         this._handleNoNodesYetMessage();
         this._scrollToBottom();
      });

      this._eventHub.on("please-delete-node", (e, id) => {
         var viewToDestroy = this._getViewById(id);
         var parentView = this._getViewByName(viewToDestroy.getParentName());
         var ids = viewToDestroy.destroy(true);
         console.warn("removed ones", ids);

         ids.forEach((id) => {
            for (var i = 0; i < this._nodeViews.length; i++) {
               if (this._nodeViews[i].getId() === id) {
                  this._nodeViews.splice(i, 1);
                  break;
               }
            }
         });

         if (parentView) {
            parentView.notifyOfChildrenDestruction(ids);
         }

         this._handleNoNodesYetMessage();

         console.log("remaining nodes in nodes-list-view", this._nodeViews.length);
      });

      this._eventHub.on("node-name-has-been-updated", (e, id, newName) => {
         var node;
         for (var i = 0; i < this._nodeViews.length; i++) {
            node = this._nodeViews[i];
            if (node.getParentId() === id) {
               node.setParentName(newName);
            }
         }
      });

      this._eventHub.on("please-create-child-node", (e, type, parentNodeId, parentNodeName) => {
         var newNode;
         newNode = this._buildNode(type, String(this._getNextId()), "", {});
         newNode.setParentId(parentNodeId);
         newNode.setParentName(parentNodeName);
         this._renderNode(newNode);
         this._scrollToNode(newNode);
      });

      this._eventHub.on("please-show-reparent-node-view", (e, node) => {
         console.log("show reparent view for view " + node.getName());
         this._reparentNodeview.setNodeToBeReparented(node);
         this._reparentNodeview.show(this._nodeViews);
      });

      this._eventHub.on("please-reparent-this-node-view", (e, nameOfNodeToReparent, currentParentName, newParentName) => {
         console.log("node to reparent", nameOfNodeToReparent);
         console.log("from", currentParentName);
         console.log("to", newParentName);

         let nodeToReparent = this._getViewByName(nameOfNodeToReparent);
         let currentParentView = this._getViewByName(currentParentName);
         let newParentView = this._getViewByName(newParentName);

         if (currentParentView) { // the node might be root one, in which case no current parent exists.
            currentParentView.detachChildNode(nodeToReparent);
         }

         if (!newParentView) { // it has been asked to make it a root node            
            nodeToReparent.setParentName(null);
            this._list.append(nodeToReparent.getDomNode());
         } else {
            nodeToReparent.setParentName(newParentName);
            newParentView.appendChildNode(nodeToReparent);
         }
      });
   }

   _buildNode(type, id, name, nodeModel) {
      var nodeView;
      if (type === "node") {
         nodeView = new NodeView(id, name, nodeModel, this._clausesModel, this._eventHub);
      } else if (type === "value-input") {
         nodeView = new ValueView(id, name, nodeModel, this._clausesModel, this._eventHub);
      }
      this._nodeViews.push(nodeView);
      return nodeView;
   }

   _renderNode(nodeView) {
      var parentId = nodeView.getParentId();
      nodeView.render();
      if (parentId) {
         this._getViewById(parentId).appendChildNode(nodeView);
      } else {
         this._list.append(nodeView.getDomNode());
      }
   }

   _handleNoNodesYetMessage() {
      if (this._nodeViews.length === 0) {
         this._noNodesYet.show();
      } else {
         this._noNodesYet.hide();
      }
   }

   _getViewByName(name) {
      for (var i = 0; i < this._nodeViews.length; i++) {
         var view = this._nodeViews[i];
         if (view.getName() === name) {
            return view;
         }
      }
   }

   _getViewById(id) {
      for (var i = 0; i < this._nodeViews.length; i++) {
         var view = this._nodeViews[i];
         if (view.getId() === id) {
            return view;
         }
      }
   }

   _doesViewExists(id) {
      for (var i = 0; i < this._nodeViews.length; i++) {
         var view = this._nodeViews[i];
         if (view.getId() === id) {
            return view;
         }
      }
   }

   _setNodeViewsParentId() {
      for (var i = 0; i < this._nodeViews.length; i++) {
         var view = this._nodeViews[i];
         var parentName = view.getParentName();
         var parentId;
         if (parentName) {
            parentId = this._getViewByName(parentName).getId();
         }
         view.setParentId(parentId);
      }
   }

   _scrollToTop() {
      $("html, body").animate({
         scrollTop: 0
      }, "slow");
   }

   _scrollToBottom() {
      $("html, body").animate({
         scrollTop: $(document).height()
      }, "slow");
   }

   _scrollToNode(node) {
      var px = node.geOffsetTop() - 100;
      $("html, body").animate({
         scrollTop: px
      }, "slow");
   }

   _getNextId() {
      this._lastUsedId++;
      return this._lastUsedId;
   }
}

module.exports = MainView;