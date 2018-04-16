// ==UserScript==
// @name Ylilauta: Script toggler
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/toggler/reverse-image-search-button.user.js
// @grant none
// ==/UserScript==

/*
 * JSON.parse() is needed because localStorage saves everything as a String.
 */
function isToggled(name) {
  const storageVal = localStorage.getItem(name);
  if (storageVal === "undefined") return true;
  return !!storageVal ? JSON.parse(storageVal) : true;
}

var reverseImageSearch = isToggled("reverseImageSearchStorage");

function reverseImageSearchInput() {
  const input = document.createElement('input')
  input.type = "checkbox"
  input.checked = isToggled("reverseImageSearchStorage")
  input.onchange = function() {
    localStorage.setItem("reverseImageSearchStorage", this.checked)
  }
  return input
}

if (window.location.href.indexOf("/preferences?site") > -1) {
  const preferencesDiv = $('#site');
  
  preferencesDiv.prepend(reverseImageSearchInput(), " Käänteinen kuvahaku <br/>");
  
  const header = document.createElement('h3');
  header.innerText = "Skriptit"
  preferencesDiv.prepend(header)
}