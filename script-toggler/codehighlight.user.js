// ==UserScript==
// @name Ylilauta: Koodinväritys
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @resource highlightCSS https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/fbfb77e836c8fdaef38d7ce2c4e2a4e3b77f0bba/script-toggler/runsafely.user.js
// @grant GM_addStyle
// @grant GM_getResourceText
// @version 0.3
// @description Värittää [code]koodinpätkät[/code]
// ==/UserScript==

runSafely(function () {
  if (localStorage.getItem('codeHighlighterStorage') === 'true') {
    function newRepliesListener(callback) {
      const observer = new MutationObserver(callback);

      observer.observe($('.answers')[0], { childList: true });
    }

    function highlightCode() {
      $('pre.pre').each((i, block) => {
        hljs.highlightBlock(block);
      });
    }

    const highlightCSS = GM_getResourceText('highlightCSS');
    GM_addStyle(highlightCSS);

    highlightCode();
    if ($('.answers').length > 0) {
      newRepliesListener(() => highlightCode());
    }
  }
});