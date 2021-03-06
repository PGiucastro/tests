var NodesOrderManager = require('../src/order/nodes-order-manager');
var NodeView = require('../src/view/node-view');
var assert = require('assert');
var $ = require('jquery');

describe('NodesOrderManager', function() {

   var manager, node1, node2, node3;
   var newNode;
   var eventHub;

   beforeEach(function() {

      eventHub = $({});

      node1 = new NodeView("1", {_iub_position: 1}, [], eventHub);
      node2 = new NodeView("2", {_iub_position: 2}, [], eventHub);
      node3 = new NodeView("3", {_iub_position: 3}, [], eventHub);

      newNode = new NodeView(1, {}, [], eventHub);
      anotherNewNode = new NodeView(1, {}, [], eventHub);

      manager = new NodesOrderManager([node1, node2, node3]);
   });

   it('Keeps track of the order assigned to the nodes in the past', function() {
      assert.equal(3, manager.getMaxPosition());
   });

   it('Can be created empty and still work', function() {
      manager = new NodesOrderManager([]);
      manager.addNode(newNode);
      assert.equal(1, manager.getMaxPosition());
      assert.equal(1, newNode.getPosition());
   });

   it('Assigns a new coherent order to any new node', function() {
      manager.addNode(newNode);
      assert.equal(4, manager.getMaxPosition());
      assert.equal(4, newNode.getPosition());
   });

   it('Re-works out the order of the nodes when a node is removed', function() {
      manager.removeNode(node2);
      assert.equal(2, manager.getMaxPosition());
      assert.equal(1, node1.getPosition());
      assert.equal(2, node3.getPosition());
   });

   it('Can remove and add nodes and consistenly keep track of the positions', function() {
      manager.removeNode(node2);
      manager.removeNode(node1);
      assert.equal(1, manager.getMaxPosition());
      assert.equal(1, node3.getPosition());
      manager.addNode(newNode);
      assert.equal(2, manager.getMaxPosition());
      assert.equal(2, newNode.getPosition());
   });

   it('Can move a node to a lower position', function() {
      manager.moveNodeToLowerPosition(node3);
      assert.equal(2, node3.getPosition());
      assert.equal(3, node2.getPosition());
   });

   it('Can move a node to a higher position', function() {
      manager.moveNodeToHigherPosition(node2);
      assert.equal(3, node2.getPosition());
      assert.equal(2, node3.getPosition());
   });

   it('Does not do anything when reaching higher boundary', function() {
      assert.equal(3, node3.getPosition());
      manager.moveNodeToHigherPosition(node3);
      assert.equal(3, node3.getPosition());
   });

   it('Does not do anything when reaching lower boundary', function() {
      assert.equal(1, node1.getPosition());
      manager.moveNodeToLowerPosition(node1);
      assert.equal(1, node1.getPosition());
   });

   it('Tells you which one is the previous node', function() {
      assert.equal(undefined, manager.getPreviousNode(node1));
      assert.equal("1", manager.getPreviousNode(node2).getId());
      assert.equal("2", manager.getPreviousNode(node3).getId());
   });

   it('Tells you which one is the next node', function() {
      assert.equal("2", manager.getNextNode(node1).getId());
      assert.equal("3", manager.getNextNode(node2).getId());
      assert.equal(undefined, manager.getNextNode(node3));
   });

   it('Increment the max position when previously fresh nodes are added', function() {
      manager = new NodesOrderManager([]);
      manager.addNode(node3);
      manager.addNode(node2);
      manager.addNode(node1);
      assert.equal(3, manager.getMaxPosition());
   });

   it('Increment the max position when previously saved nodes are added', function() {
      manager = new NodesOrderManager([]);
      manager.addNode(newNode);
      manager.addNode(anotherNewNode);
      assert.equal(2, manager.getMaxPosition());
   });
});