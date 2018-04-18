// ==UserScript==
// @name Ylilauta: Lainaa kaikki viestit IP:ltä
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @version 0.2
// @description Lainaa kaikki viestit samalta IP:ltä (vaatii Kultatilin)
// ==/UserScript==

(function() {
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

  function isToggled(name) {
    return localStorage.getItem(name) !== "false";
  }

  const quoteAllButton = $('<span />', {
    text: '>>',
    class: 'postuid',
    on: {
      click: quoteAllIps
    }
  });
  
  if (isToggled("quoteAllFromIpStorage")){
    $('.postuid.id').after(quoteAllButton);
  }
})();