// ==UserScript==
// @name         Ylilauta: Mainospiilotin
// @namespace    *://ylilauta.org/*
// @version      1.1
// @description  Extract from YlisToolchain, removes ads
// @locale       en
// @author       Apunyymi
// @match        *://ylilauta.org/*
// @require      https://github.com/Apunyymi/ylilauta-userscripts/raw/fbfb77e836c8fdaef38d7ce2c4e2a4e3b77f0bba/script-toggler/runsafely.user.js
// @grant        GM_addStyle
// ==/UserScript==

runSafely(function() {
  // Don't even run any code if this module is not enabled
  if (localStorage.getItem('removeAdsStorage') === 'true') {
    GM_addStyle(`#blocking-notification,
.threads > div[style] {display: none !important}`);
  }
});