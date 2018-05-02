// ==UserScript==
// @name       Ylilauta.fi: Näytä vastatuimmat
// @namespace  Violentmonkey Scripts
// @include    /^https?://ylilauta.org/.+/.+$/
// @require    https://github.com/Apunyymi/ylilauta-userscripts/raw/fbfb77e836c8fdaef38d7ce2c4e2a4e3b77f0bba/script-toggler/runsafely.user.js
// @version    0.2
// ==/UserScript==

runSafely(function () {
  const buttonsRight = $('.buttons_right')

  if (localStorage.getItem('showMostAnsweredStorage') === 'true'
    && buttonsRight) {

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

    const sortButton = $('<button />', {
      text: 'Näytä vastatuimmat',
      class: 'linkbutton',
      on: {
        click: () => sortReplies()
      }
    });

    buttonsRight.prepend(sortButton);
  }
});