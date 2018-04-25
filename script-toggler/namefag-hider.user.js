// ==UserScript==
// @name Ylilauta.fi: Piilota kaikki nimipostaukset
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.3
// @locale en
// @description Piilottaa kaikki nimipostaukset
// ==/UserScript==

(function () {
  if (localStorage.getItem('namefagHiderStorage') === 'true') {
    // Settingsien asetus, || asettaa vara-arvon jos localStoragessa ei ole mitään
    const hideAll = localStorage.getItem('hideEveryNameFag') || false;
    const fags = JSON.parse(localStorage.getItem('nameFagHiderList') || '[]');

    function shouldBeHidden(div) {
      const postinfo = Array.from(div.childNodes).find(c => c.className === 'postinfo');
      const tags = Array.from(postinfo.childNodes).find(c => c.className === 'tags');
      const name = Array.from(tags.childNodes).find(c => c.className === 'postername').innerHTML;
      
      if (hideAll) {
        return name !== 'Anonyymi';
      } else {
        return fags.includes(name);
      }
    }

    function hide() {
      Array.from(document.querySelectorAll('div.op_post, div.answer'))
        .filter(div => shouldBeHidden(div))
        .map(div => {
          div.hidden = true;
          
          if (div.parentElement.classList.contains('thread')) {
            div.parentElement.style.display = 'none';
          }
        });
    }

    function newRepliesListener(callback) {
      const observer = new MutationObserver(callback);
      
      observer.observe($('.answers')[0], { childList: true });
    }

    function isToggled(name) {
      return localStorage.getItem(name) !== "false";
    }

    hide();
    if ($('.answers').length > 0) {
      newRepliesListener(() => hide());
    }
  }
})();