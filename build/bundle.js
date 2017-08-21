(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const NodesList = require('./nodes-list-view');

var list = new NodesList($({})).render();
$("body").append(list);
},{"./nodes-list-view":3}],2:[function(require,module,exports){
const templates = require('./templates');

class NodeView {

   constructor(model, eventHub) {
      this._eventHub = eventHub;
      this._model = model;
   }

   render() {
      var tmpl = _.template(templates["node-view"]);
      this._root = $(tmpl(this._model));
      this._name = this._root.find(".name");
      this._title = this._root.find(".title");
      this._type = this._root.find(".type");
      this._deleteButton = this._root.find("button");
      this._behaviour();
      return this._root;
   }

   getData() {
      this._model.name = this._name.val();
      this._model.title = this._title.val();
      this._model.type = this._type.val();
      return this._model;
   }

   _behaviour() {
      this._deleteButton.click((e) => {
         e.preventDefault();
         this._root.remove();
      });
   }
}

module.exports = NodeView;
},{"./templates":4}],3:[function(require,module,exports){
const NodeView = require('./node-view');
const templates = require('./templates');

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

},{"./node-view":2,"./templates":4}],4:[function(require,module,exports){


module.exports = {
   "nodes-list-view": "<div class=\"nodes-list-view\">\n   <button>Add new node</button>\n   <div class=\"list\"></div>\n</div>",
   "node-view": "<div class=\"node-view\" data-node-id='<%= id %>\"'>\n   <input type='text' class='name' placeholder='Add the node name' />\n   <input type='text' class='title' placeholder='Add the node title' />\n   <select class='type'>\n      <option>-type-</option>\n      <option>checkbox</option>\n      <option>radio</option>\n      <option>text</option>\n   </select>\n   <select class='parent'>\n      <option>-parent-</option>\n   </select>\n   <button>Delete</button>\n</div>"
};
},{}]},{},[1]);
