class NodesOrderManager {

   constructor(nodes) {
      this._maxPosition = 0;
      this._nodes = nodes;
      this._workOutMaxPositionBasedOnModelsData();
   }

   getMaxPosition() {
      return this._maxPosition;
   }

   addNode(node) {
      this._nodes.push(node);
      if (!node.getPosition()) { // fresh node, not previously saved!
         this._maxPosition++;
         node.setPosition(this._maxPosition);
      } else {
         this._workOutMaxPositionBasedOnModelsData();
      }
   }

   getPreviousNode(node) {
      var output;
      var nodePosition = node.getPosition();

      for (var i = 0; i < this._nodes.length; i++) {
         let currentNode = this._nodes[i];
         if (node.getId() !== currentNode.getId()) {
            if (!output && currentNode.getPosition() < nodePosition) {
               output = currentNode;
            } else {
               if (currentNode.getPosition() < nodePosition && currentNode.getPosition() > output.getPosition()) {
                  output = currentNode;
               }
            }
         }
      }

      return output;
   }

   getNextNode(node) {
      var output;
      var nodePosition = node.getPosition();

      for (var i = 0; i < this._nodes.length; i++) {
         let currentNode = this._nodes[i];
         if (node.getId() !== currentNode.getId()) {
            if (!output && currentNode.getPosition() > nodePosition) {
               output = currentNode;
            } else {
               if (currentNode.getPosition() > nodePosition && currentNode.getPosition() < output.getPosition()) {
                  output = currentNode;
               }
            }
         }
      }

      return output;
   }

   removeNode(node) {
      var newNodesList = [];
      var positionOfTheNodeToRemove = node.getPosition();

      this._nodes.forEach((current) => {
         let position = current.getPosition();
         if (node.getId() !== current.getId()) {
            if (position > positionOfTheNodeToRemove) {
               current.setPosition(position - 1);
            }
            newNodesList.push(current);
         }
      });

      this._nodes = newNodesList;
      this._workOutMaxPositionBasedOnModelsData();
   }

   moveNodeToLowerPosition(node) {
      var newPosition = node.getPosition() - 1;
      var effectedNode = this._findNodeByPosition(newPosition);
      if (effectedNode) {
         effectedNode.setPosition(node.getPosition());
         node.setPosition(newPosition);
      }
   }

   moveNodeToHigherPosition(node) {
      var newPosition = node.getPosition() + 1;
      var effectedNode = this._findNodeByPosition(newPosition);
      if (effectedNode) {
         effectedNode.setPosition(node.getPosition());
         node.setPosition(newPosition);
      }
   }

   _workOutMaxPositionBasedOnModelsData() {
      this._maxPosition = 0;
      this._nodes.forEach((n) => {
         let position = n.getPosition();
         if (this._maxPosition < position) {
            this._maxPosition = position;
         }
      });
   }

   _findNodeByPosition(position) {
      for (var i = 0; i < this._nodes.length; i++) {
         let node = this._nodes[i];
         if (node.getPosition() === position) {
            return node;
         }
      }
   }
}

module.exports = NodesOrderManager;