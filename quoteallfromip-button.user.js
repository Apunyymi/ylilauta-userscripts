// ==UserScript==
// @name Ylilauta: Lainaa kaikki viestit IP:ltä
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @version 0.2
// @description Lainaa kaikki viestit samalta IP:ltä (vaatii Kultatilin)
// ==/UserScript==

function quoteAllIps(event) {
  const clickedMessage = $(event.target).parent();
  clickedMessage.children('.postuid.ip').click();

  const clickedIp = clickedMessage.children('.postuid.ip').text();

  const quotes = $('.postuid.ip')
    .map(function() {
      if ($(this).text() === clickedIp) {
        const parent = $(this).parent();
        const postId = parent
          .parents('.answer')
          .first()
          .attr('data-msgid');

        if (postId) {
          return '>>' + postId + '\n';
        }
      }
    })
    .get()
    .join('');

  $('#msg').insertAtCaret(quotes);
}

const quoteAllButton = $('<span />', {
  text: '>>',
  class: 'postuid',
  on: {
    click: quoteAllIps
  }
});

$('.postuid.id').after(quoteAllButton);
