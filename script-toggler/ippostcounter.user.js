// ==UserScript==
// @name Ylilauta: IP Postauslaskuri
// @namespace Violentmonkey Scripts
// @include /^https?://ylilauta.org/.+/.+$/
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/fbfb77e836c8fdaef38d7ce2c4e2a4e3b77f0bba/script-toggler/runsafely.user.js
// @grant none
// @version 0.3
// @description Laskee postausten määrät per IP ja näyttää sen postauksen yläpuolella (Vain kultatili)
// ==/UserScript==

runSafely(function () {
  if (localStorage.getItem('ipPostCounterStorage') === 'true') {
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

    if ($('.answers').length > 0) {
      newRepliesListener(() => countPosts());
    }
  }
});