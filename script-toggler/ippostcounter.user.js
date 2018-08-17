// ==UserScript==
// @name Ylilauta: IP Postauslaskuri
// @namespace Violentmonkey Scripts
// @include /^https?://ylilauta.org/.+/.+$/
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant none
// @version 0.4
// @description Laskee postausten määrät per IP ja näyttää sen postauksen yläpuolella (Vain kultatili)
// ==/UserScript==

runSafely(() => {
  if (localStorage.getItem('ipPostCounterStorage') === 'true') {
    const newRepliesListener = (callback) => new MutationObserver(callback).observe(
      document.querySelector('div.answers'), { childList: true }
    )

    function countPosts() {
      [...document.querySelectorAll('span.postcount')].forEach(
        e => e.parentNode.removeChild(e)
      )

      const ipNodes = [...document.querySelectorAll('.postuid.ip')]

      const ipCounter = ipNodes.reduce((accumulator, ipNode) => {
        const ip = ipNode.innerText
        if (!accumulator[ip]++) accumulator[ip] = 1
        return accumulator
      }, {})

      ipNodes.forEach(node => {
        const numberOfPosts = ipCounter[node.innerText]
        node.insertAdjacentHTML('beforeend', `<span class="postcount" style="margin-left: 0.4em">(${numberOfPosts})</span>`)
      })
    }

    countPosts();

    if (document.querySelectorAll('.answers').length > 0) {
      newRepliesListener(() => countPosts())
    }
  }
})