// ==UserScript==
// @name       Ylilauta.fi: Näytä langan poiston syy
// @namespace  Violentmonkey Scripts
// @include    *://ylilauta.org/*
// @require    https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant      none
// @version    0.1
// ==/UserScript==

if (localStorage.getItem('show404DeleteReasonStorage') === 'true'
  && /^404/.test(document.title)) {
  runSafely(() => {
    const id = location.pathname.match(/(\d{8,})/)

    if (id) {
      fetch('https://ylilauta.org/scripts/deletereason.php', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${id[1]}`
      }).then(response => response.text().then(text => {
        const doc = new DOMParser().parseFromString(text, 'text/html')
        const deleted = doc.querySelector('p[style]').innerText.match(/(\d{8,}): (.*)$/)
        if (deleted) {
          document.querySelector('#right>div>p').innerText = `Poiston syy: ${deleted[2]}`
        }
      }))
    }
  })
}