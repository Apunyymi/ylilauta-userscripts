// ==UserScript==
// @name Ylilauta.fi: IP Postauslaskuri
// @namespace Violentmonkey Scripts
// @include /^https?://ylilauta.org/.+/.+$/
// @grant none
// @version 0.1
// @description Laskee postausten määrät per IP ja näyttää sen postauksen yläpuolella (Vain kultatili)
// ==/UserScript==

function newRepliesListener(callback) {
  const observer = new MutationObserver(callback);

  observer.observe($('.answers')[0], { childList: true });
}

function countPosts() {
  $('span.postcount').remove();

  $('.postuid.ip').each(function() {
    const ip = $(this).text();
    const numberOfPosts = $(`.postuid.ip:contains(${ip})`).length;

    $(this).append(
      `<span class="postcount" style="margin-left: 0.4em">(${numberOfPosts})</span>`
    );
  });
}

countPosts();
newRepliesListener(() => countPosts());
