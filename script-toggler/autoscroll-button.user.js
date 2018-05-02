// ==UserScript==
// @name Ylilauta.fi: Skrollaa uudet postaukset näkyville
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/fbfb77e836c8fdaef38d7ce2c4e2a4e3b77f0bba/script-toggler/runsafely.user.js
// @grant none
// @version 0.4
// @locale en
// @description Skrollaa automaattisesti uusimpaan postaukseen.
// ==/UserScript==

runSafely(function () {
  const buttonsRight = document.querySelector('.buttons_right');

  // Sopsy is homo :D Removing elements we stand on
  if (!document.querySelector('.buttons_right')) {
    let buttons = document.querySelector('.threadbuttons');
    if (buttons) {
      let div = document.createElement('div');
      div.classList.add('buttons_right');
      buttons.appendChild(div);
    }
  }

  const buttonsRight = document.querySelector('.buttons_right');

  // Run full code only if needed
  if (localStorage.getItem('autoscrollStorage') === 'true'
    && buttonsRight) {

    function scrollToButton() {
      if (scroll) {
        btn.scrollIntoView(false);
      }
    }

    function newRepliesListener(callback) {
      const observer = new MutationObserver(callback);
      
      observer.observe($('.answers')[0], { childList: true });
    }

    var scroll = false;

    const btn = document.createElement('button');
    btn.innerText = 'Autoscroll';
    btn.className = 'linkbutton';
    btn.disabled = scroll;
    btn.onclick = () => {
      scroll = !scroll;
      btn.innerText = scroll ? 'Lopeta vieritys' : 'Autovieritys';
    }

    buttonsRight.insertBefore(btn, buttonsRight.firstChild);
    newRepliesListener(() => scrollToButton());
  }
});