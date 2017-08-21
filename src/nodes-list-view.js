const NodeView = require('./node-view');
const templates = require('./templates');
const _ = require('underscore');
const $ = require('jquery');


class NodesListView {

   constructor(eventHub) {
      this._counter = 0;
      this._eventHub = eventHub;
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
         this._counter++;
         this._list.append(new NodeView({
            id: this._counter
         }, this._eventHub).render());
      });
   }
}

module.exports = NodesListView;
