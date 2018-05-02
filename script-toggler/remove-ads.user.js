// ==UserScript==
// @name         Ylilauta: Mainospiilotin
// @namespace    *://ylilauta.org/*
// @version      1.0
// @description  Extract from YlisToolchain, removes ads
// @locale       en
// @author       Apunyymi
// @match        *://ylilauta.org/*
// @require      https://github.com/Apunyymi/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant        GM_addStyle
// ==/UserScript==

runSafely(function() {
  // Don't even run any code if this module is not enabled
  if (localStorage.getItem('removeAdsStorage') === 'true') {
    GM_addStyle(`#blocking-notification,
.threads > div[style] {display: none !important}`);
  }
});