// ==UserScript==
// @name Ylilauta: jakonapin piilotus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/fbfb77e836c8fdaef38d7ce2c4e2a4e3b77f0bba/script-toggler/runsafely.user.js
// @grant GM_addStyle
// @version 0.2
// ==/UserScript==
runSafely(function() {
  if (localStorage.getItem('hideShareButtonStorage') === 'true') {
    GM_addStyle('.icon-share2 { display: none; }');
  }
});
