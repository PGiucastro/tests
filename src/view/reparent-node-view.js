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

      var view, option;
      var names = this._getSortedListOfNodeNames(nodes);

      this._warning.empty().text("You are about to choose a new parent for the node [" + this._node.getName() + "]");

      this._select.append("<option value='-'>- no parent (make it a root node) -</option>");

      for (var i = 0; i < names.length; i++) {
         name = names[i];
         view = this._getViewByName(nodes, name);
         if (view.canBeAParentNode() && view.getId() !== this._node.getId()) {
            option = $("<option />");
            option.attr("value", name);
            option.text(name);
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
         e.preventDefault();
         this.hide();
      });

      this._executeButton.click((e) => {
         e.preventDefault();
         let newParentName = this._select.val();
         let currentParentName = this._node.getParentName();
         if (!currentParentName && newParentName === "-") {
            alert("Choosen a new parent");
         } else {
            if (newParentName !== currentParentName) {
               this._eventHub.trigger("please-reparent-this-node-view", [this._node.getName(), currentParentName, newParentName]);
               this.hide();
            } else {
               alert("Choosen a new parent");
            }
         }
      });
   }

   _getSortedListOfNodeNames(nodes) {
      var names = nodes.map((node) => {
         return node.getName();
      });

      names.sort((a, b) => {
         if (a < b) {
            return -1;
         }
         if (a > b) {
            return 1;
         }
         return 0;
      });

      return names;
   }

   _getViewByName(views, name) {
      for (var i = 0; i < views.length; i++) {
         let view = views[i];
         if (view.getName() === name) {
            return view;
         }
      }
   }
}

module.exports = ReparentNodeView;