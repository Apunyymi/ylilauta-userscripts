// ==UserScript==
// @name Ylilauta.fi: Viimeisin oma postaus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant none
// @version 0.4
// @locale en
// @description Skrollaa viimeisimpään omaan postaukseesi
// ==/UserScript==

runSafely(() => {
  const buttonsRight = document.querySelector('.buttons_right')

  if (localStorage.getItem('lastOwnPostStorage') === 'true' 
    && buttonsRight) {

    const btn = document.createElement('button')
    btn.innerText = 'Last own post'
    btn.className = 'linkbutton'
    btn.onclick = () => {
      const posts = document.querySelectorAll('div.own_post')
      posts[posts.length-1].scrollIntoView(true)
    }

    buttonsRight.insertBefore(btn, buttonsRight.firstChild)
  }
})