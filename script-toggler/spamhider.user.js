// ==UserScript==
// @name Spämminpiiloitin
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant none
// @description Duplikaattipostausten piilotus, sekä paljon toistoa sisältävien viestien piilotus.
// @version 0.5
// ==/UserScript==

runSafely(() => {

  // First run check due to migration from all the other scripts
  let isEnabled = localStorage.getItem('spamHiderStorage')

  if (isEnabled === null) {
    // Check if any anti-spam module is enabled
    let modules = [
      'namefagHiderStorage',
      'countryPostHiderStorage',
      'hideDuplicateThreadsStorage',
      'hideDuplicateAnswersStorage',
      'tagpostHiderStorage',
      'wordBlackListStorage'
    ]

    for (let i = modules.length - 1; i >= 0; i--) {
      if (localStorage.getItem(modules[i]) === 'true') {
        isEnabled = 'true';
        break;
      }
    }

    // Also do some migration as we are on it
    localStorage.setItem(
      'hideDuplicatesStorage',
      JSON.stringify(
        (localStorage.getItem('hideDuplicateThreadsStorage') === 'true') ||
        (localStorage.getItem('hideDuplicateAnswersStorage') === 'true')
      )
    )

    localStorage.setItem('hideActions', JSON.stringify([
      'hide',
      'invisible',
      'grayrefs'
    ]));

    localStorage.setItem('hideTagPostTagList', JSON.stringify([
      'postername',
      'tag text postedbyop',
      'tag text sage',
      'postnumber quotelink',
      'posttime'
    ]))
  }

  if (isEnabled === 'true') {

    function hideThread(id, store) {
      const elm = document.querySelector(id)
      const subject = [...elm.childNodes].find(e => e.className.indexOf('postsubject') !== -1).innerHTML
      const postnumber = [...elm.childNodes].find(e => e.className.indexOf('postnumber') !== -1).innerHTML
      const html = `<p class="hidden" id="hidden_${id}">
            <a onclick="restoreThread(${id})" class="icon-plus" title="Palauta lanka" />
            <span class="hiddensubject">${subject}</span>
            <span class="posttime">' + elm.find('.posttime').html() + '</span>
            ${postnumber}
            </p>`

      elm.insertAdjacentHTML('afterend', html)
      elm.hidden = true;

      const formData = new FormData()
      formData.append('add', 'true')
      formData.append('id', id)

      fetch('https://ylilauta.org/scripts/ajax/hide_ping.php', {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': window.config.ajax.headers['X-CSRF-Token']
        },
        credentials: 'same-origin',
        redirect: 'follow',
        body: formData
      })
    }

    function hidePost(id, store) {
      const elm = document.getElementById('no' + id);
      if (!elm) return

      elm.classList.add('hidden')

      if (store && hiddenPosts.indexOf(id) === -1) {
        hiddenPosts.push(id)
        localStorage.setItem('hiddenPosts', JSON.stringify(hiddenPosts))
      }
    }


    // Set this to true to know in console why specific posts get flagged as spam
    const debug = localStorage.getItem('spamHiderDebug') === 'true'

    let hiddenPosts = JSON.parse(localStorage.getItem('hiddenPosts')) || []

    // General
    const processedPosts = []
    const postMap = {}
    const hideActions = JSON.parse(localStorage.getItem('spamHiderActions')) || [
      'hide',
      'minus',
      'gray'
    ]

    // What is on and what off
    // It needs to be x === 'true' to ensure null does not trigger the thing in first run
    const namefagHiderOn     = localStorage.getItem('namefagHiderStorage')     === 'true'
    const countryPostHiderOn = localStorage.getItem('countryPostHiderStorage') === 'true'
    const hideDuplicatesOn   = localStorage.getItem('hideDuplicatesStorage')   === 'true'
    const tagpostHiderOn     = localStorage.getItem('tagpostHiderStorage')     === 'true'
    const wordBlackListOn    = localStorage.getItem('wordBlackListStorage')    === 'true'

    // Namefags
    const hideAllNameFags = localStorage.getItem('hideEveryNameFag') || false
    const fags = JSON.parse(localStorage.getItem('nameFagHiderList') || '[]')

    // Countrytag posters at /coco/
    const countries = JSON.parse(localStorage.getItem('countryPostHiderList') || '[]')

    // Duplicate posts
    const threshold = JSON.parse(localStorage.getItem('hideAnswersByRatioStorage') || '"0"') / 100
    const dupeCountThresold = JSON.parse(localStorage.getItem('hideDuplicateCountThresold') || '"3"')

    // Always false if dupeCountThresold couldn't be cast to a number
    const repetitionRegex = dupeCountThresold > 0 ? new RegExp('/(.+)(?=\\' +dupeCountThresold+ '+)/') : false

    // Tag posters
    const allowedTags = JSON.parse(localStorage.getItem('hideTagPostTagList')) || [
      'postername',
      'tag text postedbyop',
      'tag text sage',
      'postnumber quotelink',
      'posttime'
    ]

    // Word blacklist
    const blacklist = JSON.parse(localStorage.getItem('wordBlackListList') || '[]')
    const caseless = (localStorage.getItem('wordBlackListCaseless') || 'false') === 'true'
    const regex = (localStorage.getItem('wordBlackListRegex') || 'false') === 'true'

    if (caseless) {
      for (let i = 0; i < blacklist.length; i++) {
        blacklist[i] = blacklist[i].toLowerCase()
      }
    }

    function shouldBeHidden(el, kkontent) {
      // Once a post is processed, there is no coming back
      if (processedPosts.includes(el.dataset.id)) {
        console.log('SpamHider debug: #no' +el.dataset.id+ ' has been already decided')
        return false
      }

      processedPosts.push(el.dataset.id)

      // Ensure we don't hide our own posts or OP in thread
      if (el.className.indexOf('own_post') !== -1 ||
        (document.querySelector('#right.thread') && el.className.indexOf('op_post') !== -1 )) {
        console.log('SpamHider debug: #no' +el.dataset.id+ ' is own post or OP in thread page')
        return false
      }

      // Then start checks
      if (namefagHiderOn) {
        const name = [...el.childNodes].find(e =>
          e.className.indexOf("postinfo") !== -1 &&
          e.className.indexOf("tags") !== -1 &&
          e.className.indexOf("postername") !== -1
        ).innerText

        if (hideAllNameFags) {
          if (name !== 'Anonyymi') {
            console.log('SpamHider debug: #no' +el.dataset.id+ ' is some namefag')
            return true
          }
        } else {
          if (fags.includes(name)) {
            console.log('SpamHider debug: #no' +el.dataset.id+ ' is specific namefag (' +name+ ')')
            return true
          }
        }
      }

      if (countryPostHiderOn) {
        const country = [...el.childNodes].find(e =>
          e.className.indexOf("tags") !== 1 &&
          [...e.childNodes].filter(c => c.tagName === 'img').length !== 0 &&
          [...e.childNodes].filter(c => c.className.indexOf('postername') !== -1).length !== 0
        ).firstChild

        if (country.length && countries.includes(/\(([A-Z]+)\)/.exec(country[0].title)[1])) {
          console.log('SpamHider debug: #no' +el.dataset.id+ ' is in specific country')
          return true
        }
      }

      if (hideDuplicatesOn) {
        // Split by non-word characters.
        let words = kkontent.split(/\W+/g).filter(word =>
          !word.includes('>>') &&
          !word.includes('(AP)') &&
          !word.includes('(Sinä)')
        );

        // Don't test if there is only a reflink/no post
        if (words.length > 1) {
          // If there is another post with same kkontent
          if (postMap[kkontent] >= dupeCountThresold) {
            console.log('SpamHider debug: #no' +el.dataset.id+ ' is a duplicate post: "' +kkontent.substr(0,20)+ '..."')
            return true
          }

          // Then check the post for unique word count
          if (threshold > 0.0) {
            const ratio = (new Set(words).size) / words.length
            if (ratio < threshold) {
              console.log('SpamHider debug: #no' +el.dataset.id+ ' has too few unique words (' +(ratio*100).toPrecision(2)+ '%): "' +kkontent.substr(0,20)+ '..."')
              return true
            }
          }

          // Then check for pattern repetition without spaces
          if (repetitionRegex && repetitionRegex.test(kkontent)) {
            console.log('SpamHider debug: #no' +el.dataset.id+ ' is repetitive: "' +kkontent.substr(0,20)+ '..."')
            return true
          }
        }
      }

      if (tagpostHiderOn) {
        const headers = [...el.childNodes].find(e =>
          e.className.indexOf('postinfo') !== -1 &&
          e.className.indexOf('tags') !== -1 &&
          e.tagName === 'span'
        )

        for (let i = headers.length - 1; i >= 0; i--) {
          if (!allowedTags.includes(headers[i].className)) {
            console.log('SpamHider debug: #no' +el.dataset.id+ ' has a forbidden tag: ' +headers[i].className)
            return true
          }
        }
      }

      if (wordBlackListOn) {
        if (kkontent) {
          if (caseless) {
            kkontent = kkontent.toLowerCase()
          }

          // First test for regexes (if applicable)
          if (regex) {
            for (let i = 0; i < blacklist.length; i++) {
              if (new RegExp(blacklist[i]).test(kkontent)) {
                console.log('SpamHider debug: #no' +el.dataset.id+ ' is blacklisted by regex: ' +blacklist[i])
                return true
              }
            }
          }

          // and then go full strpos if we're still here
          for (let i = 0; i < blacklist.length; i++) {
            if (kkontent.indexOf(blacklist[i]) !== -1) {
              console.log('SpamHider debug: #no' +el.dataset.id+ ' is blacklisted by word: ' +blacklist[i])
              return true
            }
          }
        }
      }

      // Yay, we made it to the goal \o/
      return false
    }

    function postMapper(kkontent) {
      if (postMap[kkontent] === undefined) {
        postMap[kkontent] = 1
      } else {
        postMap[kkontent]++
      }
    }

    function unhide(id) {
      const el = document.querySelector(`#no${id}`)
      const isThreadPage = !!document.querySelector('.answers')

      // Reverse hide actions
      if (hideActions.includes('hide')) {
        (isThreadPage ? restorePost : restoreThread)(el.dataset.id);
      }

      if (hideActions.includes('invisible')) {
        el.hidden = false
        if (!isThreadPage) el.parentElement.style.display = ''
      }

      // Remove hide style from reflinks
      [...document.querySelectorAll(`#right .reflink[style][data-id=${el.dataset.id}]`)]
        .forEach(e => e.removeAttribute('style'))

      // Return true to allow hash change
      return true
    }

    function hide(isThreadPage = true) {
      const query = processedPosts.length > 0
        ? [...document.querySelectorAll(`#no${processedPosts[processedPosts.length-1]}`)]
          .map(e => {
            const siblings = []
            let elem = e.nextElementSibling
            while (elem) {
              siblings.push(elem)
              elem = elem.nextElementSibling
            }
            return siblings
          })
          .reduce((x,y) => x.concat(y), [])
        : document.querySelectorAll(`#right div.${isThreadPage ? 'answer' : 'op_post'}`)

      const posts = [...query].map(e => [e, [...e.childNodes]
        .find(n => n.className.indexOf('message') !== -1).childNodes
      ]).map(arr => {
        arr[1] = [...arr[1]].find(n => n.className.indexOf('postcontent') !== -1).innerText
        return arr
      })

      // Map the posts first so we know what should be hidden
      posts.forEach(e => postMapper(e[1]))

      // Then process hides
      posts.forEach(e => {
        let el = e[0];
        let kkontent = e[1];
        if (shouldBeHidden(el, kkontent)) {
          // Let's check what we haz to do
          if (hideActions.includes('hide')) {
            (isThreadPage ? hidePost : hideThread)(el.dataset.id, 1)
          }

          if (hideActions.includes('invisible')) {
            el.hidden = true
            if (!isThreadPage) el.parentElement.style.display = 'none'
          }

          if (hideActions.some(a => /refs$/.test(a))) hideReflinks(el)
        }
      })
    }

    function hideReflinks(el) {
      document.querySelectorAll(`#right .reflink[data-id="${el.dataset.id}"]`).forEach(e => {
        if (hideActions.includes('grayrefs')) e.style.opacity = '0.3'
        if (hideActions.includes('invisiblerefs')) e.style.display = 'none'
        e.onclick = () => unhide(el.dataset.id)
      })
    }

    const newRepliesListener = (callback) => new MutationObserver(callback).observe(
      document.querySelector('div.answers'), { childList: true }
    )

    const isThreadPage = !!document.querySelector('#right.thread-page')

    hide(isThreadPage)
    if (isThreadPage) newRepliesListener(() => hide(isThreadPage))
  }
})