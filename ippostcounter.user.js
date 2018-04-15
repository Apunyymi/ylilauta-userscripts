// ==UserScript==
// @name Ylilauta: IP Postauslaskuri
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

  const ipNodes = [...$('.postuid.ip')];
  const ipCounter = ipNodes.reduce((accumulator, ipNode) => {
    const ip = ipNode.innerText;

    if (!accumulator[ip]++) {
      accumulator[ip] = 1;
    }

    return accumulator;
  }, {});

  for (ipNode of ipNodes) {
    const ip = ipNode.innerText;
    const numberOfPosts = ipCounter[ip];

    $(ipNode).append(
      `<span class="postcount" style="margin-left: 0.4em">(${numberOfPosts})</span>`
    );
  }
}

countPosts();
newRepliesListener(() => countPosts());
