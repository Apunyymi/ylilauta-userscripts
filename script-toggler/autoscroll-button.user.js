// ==UserScript==
// @name Ylilauta.fi: Skrollaa uudet postaukset näkyville
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant none
// @version 0.6
// @locale en
// @description Skrollaa automaattisesti uusimpaan postaukseen.
// ==/UserScript==

runSafely(() => {
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

    const scrollToButton = () => scroll && btn.scrollIntoView(false);

    const newRepliesListener = (callback) => new MutationObserver(callback).observe(
      document.querySelector('div.answers'), { childList: true }
    )

    let scroll = false;

    const btn = document.createElement('button');
    btn.innerText = 'Autovieritys';
    btn.className = 'linkbutton';
    btn.disabled = scroll;
    btn.onclick = () => {
      scroll = !scroll;
      btn.innerText = scroll ? 'Lopeta vieritys' : 'Autovieritys';
    };

    buttonsRight.insertBefore(btn, buttonsRight.firstChild);
    newRepliesListener(() => scrollToButton());
  }
});