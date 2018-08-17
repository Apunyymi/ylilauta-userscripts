// ==UserScript==
// @name Ylilauta: Koodinväritys
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @resource highlightCSS https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant GM_addStyle
// @grant GM_getResourceText
// @version 0.5
// @description Värittää [code]koodinpätkät[/code]
// ==/UserScript==

runSafely(() => {
  if (localStorage.getItem('codeHighlighterStorage') === 'true') {
    const newRepliesListener = (callback) => new MutationObserver(callback).observe(
      document.querySelector('div.answers'), { childList: true }
    )

    const highlightCode = () => [...document.querySelectorAll('pre.code-block')].map(
      block => hljs.highlightBlock(block)
    )

    const highlightCSS = GM_getResourceText('highlightCSS');
    GM_addStyle(highlightCSS);

    highlightCode();
    if (document.querySelector('.answers')) {
      newRepliesListener(() => highlightCode());
    }
  }
});