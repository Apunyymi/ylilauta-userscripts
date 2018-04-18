# Script-toggler

Skripti joka lataa kaikki muut kansion skriptit, ja lisää "Asetukset ja profiili" -sivulle skriptien hallinnan. (Tällä hetkellä pelkkä on/off.)

### Asennus

1. Asenna [Violentmonkey](https://github.com/Violentmonkey/Violentmonkey)
2. Valitse script-toggler.user.js
3. Paina `Raw`-nappulaa, userscript-lisäosan pitäisi ponnauttaa asennusikkunansa auki

### Kehitys

Script-toggler lataa muut skriptit `@require`na. Tämä tarkoittaa käytännössä sitä, että:

- Ladattuja userscriptejä kohdellaan normaalina javascriptinä

- Violentmonkeyn yms. annotaatiot eivät toimi. (Nämä kannattaa kuitenkin jättää paikoilleen, jotta skriptiä voi ajaa myös ilman toggleria)

- Skriptiä ei ajeta kapseloituna, vaan kapselointi pitää tehdä itse.

Userscript-koodiesimerkki:
```javascript
// ==UserScript==
// @name Ylilauta: Nyymin ensimmäinen skripti
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://xxx/nyymin-tarvitsema-kirjasto.js
// @resource highlightCSS https://xxx/nyymin-tarvitsema-tyylitiedosto.css
// @grant GM_addStyle
// @grant GM_getResourceText
// @version 0.1
// @description Ei tee vielä mitään.
// ==/UserScript==
(function () { // Kapselointi

  function newRepliesListener(callback) {
    const observer = new MutationObserver(callback);
    observer.observe($('.answers')[0], { childList: true });
  }

  function isToggled(name) {
    return localStorage.getItem(name) !== "false";
  }

  function nyyminOmaFunktio() {
  	// Skriptisi logiikka tapahtuu täällä
  }

  // Tarkistetaan onko skripti asetettu pois päältä
  if (isToggled("nyyminEkaUserscriptStorage")) {
    nyyminOmaFunktio();

    // Tarkistetaan onko kyseessä sellainen sivu, jossa on .answers-elementti,
    // (ja/tai mitkä tahansa muut rajoitukset)
    // koska koodin ajamista ei voida rajoittaa userscript-annotaatioilla.
    if ($('.answers').length > 0) {
      newRepliesListener(() => nyyminOmaFunktio());
    }
  }

})(); // Kapselointi
```

Skriptin lisääminen script-toggler.user.js:ään:

- Committaa userscriptisi

- Poimi commit-id esim. `git log`ista

- Lisää skriptisi tarvitsemat `@require`t toggleriin ennen omaa skriptiäsi, jotta sen tarvitsemat kirjastot ladataan ennen sitä. 

- Lisää myös kaikki skriptisi tarvitsemat `@resource`t ja `@grant`it

- Lisää `@require`ksi skriptisi commit-kohtainen osoite, esim: 
```
@require https://github.com/Apunyymi/ylilauta-userscripts/raw/COMMIT-ID/script-toggler/nyyminekauserscript.user.js
```

- Lisää skriptillesi checkbox on/off-kytkentää varten:
```
$(scriptDiv).append(getInput("nyyminEkaUserscriptStorage"), " Nyymin eka userscript <br/>");
```

- Lisää mahdolliset muut localStoragea käyttävät kentät

- Tarkista toiminta

- Profit