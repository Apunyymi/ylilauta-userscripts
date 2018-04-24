// ==UserScript==
// @name         Ylilauta: Postaajaväritin
// @namespace    *://ylilauta.org/
// @version      1.0
// @description  Extract from YlisToolchain, colorizes poster ids
// @locale       en
// @author       Apunyymi
// @match        *://ylilauta.org/*
// @grant        none
// ==/UserScript==

(function() {
  // Don't even run any code if this module is not enabled
  // Another thing: requires poster ids (gold account thing)
  // Third thing: requires posts
  if (localStorage.getItem('colorizePosterIdsStorage') === 'true' 
    && $('.postuid:first').length > 0
    && $('.answers').length > 0) {

    // Simply return a numeric hash of string
    // Adapted from https://stackoverflow.com/questions/7616461#15710692
    function hash(s) {
      return s.split("")
        .reduce(
          function(a, b) {
            a = ((a<<5)-a) + b.charCodeAt(0);
            return a & a;
          },
        0);
    }

    // Return a hex color from given poster id (using the hash() function)
    function color(id) {
      return '#' + hash(id).toString(16).substr(-6);
    }

    // Add color() for each poster id with no attached styling already, this is run every time page height changes
    // Essentially this colorizes every same poster id with a same color
    function colorize() {
      $('#right .threads .thread .postuid:not([style])').each(function () {
        $(this).css({backgroundColor: color($(this).text())});
      });
    }

    function newRepliesListener(callback) {
      const observer = new MutationObserver(callback);
      
      observer.observe($('.answers')[0], { childList: true });
    }

    // Colorize poster ids and do it also when new messages are added to page
    colorize();
    newRepliesListener(() => colorize());
  }
})();