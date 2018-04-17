// ==UserScript==
// @name Ylilauta.fi: Skrollaa uudet postaukset näkyville
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.3
// @locale en
// @description Skrollaa automaattisesti uusimpaan postaukseen.
// ==/UserScript==

function scrollToButton() {
  if (scroll) {
    btn.scrollIntoView(false);
  }
}

function newRepliesListener(callback) {
  const observer = new MutationObserver(callback);
  
  observer.observe($('.answers')[0], { childList: true });
}

function isToggled(name) {
  return localStorage.getItem(name) !== "false";
}

var scroll = false;

const buttonsRight = document.querySelector('.buttons_right');

if (buttonsRight && isToggled("autoscrollStorage")) {
  var btn = document.createElement('button');
  btn.innerText = 'Autoscroll';
  btn.className = 'linkbutton';
  btn.disabled = scroll;
  btn.onclick = () => {
    scroll = !scroll;
    btn.innerText = scroll ? 'Stop scrolling' : 'Autoscroll';
  }
  buttonsRight.insertBefore(btn, buttonsRight.firstChild);
  newRepliesListener(() => scrollToButton());
}