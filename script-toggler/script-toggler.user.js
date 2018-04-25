// ==UserScript==
// @name Ylilauta: Script toggler
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @version 1.0.4
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require https://gitcdn.xyz/repo/Stuk/jszip/9fb481ac2a294f9c894226ea2992919d9d6a70aa/dist/jszip.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/autoscroll-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/codehighlight.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/downloadall-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/ippostcounter.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/lastownpost-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/e0244bffac2100ab94673eb9eec66b6aed9531ea/script-toggler/namefag-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/86016bcf0c704c07998e2122b42a36af4c73513d/script-toggler/quoteallfromip-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/e0244bffac2100ab94673eb9eec66b6aed9531ea/script-toggler/reverse-image-search-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/show-most-answered.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/ef752100db78d5e69f197e6f7972dafd2185908d/script-toggler/tagpost-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/c73c4487a53cacd66f207addb5c9a1d23d2f09ae/script-toggler/wordhider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/86016bcf0c704c07998e2122b42a36af4c73513d/script-toggler/taa-bot.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/b9d0025ff6e95f6d29af01bfd913a47b15f1f232/script-toggler/colorize-poster-ids.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/dffc0c049204940357458b253c458fdcdbd83e3d/script-toggler/update-onhover-newestid-activitypoint.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/button-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/b9d0025ff6e95f6d29af01bfd913a47b15f1f232/script-toggler/remove-ads.user.js
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
  wordBlackListStorage: 'Sanafiltteri',
  taaBotStorage: 'Tää :D -botti',
  colorizePosterIdsStorage: 'Postaajaväritin',
  updateOnhoverStorage: 'Newestid- ja aktiivisuuspistepäivitin',
  buttonHiderStorage: 'Postauksen nappien piilotus',
  removeAdsStorage: 'Piilota (((mainokset)))'
}

function isToggled(name) {
  const item = localStorage.getItem(name);
  if (item === undefined || item === null || item === 'undefined') {
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
  input.onchange = (e) => localStorage.setItem(name, JSON.stringify(e.target.checked));

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
for (let key in userScripts) {
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

  for (let key in userScripts) {
    $(scriptDiv).append(getInput(key, userScripts[key]));
  }

  // Lisää tähän omat tyylitietueesi skriptejä varten. Nämä ovat käytössä vain asetussivulla.

  GM_addStyle(`.userscript-button {
  line-height: 1em;
  font-size: 1em;
  padding: 2px;
  background-color: #133b5e;
  border-radius: 3px;
  margin-left: 0.2em;
  color: #fff;
}`);

  // Tähän väliin voit lisätä omien skriptien custom-asetuksia

  const fagList = JSON.parse(localStorage.getItem('nameFagHiderList') || '[]').join('\n');
  const wordList = JSON.parse(localStorage.getItem('wordBlackListList') || '[]').join('\n');
  
  const allButtons = JSON.parse(localStorage.getItem('buttonHiderAllButtons') || '[]');
  const allDescriptions = JSON.parse(localStorage.getItem('buttonHiderAllDescriptions') || '[]');
  const hiddenButtonsList = JSON.parse(localStorage.getItem('buttonHiderList') || '[]');

  $(scriptDiv).append('<h3>Nimihomojen piilotus</h3>');
  $(scriptDiv).append(getInput('hideEveryNameFag', 'Piilota ihan kaikki nimihomot'));
  $(scriptDiv).append(`<span class="block">Piilotettavat nimihomot: (tekstikentät tallentuvat kun menet pois niistä)</span>
    <span class="block"><textarea id="userscript-nameFagHiderList" cols="35" rows="5">` + fagList + `</textarea></span>`);

  $(scriptDiv).append('<h3>Sanafiltteri</h3>');
  $(scriptDiv).append(getInput('wordBlackListCaseless', 'Älä välitä sanojen kirjainkoosta'));
  $(scriptDiv).append(getInput('wordBlackListRegex', 'Käytä sanojen sijaan regexejä'));
  $(scriptDiv).append(`<span class="block">Piilotettavat sanat:</span>
    <span class="block"><textarea id="userscript-wordBlackListList" cols="35" rows="5">` + wordList + `</textarea></span>`);

  $(scriptDiv).append('<h3>Postausnappien piilotus</h3>');

  if (allButtons.length === 0) {
    $(scriptDiv).append('<span class="block">Käy ensin jollain lautasivulla, niin skripti löytää piilotettavat napit</span')
  }
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i]
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = hiddenButtonsList.includes(allButtons[i]);
    input.id = 'userscript-hidebutton-' + allButtons[i];
    input.dataset.button = allButtons[i];
    input.onchange = (e) => {
      let a = e.target.dataset.button;

      console.log(a);

      if (e.target.checked) {
        if (!hiddenButtonsList.includes(a)) {
          hiddenButtonsList.push(a);
        }
      } else {
        if (hiddenButtonsList.includes(a)) {
          hiddenButtonsList.splice(hiddenButtonsList.indexOf(a), 1);
        }
      }

      localStorage.setItem('buttonHiderList', JSON.stringify(hiddenButtonsList));
    };

    let button = document.createElement('span');
    button.classList.add('userscript-button');
    button.classList.add(allButtons[i]);

    let label = document.createElement('label');
    label.setAttribute('for', 'userscript-hidebutton-' + allButtons[i]);
    label.innerHTML = allDescriptions[i];

    let spacer = document.createTextNode(' ');

    let span = document.createElement('span');
    span.classList.add('block');

    span.appendChild(input);
    span.appendChild(spacer);
    span.appendChild(button);
    span.appendChild(spacer);
    span.appendChild(label);

    $(scriptDiv).append(span);
  };

  // Custom-asetukset päättyvät

  $('#sessions').after(scriptDiv)

  // Tähän väliin voit lisätä custom-asetusten testejä/automaattitäydennyksiä tms.

  $('#userscript-nameFagHiderList')
    .attr('disabled', $('#userscript-hideEveryNameFag')[0].checked)
    .change((e) => {
      // Siivotaan filtterillä tyhjät rivit pois
      const fags = e.target.value.split('\n').filter((x) => /\S/.test(x));

      localStorage.setItem('nameFagHiderList', JSON.stringify(fags));
    });

  $('#userscript-hideEveryNameFag').change((e) => {
    $('#userscript-nameFagHiderList').attr('disabled', e.target.checked);
  });

  $('#userscript-wordBlackListList').change((e) => {
    const words = e.target.value.split('\n').filter((x) => /\S/.test(x));

    localStorage.setItem('wordBlackListList', JSON.stringify(words));
  });

  // Testit yms. päättyvät

  if (/\?skripta/.test(window.location.href)) {
    switch_preferences_tab('skripta', true);
  }
}