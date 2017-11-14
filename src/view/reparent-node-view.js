const $ = require('jquery');
const _ = require('underscore');
const templates = require('./../templates');
const sameParentErrorMessage = "Please choose a new parent.";


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

      var title;
      var view, option;
      var titles = this._getSortedListOfNodeTitles(nodes);

      this._warning.empty().text("You are about to choose a new parent for the node [" + this._node.getId() + "]");

      this._select.append("<option value='-'>- no parent (make it a root node) -</option>");

      for (var i = 0; i < titles.length; i++) {
         title = titles[i];
         view = this._getViewByTitle(nodes, title);
         if (view.canBeAParentNode() && view.getId() !== this._node.getId()) {
            option = $("<option />");
            option.attr("value", view.getId());
            option.text(title);
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
         let newParentId = this._select.val();
         let currentParentId = this._node.getParentId();
         if (!currentParentId && newParentId === "-") {
            alert(sameParentErrorMessage);
         } else {
            if (newParentId !== currentParentId) {
               this._eventHub.trigger("please-reparent-this-node-view", [this._node.getId(), newParentId]);
               this.hide();
            } else {
               alert(sameParentErrorMessage);
            }
         }
      });
   }

   _getSortedListOfNodeTitles(nodes) {
      var titles = nodes.map((node) => {
         return node.getTitle();
      });

      titles.sort((a, b) => {
         if (a < b) {
            return -1;
         }
         if (a > b) {
            return 1;
         }
         return 0;
      });

      return titles;
   }

   _getViewByTitle(views, title) {
      for (var i = 0; i < views.length; i++) {
         let view = views[i];
         if (view.getTitle() === title) {
            return view;
         }
      }
   }
}

module.exports = ReparentNodeView;