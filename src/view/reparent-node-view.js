const $ = require('jquery');
const _ = require('underscore');
const templates = require('./../templates');
class ReparentNodeView {

   render() {
      var tmpl = _.template(templates["reparent-node-view"]);
      this._root = $(tmpl());
      this._select = this._root.find("select");
      this._behaviour();
      return this._root;
   }

   setNodeToBeReparented(node) {
      this._node = node;
   }

   show(nodes) {
      console.log(nodes);
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
   }
}

module.exports = ReparentNodeView;