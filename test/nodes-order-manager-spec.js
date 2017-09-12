var NodesOrderManager = require('../src/order/nodes-order-manager');
var NodeView = require('../src/view/node-view');
var assert = require('assert');
var $ = require('jquery');

describe('NodesOrderManager', function() {

   var manager, node1, node2, node3;

   beforeEach(function() {

      var eventHub = $({});

      node1 = new NodeView(1, "name1", {_iub_position: 1}, [], eventHub);
      node2 = new NodeView(2, "name2", {_iub_position: 3}, [], eventHub);
      node3 = new NodeView(3, "name3", {_iub_position: 2}, [], eventHub);

      manager = new NodesOrderManager([node1, node2, node3]);
   });

   it('Keeps track of the order assigned in the past', function() {
      assert.equal(3, manager.getMaxPosition());
   });
});