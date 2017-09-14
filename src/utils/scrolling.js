const $ = require('jquery');

module.exports = {

   scrollToTop: () => {
      $("html, body").animate({
         scrollTop: 0
      }, "slow");
   },

   scrollToBottom: () => {
      $("html, body").animate({
         scrollTop: $(document).height()
      }, "slow");
   },

   scrollToNode: (node) => {
      var px = node.geOffsetTop() - 100;
      $("html, body").animate({
         scrollTop: px
      }, "slow");
   }
};
