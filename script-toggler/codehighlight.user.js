// ==UserScript==
// @name Ylilauta: Koodinväritys
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @resource highlightCSS https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant GM_addStyle
// @grant GM_getResourceText
// @version 0.2
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