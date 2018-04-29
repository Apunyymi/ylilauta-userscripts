// ==UserScript==
// @name Ylilauta: jakonapin piilotus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant GM_addStyle
// ==/UserScript==
runSafely(function() {
  if (localStorage.getItem('hideShareButtonStorage') === 'true') {
    GM_addStyle('.icon-share2 { display: none; }');
  }
});
