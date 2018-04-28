// ==UserScript==
// @name Ylilauta: jakonapin piilotus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant GM_addStyle
// ==/UserScript==
(function() {
  if (localStorage.getItem('hideShareButtonStorage') === 'true') {
    GM_addStyle('.icon-share2 { display: none; }');
  }
})();
