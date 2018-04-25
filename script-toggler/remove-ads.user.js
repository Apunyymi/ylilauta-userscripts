// ==UserScript==
// @name         Ylilauta: Mainospiilotin
// @namespace    *://ylilauta.org/*
// @version      1.0
// @description  Extract from YlisToolchain, removes ads
// @locale       en
// @author       Apunyymi
// @match        *://ylilauta.org/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  // Don't even run any code if this module is not enabled
  if (localStorage.getItem('removeAdsStorage') === 'true') {
    GM_addStyle(`#blocking-notification,
.threads > div[style] {display: none !important}`);
  }
})();