const templates = require('./templates');

class NodeView {

   render() {
      this._root = $(templates["node-view"]);
      this._deleteButton = this._root.find("button");
      this._behaviour();
      return this._root;
   }

   _behaviour() {
      this._deleteButton.click((e) => {
         e.preventDefault();
         this._root.remove();
      });
   }
}

module.exports = NodeView;