// ==UserScript==
// @name Ylilauta: Script toggler
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/toggler/reverse-image-search-button.user.js
// @grant none
// ==/UserScript==


function isToggled(name) {
  return localStorage.getItem(name) === "true";
}

function getInput(name) {
  const input = document.createElement('input')
  input.type = "checkbox"
  input.checked = isToggled(name)
  input.onchange = function() {
    localStorage.setItem(name, this.checked)
  }
  return input
}

if (window.location.href.indexOf("/preferences?site") > -1) {
  const preferencesDiv = $('#site');
  
  preferencesDiv.prepend(getInput("reverseImageSearchStorage"), " Käänteinen kuvahaku <br/>");
  
  const header = document.createElement('h3');
  header.innerText = "Skriptit"
  preferencesDiv.prepend(header)
}