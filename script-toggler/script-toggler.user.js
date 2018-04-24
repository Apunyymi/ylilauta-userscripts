// ==UserScript==
// @name Ylilauta: Script toggler
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require https://gitcdn.xyz/repo/Stuk/jszip/9fb481ac2a294f9c894226ea2992919d9d6a70aa/dist/jszip.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/autoscroll-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/codehighlight.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/downloadall-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/ippostcounter.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/lastownpost-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/c42ade327a44afd8bd86c659746051eacb593bea/script-toggler/namefag-hider.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/quoteallfromip-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/reverse-image-search-button.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/show-most-answered.user.js
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/31a9e9c6a465bb68c12bc0d2361444be87c887c2/script-toggler/tagpost-hider.user.js
// @resource highlightCSS https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css
// @grant GM_addStyle
// @grant GM_getResourceText
// ==/UserScript==

// Lisää skriptisi LocalStorage-nimi sekä kuvaus tänne
const userScripts = {  
  autoscrollStorage: 'Autoscroll-nappula',
  codeHighlighterStorage: '[code]-blokkien väritys',
  downloadAllStorage: 'Lataa kaikki -nappula',
  ipPostCounterStorage: 'Näytä käyttäjän postausten määrä (vain kultatilillä)',
  lastOwnPostStorage: 'Viimeisin oma postaus -nappula',
  namefagHiderStorage: 'Piilota nimihomot',
  quoteAllFromIpStorage: 'Vastaa kaikkiin käyttäjän postauksiin -nappula',
  reverseImageSearchStorage: 'Käänteinen kuvahaku',
  showMostAnsweredStorage: 'Näytä vastatuimmat -nappula',
  tagpostHiderStorage: 'Piilota tagipostaukset',
}

function isToggled(name) {
  const item = localStorage.getItem(name);
  if (item === undefined || item === null || item === 'undefined') {
    localStorage.setItem(name, 'false');
    return false;
  }
  return item !== 'false';
}

function getInput(name, description) {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = isToggled(name);
  input.id = 'userscript-' + name;
  input.onchange = (e) => localStorage.setItem(name, JSON.stringify(e.originalTarget.checked));

  const label = document.createElement('label');
  label.setAttribute('for', 'userscript-' + name);
  label.innerHTML = description;

  const spacer = document.createTextNode(' ');

  const span = document.createElement('span');
  span.classList.add('block');
  
  span.appendChild(input);
  span.appendChild(spacer);
  span.appendChild(label);

  return span;
}

// Varmistetaan kaikkien LocalStorage-muuttujien alustus
for (var key in userScripts) {
  isToggled(key);
}

if (/^\/preferences/.test(window.location.pathname)) {
  const tab = document.createElement('li');
  tab.classList.add('tab');
  tab.dataset['tabid'] = 'skripta';
  tab.innerHTML = 'Userscript-hallinta';
  tab.onclick = () => switch_preferences_tab('skripta', true);
  $('li.tab[data-tabid="sessions"]').after(tab);
  
  const scriptDiv = document.createElement('div');
  scriptDiv.id = 'skripta';
  scriptDiv.classList.add('tab');
  scriptDiv.style.display = 'none';

  $(scriptDiv).append('<h3>Päällä olevat skriptit</h3>');

  for (var key in userScripts) {
    $(scriptDiv).append(getInput(key, userScripts[key]));
  }
  
  // Tähän väliin voit lisätä omien skriptien custom-asetuksia

  $(scriptDiv).append(
    '<h3>Nimihomojen piilotus</h3>' +
    getInput('hideEveryNameFag', 'Piilota ihan kaikki nimihomot') +
    `<span class="block">Piilotettavat nimihomot:</span>
    <span class="block"><textarea id="userscript-nameFagHiderList" cols="35" rows="5" style="white-space: nowrap;"></textarea></span>`);

  $('#userscript-nameFagHiderList')
    .attr('disabled', $('#userscript-hideEveryNameFag').checked())
    .change(() => {
      // Siivotaan filtterillä tyhjät rivit pois
      const fags = $(this).val().split('\n').filter((x) => /\S/.test(x));

      localStorage.setItem('nameFagHiderList', JSON.stringify(fags))
    });

  $('#userscript-hideEveryNameFag').change(() => {
    $('#userscript-nameFagHiderList').attr('disabled', $(this).checked());
  });

  // Custom-asetukset päättyvät

  $('#sessions').after(scriptDiv)

  if (/\?skripta/.test(window.location.href)) {
    switch_preferences_tab('skripta', true);
  }
}