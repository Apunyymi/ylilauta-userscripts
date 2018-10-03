// ==UserScript==
// @name Ylilauta.fi: Käänteinen kuvahaku
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant none
// @version 0.8
// @locale en
// @description Lisää nappulan käänteiselle kuvahaulle
// ==/UserScript==

runSafely(function () {
  if (localStorage.getItem('reverseImageSearchStorage') === 'true') {
    function addSearchButtons() {
      [...document.querySelectorAll('div.op_post, div.answer')].map(div => {
        const post = [...div.childNodes].find(n => n.className === 'message')
        if (post === undefined) return

        const figure = [...post.childNodes].find(
          n => n.className && n.className.indexOf('post-file') !== -1
        )
        if (figure === undefined) return
        const href = figure.firstChild.firstChild.href
        if (href === undefined) return

        const postinfo = [...div.childNodes].find(n => n.className === 'postinfo')
        const right = [...postinfo.childNodes].find(n => n.className === 'right')
        const messageoptions = [...right.childNodes].find(n => n.className === 'messageoptions')
        const magnifier = [...messageoptions.childNodes].find(n => n.className === 'icon-button icon-magnifier')

        if (magnifier === undefined) {
          const link = document.createElement('button')
          link.className = 'icon-button icon-magnifier'
          link.title = 'Käänteinen kuvahaku'
          link.onclick = () => {
            const link = document.createElement('a')
            link.href = 'https://images.google.com/searchbyimage?image_url=' + href
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }

          messageoptions.insertBefore(link, messageoptions.children[1])
        }
      })
    }

    const newRepliesListener = (callback) => new MutationObserver(callback).observe(
      document.querySelector('div.answers'), { childList: true }
    )

    addSearchButtons()
    if (document.querySelector('.answers')) {
      newRepliesListener(() => addSearchButtons())
    }
  }
})