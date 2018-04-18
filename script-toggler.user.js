// ==UserScript==
// @name Ylilauta: Script toggler
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require https://gitcdn.xyz/repo/Stuk/jszip/9fb481ac2a294f9c894226ea2992919d9d6a70aa/dist/jszip.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/autoscroll-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/codehighlight.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/downloadall-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/ippostcounter.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/lastownpost-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/namefag-hider.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/quoteallfromip-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/reverse-image-search-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/show-most-answered.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/8d01b6502557aa51ba512864b23c678f223455d1/tagpost-hider.user.js
// @resource highlightCSS https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css
// @grant GM_addStyle
// @grant GM_getResourceText
// ==/UserScript==

function isToggled(name) {
  const item = localStorage.getItem(name);
  if (item === undefined || item === null || item === "undefined") {
    localStorage.setItem(name, false);
    return false;
  }
  return item !== "false";
}

function getInput(name) {
  const input = document.createElement('input');
  input.type = "checkbox";
  input.checked = isToggled(name);
  input.onchange = function() {
    localStorage.setItem(name, this.checked);
  }
  return input;
}

if (window.location.href.indexOf("/preferences?site") > -1) {
  const preferencesDiv = $('#site');
  
  const scriptDiv = document.createElement('div');
  $(scriptDiv).append("<h3>Skriptit</h3>");
  
  $(scriptDiv).append(getInput("autoscrollStorage"), " Autoscroll-nappula <br/>");
  $(scriptDiv).append(getInput("codeHighlighterStorage"), " [code]Koodi[/code]-blokkien väritys <br/>");
  $(scriptDiv).append(getInput("downloadAllStorage"), " Lataa kaikki -nappula <br/>");
  $(scriptDiv).append(getInput("ipPostCounterStorage"), " Näytä käyttäjän postausten määrä (vain kultatilillä) <br/>");
  $(scriptDiv).append(getInput("lastOwnPostStorage"), " Last own post -nappula <br/>");
  $(scriptDiv).append(getInput("namefagHiderStorage"), " Piilota nimipostaukset <br/>");
  $(scriptDiv).append(getInput("quoteAllFromIpStorage"), " Vastaa kaikkiin käyttäjän postauksiin -nappula <br/>");
  $(scriptDiv).append(getInput("reverseImageSearchStorage"), " Käänteinen kuvahaku <br/>");
  $(scriptDiv).append(getInput("showMostAnsweredStorage"), " Näytä vastatuimmat -nappula <br/>");
  $(scriptDiv).append(getInput("tagpostHiderStorage"), " Piilota tagipostaukset <br/>");
  
  preferencesDiv.prepend(scriptDiv)
}