const $ = require('jquery');
const _ = require('underscore');
const templates = require('./../templates');

class ReparentNodeView {

   constructor(eventHub) {
      this._eventHub = eventHub;
   }

   render() {
      var tmpl = _.template(templates["reparent-node-view"]);
      this._root = $(tmpl());
      this._warning = this._root.find(".warning");
      this._select = this._root.find("select");
      this._closeButton = this._root.find(".close");
      this._executeButton = this._root.find("button");
      this._behaviour();
      return this._root;
   }

   setNodeToBeReparented(node) {
      this._node = node;
   }

   show(nodes) {
      console.log(this._node.getId());
      var view, option;
      this._warning.empty().text("You are about to choose a new parent for the node [" + this._node.getName() + "]");
      nodes = this._sortNodesByName(nodes);
      for (var i = 0; i < nodes.length; i++) {
         view = nodes[i];
         if (view.canBeAParentNode() && view.getId() !== this._node.getId()) {
            option = $("<option />");
            option.attr("value", view.getName());
            option.text(view.getName());
            this._select.append(option);
         }
      }
      this._root.show();
   }

   hide() {
      this._root.hide();
      this._node = null;
      this._select.empty();
   }

   _behaviour() {

      $(document).on("keyup", (e) => {
         if (e.keyCode === 27) {
            this.hide();
         }
      });

      this._closeButton.click((e) => {
         this.hide();
      });

      this._executeButton.click((e) => {
         let newParentName = this._select.val();
         let currentParentName = this._node.getParentName();
         if (newParentName !== currentParentName) {
            this._eventHub.trigger("please-reparent-this-node-view", [this._node.getName(), currentParentName, newParentName]);
            this.hide();
         } else {
            alert("Choosen a new parent");
         }
      });
   }

   _sortNodesByName(nodes) {
      return nodes.sort((a, b) => {
         if (a.getName() < b.getName()) {
            return -1;
         }
         if (a.getName() > b.getName()) {
            return 1;
         }
         return 0;
      });
   }
}

module.exports = ReparentNodeView;