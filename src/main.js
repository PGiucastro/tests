const $ = require('jquery');
const MainView = require('./view/main-view');

var list = new MainView($({})).render();
$("body").append(list);