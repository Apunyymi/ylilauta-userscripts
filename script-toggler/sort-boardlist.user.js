// ==UserScript==
// @name Järjestä lautaluettelo lyhenteen mukaan
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant none
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