const $ = require('jquery');
const NodesList = require('./nodes-list-view');

var list = new NodesList($({})).render();
$("body").append(list);