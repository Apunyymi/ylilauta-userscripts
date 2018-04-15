// ==UserScript==
// @name Ylilauta.fi: Koodinväritys
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @resource highlightCSS https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css
// @grant GM_addStyle
// @grant GM_getResourceText
// @version 0.2
// @description Värittää [code]koodinpätkät[/code]
// ==/UserScript==

function newRepliesListener(callback) {
  updateQuotes = (() => {
    return () => {
      callback();
    
      return updateQuotes;
    };
  })();
}

function highlightCode() {
  $('pre.pre').each((i, block) => {
    hljs.highlightBlock(block);
  });
}

const highlightCSS = GM_getResourceText('highlightCSS');
GM_addStyle(highlightCSS);

highlightCode();
newRepliesListener(() => highlightCode());