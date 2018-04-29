// ==UserScript==
// @name Ylilauta.fi: Skrollaa uudet postaukset näkyville
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant none
// @version 0.3
// @locale en
// @description Skrollaa automaattisesti uusimpaan postaukseen.
// ==/UserScript==

runSafely(function () {
  const buttonsRight = document.querySelector('.buttons_right');

  // Sopsy is homo :D Removing elements we stand on
  if (!buttonsRight) {
    let buttons = document.querySelector('.threadbuttons');
    if (buttons) {
      let div = document.createElement('div');
      div.classList.add('buttons_right');
      buttons.appendChild(div);
    }
  }

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