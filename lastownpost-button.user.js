// ==UserScript==
// @name Ylilauta.fi: Viimeisin oma postaus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.2
// @locale en
// @description Skrollaa viimeisimpään omaan postaukseesi
// ==/UserScript==

function isToggled(name) {
  return localStorage.getItem(name) !== "false";
}

const buttonsRight = document.querySelector('.buttons_right');

if (buttonsRight && isToggled("lastOwnPostStorage")) {
  var btn = document.createElement('button');
  btn.innerText = 'Last own post';
  btn.className = 'linkbutton';
  btn.onclick = () => {
    const posts = document.querySelectorAll('div.own_post');
    posts[posts.length-1].scrollIntoView(true);
  }
  buttonsRight.insertBefore(btn, buttonsRight.firstChild);
}