// ==UserScript==
// @name       Ylilauta.fi: Näytä vastatuimmat
// @namespace  Violentmonkey Scripts
// @include    /^https?://ylilauta.org/.+/.+$/
// ==/UserScript==

(function () {
  function sortReplies() {
      stopReplyUpdate();

      let replies = document.querySelectorAll('.answer');
      replies = Array.prototype.slice.call(replies, 0);

      replies.sort(function(a, b) {
          var aord = +a.querySelectorAll('.replies a').length;
          var bord = +b.querySelectorAll('.replies a').length;
          return aord - bord;
      });


      const answersNode = document.querySelector('.answers');
      answersNode.innerHTML = '';

      for(let i = 0; i < replies.length; i++) {
          answersNode.appendChild(replies[i]);
      }
  }

  function isToggled(name) {
    return localStorage.getItem(name) !== "false";
  }

  const sortButton = $('<button />', {
    text: 'Näytä vastatuimmat',
    class: 'linkbutton',
    on: {
      click: () => sortReplies()
    }
  });

  const buttonsRight = $('.buttons_right')

  if (buttonsRight && isToggled("showMostAnsweredStorage")) {
    buttonsRight.prepend(sortButton);
  }
})();