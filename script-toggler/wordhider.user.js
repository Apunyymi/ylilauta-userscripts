// ==UserScript==
// @name Ylilauta.fi: Piilota postaukset jotka sisältävät blacklistattuja sanoja
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant none
// @version 0.8
// @locale en
// @description Piilota postaukset jotka sisältävät mustalistattuja sanoja
// ==/UserScript==

runSafely(function () {
  if (localStorage.getItem('wordBlackListStorage') === 'true') {
    const blacklist = JSON.parse(localStorage.getItem('wordBlackListList') || '[]');
    const caseless = JSON.parse(localStorage.getItem('wordBlackListCaseless') || 'false');
    const regex = JSON.parse(localStorage.getItem('wordBlackListRegex') || 'false');

    function shouldBeHidden(div) {
      if (div.classList.contains('own_post')) return;
      
      const post = Array.from(div.childNodes).find(c => c.className === 'post');
      if (post === undefined) return;
      
      const postcontent = Array.from(post.childNodes).find(c => c.className === 'postcontent').innerText;
      
      // Regex overrides (caseless) plain comparison
      if (regex) {
        return blacklist.some(reg => new RegExp(reg).test(postcontent));
      }

      if (caseless) {
        postcontent = postcontent.toLowerCase();
      }

      return blacklist.some(word => postcontent.indexOf(word) !== -1);
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
});