// ==UserScript==
// @name Näytä ilmoituspalkki lankaa selatessa.
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant GM_addStyle
// @grant GM_getResourceText
// ==/UserScript==

runSafely(function() {
  if (localStorage.getItem('showNotificationBarStorage') === 'true') {
    const body = $('body')[0];
    const bodybg = window.getComputedStyle(body).backgroundColor;

    const boardlist = $('#left')[0];
    const cloned = boardlist.cloneNode(true);

    cloned.className += " onscrollmenu";

    cloned.style = `background-color: ${bodybg};
        position: fixed;
        z-index: 100;
        top: 0;
        right: 0;
        left: 0;
        display: inline-block !important;
        height: 25px;
        line-height: 25px;
        box-shadow: 0 -3px 5px 0;
        display: flex;
        justify-content: space-between;`;

    $(boardlist).before(cloned);

    Array.from(cloned.children).map(node => {
      if (node.className !== 'user') {
        node.remove();
      } else {
        node.style = `display: flex; justify-content: space-between;`;
        if ($('.answers').length > 0) {
          const returnToBoard = document.createElement('a');
          const currentUrl = window.location.href;
          const slashIndex = currentUrl.lastIndexOf('/');
          returnToBoard.href = currentUrl.substring(0, slashIndex);
          returnToBoard.innerText = 'Palaa lankaluetteloon';
          node.insertBefore(returnToBoard, node.children[node.children.length-1]);
        }
      }
    })
    $(cloned).toggle();
    let toggled = false;
    $(window).scroll(function(){
        if ($(window).scrollTop() >= 200) {
          if (!toggled) {
            $(cloned).toggle(true);
            toggled = !toggled;
          }
        } else if (toggled) {
          $(cloned).toggle(false);
          toggled = !toggled;
        }
    });
  }
});