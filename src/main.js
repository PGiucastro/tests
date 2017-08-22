const $ = require('jquery');
const NodesList = require('./view/nodes-list-view');

var list = new NodesList($({})).render();
$("body").append(list);