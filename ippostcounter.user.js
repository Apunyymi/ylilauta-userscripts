// ==UserScript==
// @name Ylilauta.fi: IP Postauslaskuri
// @namespace Violentmonkey Scripts
// @include /^https?://ylilauta.org/.+/.+$/
// @grant none
// @version 0.2
// @description Laskee postausten määrät per IP ja näyttää sen postauksen yläpuolella (Vain kultatili)
// ==/UserScript==

function newRepliesListener(callback) {
  const observer = new MutationObserver(callback);

  observer.observe($('.answers')[0], { childList: true });
}

function countPosts() {
  $('span.postcount').remove();
  
  const ips = {};

  $('.postuid.ip').each(function() {
    const ip = $(this).text();
    
    if(ips[ip]) {
      ips[ip]++;
    } else {
      ips[ip] = 1;
    }
  });
  
  $('.postuid.ip').each(function() {
    const numberOfPosts = ips[$(this).text()];
    
    $(this).append(
      `<span class="postcount" style="margin-left: 0.4em">(${numberOfPosts})</span>`
    );
  });
}

countPosts();
newRepliesListener(() => countPosts());