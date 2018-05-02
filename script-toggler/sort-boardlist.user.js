// ==UserScript==
// @name Järjestä lautaluettelo lyhenteen mukaan
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant none
// @version 0.3
// ==/UserScript==
runSafely(function () {
  if (localStorage.getItem('sortBoardListStorage') === 'true') {
    const boardlist = $('.boardlist')[0];
    const originalNodes = Array.from(boardlist.children);
    for (let node of originalNodes) {
      const oldInnerText = node.innerText;
      node.innerHTML = '<span>/'+node.dataset.shortname+'/ - '+oldInnerText+'</span>';
      boardlist.removeChild(node);
    }
    const sorted = originalNodes.sort((a,b) => (a.innerText > b.innerText) ? 1 : -1);
    for (let node of sorted) {
      boardlist.appendChild(node);
    }  
  }
});