(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const NodesList = require('./nodes-list-view');

$("body").append(new NodesList().render());

},{"./nodes-list-view":3}],2:[function(require,module,exports){
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
},{"./templates":4}],3:[function(require,module,exports){
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

},{"./node-view":2,"./templates":4}],4:[function(require,module,exports){


module.exports = {
   "nodes-list-view": "<div class=\"nodes-list-view\">\n   <button>Add new node</button>\n   <div class=\"list\"></div>\n</div>",
   "node-view": "<div class=\"node-view\">\n   <input type='text' class='name' placeholder='Add the node name' />\n   <input type='text' class='title' placeholder='Add the node title' />\n   <select>\n      <option>-</option>\n      <option>checkbox</option>\n      <option>radio</option>\n      <option>text</option>\n   </select>\n   <button>Delete</button>\n</div>"
};
},{}]},{},[1]);
