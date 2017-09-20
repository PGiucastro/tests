const $ = require('jquery');
const MainView = require('./view/main-view');

$.when($.get("/mock-data/schema.json"), $.get("/mock-data/clauses.json"))
   .then((schema, clauses) => {
      setTimeout(() => {
         $("body").append(new MainView($({})).render(schema[0], clauses[0]));
      }, 300);
   });

