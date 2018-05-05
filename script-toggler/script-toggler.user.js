// ==UserScript==
// @name Ylilauta: Script toggler
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @version 1.3.1
// @require https://static.ylilauta.org/js/jquery-3.3.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require https://gitcdn.xyz/repo/Stuk/jszip/9fb481ac2a294f9c894226ea2992919d9d6a70aa/dist/jszip.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/autoscroll-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/codehighlight.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/downloadall-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/ippostcounter.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/lastownpost-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/quoteallfromip-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/reverse-image-search-button.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/show-most-answered.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/taa-bot.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/colorize-poster-ids.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/update-onhover-newestid-activitypoint.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/button-hider.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/remove-ads.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/notification-x.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/show-notificationbar.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/hide-sharebutton.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/a07d1aa3eedb0c5b3e212b96c084fecdaf2f68c0/script-toggler/sort-boardlist.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/bb2e85a91f71db1255b2acbdaca696fd9af09681/script-toggler/delete-all-posts.user.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/4b954a749c4e588ec53926bf141e1e87679a66e0/script-toggler/spamhider.user.js
// @resource highlightCSS https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css
// @grant GM_addStyle
// @grant GM_getResourceText
// ==/UserScript==

// Lisää skriptisi LocalStorage-nimi sekä kuvaus tänne
const userScripts = {
  // Ensin erilliset ominaisuudet
  taaBotStorage: 'Tää :D -botti',
  codeHighlighterStorage: '[code]-blokkien väritys',
  colorizePosterIdsStorage: 'Postaajaväritin',
  updateOnhoverStorage: 'Newestid- ja aktiivisuuspistepäivitin',
  ipPostCounterStorage: 'Näytä käyttäjän postausten määrä (vain kultatilillä)',
  showNotificationBarStorage: 'Näytä ilmoituspalkki lankaa selattaessa',
  sortBoardListStorage: 'Järjestä lautaluettelo lyhenteen mukaan',
  deleteAllPostsStorage: 'Lisää kaikkien postausten poistonappula <a href="https://ylilauta.org/ownposts.php">ownposts.php</a>-sivulle.',
  // Sitten erinäisten asioiden piilottelu
  spamHiderStorage: 'Piilota spämmi',
  buttonHiderStorage: 'Postauksen nappien piilotus',
  removeAdsStorage: 'Piilota (((mainokset)))',
  // Sitten napit
  autoscrollStorage: 'Autoscroll-nappi',
  downloadAllStorage: 'Lataa kaikki -nappi',
  lastOwnPostStorage: 'Viimeisin oma postaus -nappi',
  quoteAllFromIpStorage: 'Vastaa kaikkiin käyttäjän postauksiin -nappi',
  showMostAnsweredStorage: 'Näytä vastatuimmat -nappi',
  reverseImageSearchStorage: 'Käänteinen kuvahaku -nappi',
  notificationXStorage: 'Lisää luettu-ruksi ilmoituksiin'
};

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

  return getBlock([input, spacer, label]);
}

function getNumber(start, end, description, propertyName) {
  const input = document.createElement('input');
  input.value = JSON.parse(localStorage.getItem(propertyName)) || 0;
  input.type = 'number';
  input.min = start;
  input.max = end;

  input.onclick = (e) => {
    if (!e.target.value) return;
    localStorage.setItem(propertyName, JSON.stringify(e.target.value));
  }

  const label = document.createElement('label');
  label.innerHTML = ' ' + description;

  return getBlock([input, label]);
}

function getBlock(innie) {
  const span = document.createElement('span');
  span.classList.add('block');

  if (typeof innie === 'object' && innie.length) {
    for (let i = 0; i < innie.length; i++) {
      span.appendChild(innie[i]);
    }
  } else if (typeof innie === 'string') {
    span.innerHTML = innie;
  } else {
    span.appendChild(innie);
  }

  return span;
}

function getTextarea(name) {
  const textarea = document.createElement('textarea');
  textarea.id = 'userscript-' + name;
  textarea.cols = 35;
  textarea.rows = 5;
  textarea.innerHTML = JSON.parse(localStorage.getItem(name) || '[]').join('\n');
  textarea.onchange = (e) => {
    const kkontent = e.target.value.split('\n').filter((x) => /\S/.test(x));

    localStorage.setItem(name, JSON.stringify(kkontent));
  };

  return getBlock(textarea);
}

function getContainer(innie) {
  const div = document.createElement('div');
  div.classList.add('userscript-scrollcontainer');

  if (typeof innie === 'object' && innie.length) {
    for (let i = 0; i < innie.length; i++) {
      div.appendChild(innie[i]);
    }
  } else if (typeof innie === 'string') {
    div.innerHTML = innie;
  } else {
    div.appendChild(innie);
  }

  return div;
}

runSafely(() => {
  // Varmistetaan kaikkien LocalStorage-muuttujien alustus
  for (let key in userScripts) {
    isToggled(key);
  }

  // Tähän voit lisätä yleisesti hyödyllisiä tyyliohjeita, joista voisi olla muillekin hyötyä
  // Asetussivun CSS on erikseen edellä

  GM_addStyle(`
.hoverlabel {
  display: none;
  position: absolute;
  padding: 5px;
  border: 1px solid #999;
  box-shadow: 0 0 20px 0 #000000;
  border-radius: 3px;
  background-color: #ffe;
  max-width: 95%;
  margin-top: 10px;
}
*:hover > .hoverlabel {
  display: block;
}

.green-blinker {
  border-radius: 1em;
  padding: 3px;
  background: lightgray;
}
.green-blinker.active {
  background: lightgreen;
  animation: greenBlinker 2s infinite;
}
@keyframes greenBlinker {
  0% {opacity: 0;}
  50% {opacity: 1;}
  100% {opacity: 0;}
}`);

  if (/^\/preferences/.test(window.location.pathname)) {
    let tab = document.createElement('li');
    tab.classList.add('tab');
    tab.dataset['tabid'] = 'skripta';
    tab.innerHTML = 'Userscript-hallinta';
    tab.onclick = () => switch_preferences_tab('skripta', true);
    $('li.tab[data-tabid="sessions"]').after(tab);

    let div = document.createElement('div');
    div.id = 'skripta';
    div.classList.add('tab');
    div.style.display = 'none';

    const scriptDiv = $(div);

    scriptDiv.append('<h3>Päällä olevat skriptit</h3>');

    for (let key in userScripts) {
      scriptDiv.append(getInput(key, userScripts[key]));
    }

    // Lisää tähän omat tyylitietueesi skriptejä varten. Nämä ovat käytössä vain asetussivulla.

    GM_addStyle(`
.userscript-button {
  line-height: 1em;
  font-size: 1em;
  padding: 2px;
  background-color: #133b5e;
  border-radius: 3px;
  margin-left: 0.2em;
  color: #fff;
}
.usersript-scrollcontainer {
  display: inline-block;
  padding-right: 2em;
  max-height: 50vh;
  overflow-y: scroll;
}`);

    // Tähän väliin voit lisätä omien skriptien custom-asetuksia

    const allButtons = JSON.parse(localStorage.getItem('buttonHiderAllButtons') || '[]');
    const allDescriptions = JSON.parse(localStorage.getItem('buttonHiderAllDescriptions') || '[]');
    const hiddenButtonsList = JSON.parse(localStorage.getItem('buttonHiderList') || '[]');

    const allCountries = JSON.parse(localStorage.getItem('countryPostHiderAllCountries') || '[]');
    const hiddenCountries = JSON.parse(localStorage.getItem('countryPostHiderList') || '[]');

    const spamHiderActions = JSON.parse(localStorage.getItem('spamHiderActions') || '[]');
    const allSpamHiderActions = {
      hide: 'Piilota viesti hide-toiminnolla',
      invisible: 'Piilota viesti vain näkyvistä',
      grayrefs: 'Erota piilottujen viestien viittaukset heikompina',
      invisiblerefs: 'Piilota piilotettujen viestien viittaukset'
    };

    [
      '<h3>Antispämmiasetukset</h3>',

      '<h4>Piilota viestit joissa on vähemmän kuin:</h4>',
      getInput('hideDuplicatesStorage', 'Käytä duplikaattipiilotinta'),
      getNumber(0, 100, 'prosenttia uniikkeja sanoja', 'hideAnswersByRatioStorage'),

      '<h4>Nimihomojen piilotus</h4>',
      getInput('namefagHiderStorage', 'Käytä nimihomojen piilotusta'),
      getInput('hideEveryNameFag', 'Piilota ihan kaikki nimihomot'),
      getBlock('Piilotettavat nimihomot: (tekstikentät tallentuvat kun menet pois niistä)'),
      getTextarea('nameFagHiderList'),

      '<h4>Tagihomojen piilotus</h4>',
      getInput('tagpostHiderStorage', 'Käytä tagihomojen piilotusta'),
      getBlock('Sallitut class-yhdistelmät: (muuta vain jos tiedät mitä olet tekemässä)'),
      getTextarea('hideTagPostTagList'),

      '<h4>Sanafiltteri</h4>',
      getInput('wordBlackListStorage', 'Käytä sanafiltteriä'),
      getInput('wordBlackListCaseless', 'Älä välitä sanojen kirjainkoosta'),
      getInput('wordBlackListRegex', 'Käytä sanojen sijaan regexejä <sup><a href="https://regex101.com/>(?)</a></sup>'),
      getBlock('Piilotettavat sanat:'),
      getTextarea('wordBlackListList'),

      '<h4>Tiettyjen maiden postauksien piilotus (/coco/)</h4>',
      getInput('countryPostHiderStorage', 'Käytä maalaisten piilotusta')
    ].forEach(e => scriptDiv.append(e));

    if (allCountries.length === 0) {
      scriptDiv.append(getBlock('Käy ensin esimerkiksi <a href="/matkailu/">/coco/</a>ssa, niin skripti löytää piilotettavat maat'));
    }

    elems = [];

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

      elems.push(getBlock([
        input,
        document.createTextNode(' '),
        img,
        document.createTextNode(' '),
        label
      ]));
    };

    scriptDiv.append(getContainer(elems));

    scriptDiv.append('<h4>Mitä tehdään kun viesti pitää hidettää</h4>');

    for (let i = 0; i < allSpamHiderActions.length; i++) {
      let input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = spamHiderActions.includes(i);
      input.id = 'userscript-spamaction-' + i;
      input.onchange = (e) => {
        if (e.target.checked) {
          if (!spamHiderActions.includes(i)) {
            spamHiderActions.push(i);
          }
        } else {
          if (spamHiderActions.includes(i)) {
            spamHiderActions.splice(spamHiderActions.indexOf(i), 1);
          }
        }

        localStorage.setItem('spamHiderActions', JSON.stringify(spamHiderActions));
      };

      let label = document.createElement('label');
      label.setAttribute('for', 'userscript-spamaction-' + i);
      label.innerHTML = allSpamHiderActions[i];

      let spacer = document.createTextNode(' ');

      scriptDiv.append(getBlock([input, spacer, label]));
    };

    scriptDiv.append('<h3>Postausnappien piilotus</h3>');

    if (allButtons.length === 0) {
      scriptDiv.append(getBlock('Käy ensin jollain lautasivulla, niin skripti löytää piilotettavat napit'));
    }

    elems = [];

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

      let span = document.createElement('span');
      span.classList.add('block');


      elems.push(getBlock([
        input,
        document.createTextNode(' '),
        button,
        document.createTextNode(' '),
        label
      ]));
    };

    scriptDiv.append(getContainer(elems));

    // Custom-asetukset päättyvät

    $('#sessions').after(scriptDiv)

    // Tähän väliin voit lisätä custom-asetusten testejä/automaattitäydennyksiä tms.

    $('#userscript-nameFagHiderList').attr('disabled', $('#userscript-hideEveryNameFag')[0].checked);

    $('#userscript-hideEveryNameFag').change((e) => {
      $('#userscript-nameFagHiderList').attr('disabled', e.target.checked);
    });

    // Testit yms. päättyvät

    if (/\?skripta/.test(window.location.href)) {
      switch_preferences_tab('skripta', true);
    }
  }
});