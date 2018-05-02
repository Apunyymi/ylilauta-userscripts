// ==UserScript==
// @name Ylilauta: Lainaa kaikki viestit IP:ltä
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/fbfb77e836c8fdaef38d7ce2c4e2a4e3b77f0bba/script-toggler/runsafely.user.js
// @version 0.3
// @description Lainaa kaikki viestit samalta IP:ltä (vaatii Kultatilin)
// ==/UserScript==

runSafely(function() {
  if (localStorage.getItem('quoteAllFromIpStorage') === 'true') {
    function quoteAllIps(event) {
      const clickedMessage = $(event.target).parent();
      const clickedIp = clickedMessage.children('.postuid.ip').text();

      $('.postuid.ip').each(function() {
        if ($(this).text() === clickedIp) {
          $(this)
            .parent()
            .children('.quotelink')
            .click();
        }
      });

      clickedMessage.children('.postuid.ip').click();
    }

    const quoteAllButton = $('<span />', {
      text: '>>',
      class: 'postuid',
      on: {
        click: quoteAllIps
      }
    });
  
    $('.postuid.id').after(quoteAllButton);
  }
});