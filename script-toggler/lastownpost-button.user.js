// ==UserScript==
// @name Ylilauta.fi: Viimeisin oma postaus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant none
// @version 0.2
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