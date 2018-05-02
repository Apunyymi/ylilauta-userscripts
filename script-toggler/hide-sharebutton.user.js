// ==UserScript==
// @name Ylilauta: jakonapin piilotus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant GM_addStyle
// @version 0.3
// ==/UserScript==
runSafely(function() {
  if (localStorage.getItem('hideShareButtonStorage') === 'true') {
    GM_addStyle('.icon-share2 { display: none; }');
  }
});
