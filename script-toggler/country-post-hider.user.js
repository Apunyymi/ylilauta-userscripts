// ==UserScript==
// @name Ylilauta.fi: Piilota tietyn maan postaukset
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant none
// @version 0.3
// @locale en
// @description Piilottaa tietyn maan postaukset /coco/ssa
// ==/UserScript==

runSafely(function() {
  if (localStorage.getItem('countryPostHiderStorage') === 'true') {
    const countries = JSON.parse(localStorage.getItem('countryPostHiderList') || '[]');

    function shouldBeHidden(div) {
      const country = $(div).find('.tags:has(img+.postername)>img:first-child');

      if (country.length) {
        return countries.includes(/\(([A-Z]+)\)/.exec(country[0].title)[1]);
      }
    }

    function hide() {
      Array.from(document.querySelectorAll('div.op_post, div.answer'))
        .filter(div => shouldBeHidden(div))
        .map(div => {
          div.hidden = true;
          if (div.parentElement.classList.contains('thread')) {
            div.parentElement.style.display = 'none';
          }
        });
    } 

    function newRepliesListener(callback) {
      const observer = new MutationObserver(callback);
      
      observer.observe($('.answers')[0], { childList: true });
    }

    function isToggled(name) {
      return localStorage.getItem(name) !== "false";
    }

    hide();

    if ($('.answers').length > 0) {
      newRepliesListener(() => hide());
    }

    // Add newly seen countries to localStorage
    const allCountries = JSON.parse(localStorage.getItem('countryPostHiderAllCountries') || '[]');
    let changed = false;

    $('.postinfo>.tags:has(img+.postername)>img:first-child').each((i, e) => {
      if (!allCountries.includes(e.title)) {
        allCountries.push(e.title);
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem('countryPostHiderAllCountries', JSON.stringify(allCountries));
    }
  }
});