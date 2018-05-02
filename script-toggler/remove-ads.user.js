// ==UserScript==
// @name         Ylilauta: Mainospiilotin
// @namespace    *://ylilauta.org/*
// @version      1.2
// @description  Extract from YlisToolchain, removes ads
// @locale       en
// @author       Apunyymi
// @match        *://ylilauta.org/*
// @require      https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant        GM_addStyle
// ==/UserScript==

runSafely(function() {
  // Don't even run any code if this module is not enabled
  if (localStorage.getItem('removeAdsStorage') === 'true') {
    GM_addStyle(`#blocking-notification,
.threads > div[style] {display: none !important}`);
  }
});