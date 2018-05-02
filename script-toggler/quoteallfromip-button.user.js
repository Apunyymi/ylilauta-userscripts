// ==UserScript==
// @name Ylilauta: Lainaa kaikki viestit IP:ltä
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @version 0.2
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