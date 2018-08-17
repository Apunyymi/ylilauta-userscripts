// ==UserScript==
// @name         Ylilauta: Postaajaväritin
// @namespace    *://ylilauta.org/*
// @version      1.2
// @description  Extract from YlisToolchain, colorizes poster ids
// @locale       en
// @match        *://ylilauta.org/*
// @require      https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant        GM_addStyle
// ==/UserScript==

runSafely(function() {
  // Don't even run any code if this module is not enabled
  // Another thing: requires poster ids (gold account thing)
  // Third thing: requires posts
  if (localStorage.getItem('colorizePosterIdsStorage') === 'true'
    && document.querySelectorAll('.postuids').length > 0
    && document.querySelectorAll('.answers').length > 0) {

    // Simply return a numeric hash of string
    // Adapted from https://stackoverflow.com/questions/7616461#15710692
    const hash = (s) => s.split("").reduce((a, b) => {
      a = ((a<<5)-a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    // Return a hex color from given poster id (using the hash() function)
    const color = (id) => `#${hash(id).toString(16).substr(-6)}`

    // Add color() for each poster id, this is run every time page height changes
    // Essentially this colorizes every same poster id with a same color
    const colorize = () => [...document.querySelectorAll('.postuids')]
      .filter(e => e.style.backgroundColor !== '#1c1c1c')
      .forEach(e => {
        e.style.backgroundColor = color(e.innerText)
        e.style.color = '#000000'
      })

    const newRepliesListener = (callback) => new MutationObserver(callback).observe(
      document.querySelector('div.answers'), { childList: true }
    )

    // Add some styling to poster ids
    GM_addStyle('#right .threads .thread .postuid {text-shadow: white 0px 0px 5px;}');

    // Colorize poster ids and do it also when new messages are added to page
    colorize();
    newRepliesListener(() => colorize());
  }
});