// ==UserScript==
// @name Ylilauta.fi: IP Postauslaskuri
// @namespace Violentmonkey Scripts
// @include /^https?://ylilauta.org/.+/.+$/
// @grant none
// @version 0.1
// @description Laskee postausten määrät per ip
// ==/UserScript==

function newRepliesListener(callback) {
  updateQuotes = () => {
    callback();

    return updateQuotes;
  };
}

function countPosts() {
  $('span.postcount').remove();
  
  $('.postuid.ip').each(function() {
    const ip = $(this).text();
    const numberOfPosts = $(`.postuid.ip:contains(${ip})`).length;
    
    $(this).append(`<span class="postcount" style="margin-left: 0.4em">(${numberOfPosts})</span>`);
  });
}

countPosts();
newRepliesListener(() => countPosts());