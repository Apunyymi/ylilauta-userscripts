// ==UserScript==
// @name Ylilauta.fi: Piilota postaukset jotka sisältävät blacklistattuja sanoja
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.4
// @locale en
// @description Piilota postaukset jotka sisältävät blacklistattuja sanoja
// ==/UserScript==

(function () {
  const blacklist = JSON.parse(localStorage.getItem('wordBlackListList') || '[]');
  const caseless = JSON.parse(localStorage.getItem('wordBlackListCaseless') || 'false');
  const regex = JSON.parse(localStorage.getItem('wordBlackListRegex') || 'false');

  function shouldBeHidden(div) {
    const post = Array.from(div.childNodes).find(c => c.className === 'post');
    
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

  if (isToggled("wordBlackListStorage")) {
    hide();
    if ($('.answers').length > 0) {
      newRepliesListener(() => hide());
    }
  }
})();