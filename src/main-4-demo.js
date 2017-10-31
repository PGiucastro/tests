const $ = require('jquery');
const MainView = require('./view/main-view');
const forbiddenNames = ["iubenda", "mimmo", "jacopo"];

$.when($.get("/mock-data/schema.json"), $.get("/mock-data/clauses.json"))
   .then((schema, clauses) => {
      setTimeout(() => {
         $("body").append(MainView.build(forbiddenNames).render(schema[0], clauses[0]));
      }, 300);
   });

