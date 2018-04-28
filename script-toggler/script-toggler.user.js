// ==UserScript==
// @name Ylilauta: Script toggler
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @version 1.1.6
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require https://static.ylilauta.org/js/jquery-3.3.1.min.js
// @require https://gitcdn.xyz/repo/Stuk/jszip/9fb481ac2a294f9c894226ea2992919d9d6a70aa/dist/jszip.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/d951d60837852530460c6226810f8328cca10ba2/script-toggler/autoscroll-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/codehighlight.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/d951d60837852530460c6226810f8328cca10ba2/script-toggler/downloadall-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/ippostcounter.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/lastownpost-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/e0244bffac2100ab94673eb9eec66b6aed9531ea/script-toggler/namefag-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/86016bcf0c704c07998e2122b42a36af4c73513d/script-toggler/quoteallfromip-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/e0244bffac2100ab94673eb9eec66b6aed9531ea/script-toggler/reverse-image-search-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/show-most-answered.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/ef752100db78d5e69f197e6f7972dafd2185908d/script-toggler/tagpost-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/b5e75f5c1ef8447d6a9784fd4f2cac02462c0ffd/script-toggler/wordhider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/ccf6df773aec58a9dae8486fab8e56c6a7cbf51b/script-toggler/taa-bot.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/b9d0025ff6e95f6d29af01bfd913a47b15f1f232/script-toggler/colorize-poster-ids.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/dffc0c049204940357458b253c458fdcdbd83e3d/script-toggler/update-onhover-newestid-activitypoint.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/8047abf99eca0f1848f164a3bb6977112fda2797/script-toggler/button-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/b9d0025ff6e95f6d29af01bfd913a47b15f1f232/script-toggler/remove-ads.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/bd75ffae137e76939a59e41c5dd123a7216aab9e/script-toggler/country-post-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/408fc137f00e1af34a7eb7f53ded4758ea0b4c62/script-toggler/notification-x.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/5a78a3c1e3c253ca672dd0af222ef6966884cb3b/script-toggler/spam-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/97a6369736006daf5706738aac6f0ef4b9ee3c0f/script-toggler/show-notificationbar.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/97a6369736006daf5706738aac6f0ef4b9ee3c0f/script-toggler/hide-sharebutton.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/97a6369736006daf5706738aac6f0ef4b9ee3c0f/script-toggler/sort-boardlist.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/5a78a3c1e3c253ca672dd0af222ef6966884cb3b/script-toggler/spam-hider.user.js
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
  removeAdsStorage: 'Piilota (((mainokset)))',
  countryPostHiderStorage: 'Piilota postaukset tietyistä maista (jos maa näkyy)',
  notificationXStorage: 'Lisää luettu-ruksi ilmoituksiin',
  hideDuplicateThreadsStorage: 'Piilota duplikaattilangat',
  hideDuplicateAnswersStorage: 'Piilota duplikaattivastaukset',
  showNotificationBarStorage: 'Näytä ilmoituspalkki lankaa selattaessa',
  hideShareButtonStorage: 'Piilota jakonappula',
  sortBoardListStorage: 'Järjestä lautaluettelo lyhenteen mukaan'
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

function getSelect(start, end, description, propertyName) {
  let select = document.createElement('select')
  let options = ''
  let parsed = JSON.parse(localStorage.getItem(propertyName)) || 0;
  for (let i=start; i<=end; i++) {
    if (parsed === i.toString()) {
      options += '<option value="'+i+'" selected="selected">'+i+'</option>';
    } else {
      options += '<option value="'+i+'">'+i+'</option>';
    }
  }
  select.innerHTML = options;

  select.onclick = (e) => {
    if (!e.target.value) return;
    localStorage.setItem(propertyName, JSON.stringify(e.target.value));
  }

  const span = document.createElement('span');
  const label = document.createElement('label');
  label.innerHTML = ' ' + description;
  span.appendChild(select);
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

  const allCountries = JSON.parse(localStorage.getItem('countryPostHiderAllCountries') || '[]');
  const hiddenCountries = JSON.parse(localStorage.getItem('countryPostHiderList') || '[]');

  $(scriptDiv).append('<h3>Piilota viestit joissa on vähemmän kuin:</h3>');
  $(scriptDiv).append(getSelect(0, 100, 'prosenttia uniikkeja sanoja (0 asettaa skriptin pois päältä)', 'hideAnswersByRatioStorage'))

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
  for (let i = 0; i < allButtons.length; i++) {
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = hiddenButtonsList.includes(allButtons[i]);
    input.id = 'userscript-hidebutton-' + allButtons[i];
    input.dataset.button = allButtons[i];
    input.onchange = (e) => {
      let a = e.target.dataset.button;

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

  $(scriptDiv).append('<h3>Tiettyjen maiden postauksien piilotus</h3>');

  if (allCountries.length === 0) {
    $(scriptDiv).append('<span class="block">Käy ensin esimerkiksi <a href="/matkailu/">/coco/</a>ssa, niin skripti löytää piilotettavat maat</span')
  }
  for (let i = 0; i < allCountries.length; i++) {
    let countryCode = /\(([A-Z]+)\)/.exec(allCountries[i])[1].toLowerCase();

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = hiddenCountries.includes(allCountries[i]);
    input.id = 'userscript-hidecountry-' + countryCode;
    input.dataset.country = countryCode.toUpperCase();
    input.onchange = (e) => {
      let a = e.target.dataset.country;

      if (e.target.checked) {
        if (!hiddenCountries.includes(a)) {
          hiddenCountries.push(a);
        }
      } else {
        if (hiddenCountries.includes(a)) {
          hiddenCountries.splice(hiddenCountries.indexOf(a), 1);
        }
      }

      localStorage.setItem('countryPostHiderList', JSON.stringify(hiddenCountries));
    };

    let img = document.createElement('img');
    img.src = staticUrl + '/img/flags/' + countryCode + '.png';

    let label = document.createElement('label');
    label.setAttribute('for', 'userscript-hidecountry-' + countryCode);
    label.innerHTML = allCountries[i];

    let spacer = document.createTextNode(' ');

    let span = document.createElement('span');
    span.classList.add('block');

    span.appendChild(input);
    span.appendChild(spacer);
    span.appendChild(img);
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