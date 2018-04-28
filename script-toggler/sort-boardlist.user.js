// ==UserScript==
// @name Järjestä lautaluettelo lyhenteen mukaan
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// ==/UserScript==
(function () {
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
})();