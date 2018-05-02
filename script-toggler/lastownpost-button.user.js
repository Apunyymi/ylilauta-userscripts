// ==UserScript==
// @name Ylilauta.fi: Viimeisin oma postaus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/fbfb77e836c8fdaef38d7ce2c4e2a4e3b77f0bba/script-toggler/runsafely.user.js
// @grant none
// @version 0.3
// @locale en
// @description Skrollaa viimeisimpään omaan postaukseesi
// ==/UserScript==

runSafely(function () {
  const buttonsRight = document.querySelector('.buttons_right');

  if (localStorage.getItem('lastOwnPostStorage') === 'true' 
    && buttonsRight) {

    const btn = document.createElement('button');
    btn.innerText = 'Last own post';
    btn.className = 'linkbutton';
    btn.onclick = () => {
      const posts = document.querySelectorAll('div.own_post');
      posts[posts.length-1].scrollIntoView(true);
    };

    buttonsRight.insertBefore(btn, buttonsRight.firstChild);
  }
});