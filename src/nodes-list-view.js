const NodeView = require('./node-view');
const templates = require('./templates');

class NodesListView {

   constructor() {
      this._root = $(templates["nodes-list-view"]);
      this._addButton = this._root.find("button");
      this._list = this._root.find(".list");
   }

   render() {
      this._behaviour();
      return this._root;
   }

   _behaviour() {
      this._addButton.click((e) => {
         e.preventDefault();
         this._list.append(new NodeView().render());
      });
   }
}

module.exports = NodesListView;
