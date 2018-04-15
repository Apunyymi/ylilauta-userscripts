// ==UserScript==
// @name Ylilauta.fi: Skrollaa uudet postaukset näkyville
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.2
// @locale en
// @description Skrollaa automaattisesti uusimpaan postaukseen.
// ==/UserScript==

var scroll = false;

const buttonsRight = document.querySelector('.buttons_right');

if (buttonsRight) {
  var btn = document.createElement('button');
  btn.innerText = 'Autoscroll';
  btn.className = 'linkbutton';
  btn.disabled = scroll;
  btn.onclick = () => {
    scroll = !scroll;
    btn.innerText = scroll ? 'Stop scrolling' : 'Autoscroll';
  }
  buttonsRight.insertBefore(btn, buttonsRight.firstChild);
}

function scrollToButton() {
  if (scroll) {
    btn.scrollIntoView(false);
  }
}

function newRepliesListener(callback) {
  updateQuotes = () => {
    callback();

    return updateQuotes;
  };
}

newRepliesListener(() => scrollToButton());