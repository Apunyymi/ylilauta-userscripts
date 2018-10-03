// ==UserScript==
// @name Järjestä lautaluettelo lyhenteen mukaan
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant none
// @version 0.3
// ==/UserScript==
runSafely(function () {
  if (localStorage.getItem('sortBoardListStorage') === 'true') {
    const boardlist = document.querySelector('.boardlist')
    const originalNodes = [...boardlist.childNodes]
    for (let node of originalNodes) {
      const oldInnerText = node.innerText
      node.innerHTML = `<span>/${node.dataset.shortname}/ - ${oldInnerText}</span>`
      boardlist.removeChild(node)
    }
    const sorted = originalNodes.sort((a,b) => (a.innerText > b.innerText) ? 1 : -1)
    for (let node of sorted) {
      boardlist.appendChild(node)
    }  
  }
})