// ==UserScript==
// @name Ylilauta: Lainaa kaikki viestit IP:ltä
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @version 0.4
// @description Lainaa kaikki viestit samalta IP:ltä (vaatii Kultatilin)
// ==/UserScript==

runSafely(() => {
  if (localStorage.getItem('quoteAllFromIpStorage') === 'true') {
    function quoteAllIps(event) {
      const clickedMessage = event.target.parentNode
      const clickedIp = [...clickedMessage.childNodes].filter(e => e.className === 'postuid ip')[0].innerText
      const sameIp = [...document.querySelectorAll('.postuid.ip')].filter(e => e.innerText === clickedIp)

      sameIp.forEach(e => [...e.parentNode.parentNode.childNodes]
        .filter(e => e.className === 'postnumber')
        .forEach(e => e.click())
      )
    }

    [...document.querySelectorAll('.postuids')].forEach(e => {
      const quoteAllButton = document.createElement('span')
      quoteAllButton.innerText = ' >>'
      quoteAllButton.className = 'postuid'
      quoteAllButton.onclick = (e) => quoteAllIps(e)
      e.appendChild(quoteAllButton)
    })
  }
})