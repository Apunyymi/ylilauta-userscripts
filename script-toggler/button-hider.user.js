// ==UserScript==
// @name         Ylilauta: Viestinappien piilotus
// @namespace    *://ylilauta.org/
// @version      1.3
// @description  Piilottaa halutut napit viesteistä
// @locale       en
// @match        *://ylilauta.org/*
// @require      https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant        GM_addStyle
// ==/UserScript==

runSafely(function() {
  if (localStorage.getItem('buttonHiderStorage') === 'true') {

    // These are used to get info about what buttons even are here
    const allButtons = [];

    const allDescriptions = [];

    [...document.querySelectorAll('.thread .messageoptions button[title]')].map(e => {
      const button = e.className.split(" ").filter(x => x !== 'icon-button' && x.startsWith('icon'))[0]
      if (!allButtons.includes(button)) {
        allButtons.push(button);
        allDescriptions.push(e.title);
      }
    })

    const before = JSON.parse(localStorage.getItem('buttonHiderAllButtons') || '[]');

    // If there are somehow more buttons added, let's update the possible settings
    if (before.length < allButtons.length) {
      localStorage.setItem('buttonHiderAllButtons', JSON.stringify(allButtons));
      localStorage.setItem('buttonHiderAllDescriptions', JSON.stringify(allDescriptions));
    }

    // And then the main code :D
    const toHide = JSON.parse(localStorage.getItem('buttonHiderList') || '[]');

    if (toHide.length > 0)  {
      const elems = toHide.map(e => `#right .postinfo .messageoptions>.${e}`)
      GM_addStyle(elems.join(',') + '{display: none;}')
    }
  }
});