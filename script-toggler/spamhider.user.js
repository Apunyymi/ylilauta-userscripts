// ==UserScript==
// @name Spämminpiiloitin
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant none
// @description Duplikaattipostausten piilotus, sekä paljon toistoa sisältävien viestien piilotus.
// @version 0.2
// ==/UserScript==

runSafely(() => {

  // First run check due to migration from all the other scripts
  let isEnabled = localStorage.getItem('spamHiderStorage');

  if (isEnabled === null) {
    // Check if any anti-spam module is enabled
    let modules = [
      'namefagHiderStorage',
      'countryPostHiderStorage',
      'hideDuplicateThreadsStorage',
      'hideDuplicateAnswersStorage',
      'tagpostHiderStorage',
      'wordBlackListStorage'
    ];

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
    );

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
    ]));
  }

  if (isEnabled === 'true') {
    // Set this to true to know in console why specific posts get flagged as spam
    const debug = localStorage.getItem('spamHiderDebug') === 'true';

    // General
    const answers = $('.answers');
    const processedPosts = [];
    const postMap = {};
    const hideActions = JSON.parse(localStorage.getItem('spamHiderActions')) || [
      'hide',
      'minus',
      'gray'
    ];

    // What is on and what off
    // It needs to be x === 'true' to ensure null does not trigger the thing in first run
    const namefagHiderOn     = localStorage.getItem('namefagHiderStorage')     === 'true';
    const countryPostHiderOn = localStorage.getItem('countryPostHiderStorage') === 'true';
    const hideDuplicatesOn   = localStorage.getItem('hideDuplicatesStorage')   === 'true';
    const tagpostHiderOn     = localStorage.getItem('tagpostHiderStorage')     === 'true';
    const wordBlackListOn    = localStorage.getItem('wordBlackListStorage')    === 'true';

    // Namefags
    const hideAllNameFags = localStorage.getItem('hideEveryNameFag') || false;
    const fags = JSON.parse(localStorage.getItem('nameFagHiderList') || '[]');

    // Countrytag posters at /coco/
    const countries = JSON.parse(localStorage.getItem('countryPostHiderList') || '[]');

    // Duplicate posts
    const duplicateThreads = localStorage.getItem('hideDuplicateThreadsStorage') || false;
    const duplicateAnswers = localStorage.getItem('hideDuplicateAnswersStorage') || false;
    const threshold = JSON.parse(localStorage.getItem('hideAnswersByRatioStorage') || '"0"') / 100;

    // Tag posters
    const allowedTags = JSON.parse(localStorage.getItem('hideTagPostTagList')) || [
      'postername',
      'tag text postedbyop',
      'tag text sage',
      'postnumber quotelink',
      'posttime'
    ];

    // Word blacklist
    const blacklist = JSON.parse(localStorage.getItem('wordBlackListList') || '[]');
    const caseless = JSON.parse(localStorage.getItem('wordBlackListCaseless') || 'false');
    const regex = JSON.parse(localStorage.getItem('wordBlackListRegex') || 'false');

    function shouldBeHidden(div) {
      let el = $(div);

      // Once a post is processed, there is no coming back
      if (processedPosts.includes(el.data('msgid'))) {
        console.log('SpamHider debug: #no' +el.data('msgid')+ ' has been already decided');
        return false;
      }

      processedPosts.push(el.data('msgid'));

      // Ensure we don't hide our own posts or OP in thread
      if (el.hasClass('own_post') || ($('#right.thread').length && el.hasClass('op_post'))) {
        console.log('SpamHider debug: #no' +el.data('msgid')+ ' is own post or OP in thread page');
        return false;
      }

      // Then start checks
      if (namefagHiderOn) {
        let name = el.find('.postinfo .tags .postername').text()

        if (hideAllNameFags) {
          if (name !== 'Anonyymi') {
            console.log('SpamHider debug: #no' +el.data('msgid')+ ' is some namefag');
            return true;
          }
        } else {
          if (fags.includes(name)) {
            console.log('SpamHider debug: #no' +el.data('msgid')+ ' is specific namefag (' +name+ ')');
            return true;
          }
        }
      }

      if (countryPostHiderOn) {
        let country = el.find('.tags:has(img+.postername)>img:first-child');

        if (country.length && countries.includes(/\(([A-Z]+)\)/.exec(country[0].title)[1])) {
          console.log('SpamHider debug: #no' +el.data('msgid')+ ' is in specific country');
          return true;
        }
      }

      if (hideDuplicatesOn) {
        // Split by non-word characters.
        let words = el.text().split(/\W+/g).filter(word =>
          !word.includes('>>') &&
          !word.includes('(AP)') &&
          !word.includes('(Sinä)')
        );

        // Don't test there is only a reflink/no post
        if (words.length !== 0) {
          // If there is another post with same kkontent
          if (postMap[el.text()] === undefined) {
            postMap[el.text()] = 1;
          } else {
            postMap[el.text()]++;
            console.log('SpamHider debug: #no' +el.data('msgid')+ ' is a duplicate post: "' +el.text().substr(0,20)+ '..."');
            return true;
          }

          // Then check the post for unique word count
          if (threshold > 0.0) {
            let ratio = 1.0 * (new Set(words).size) / words.length;
            if (ratio < threshold) {
              console.log('SpamHider debug: #no' +el.data('msgid')+ ' has too few unique words (' +(ratio*100).toPrecision(2)+ '%): "' +el.text().substr(0,20)+ '..."');
              return true;
            }
          }

          // Then check for pattern repetition without spaces
          if (/(.+)(?=\4+)/.test(el.text())) {
            console.log('SpamHider debug: #no' +el.data('msgid')+ ' is repetitive: "' +el.text().substr(0,20)+ '..."');
            return true;
          }
        }
      }

      if (tagpostHiderOn) {
        let headers = el.find('.postinfo .tags span');

        for (var i = headers.length - 1; i >= 0; i--) {
          if (!allowedTags.includes(headers[i].className)) {
            console.log('SpamHider debug: #no' +el.data('msgid')+ ' has a forbidden tag: ' +headers[i].className);
            return true;
          }
        }
      }

      if (wordBlackListOn) {
        let kkontent = el.find('.postcontent').text();
        if (kkontent) {
          if (caseless) {
            kkontent = kkontent.toLowerCase();
          }

          let entry = '';

          // This first tests for regexes (if applicable) and then goes full strpos
          if ((regex && blacklist.some(reg => new RegExp(reg).test(kkontent) && (entry = reg)))
            || blacklist.some(word => (kkontent.indexOf(word) !== -1) && (entry = word))) {
            console.log('SpamHider debug: #no' +el.data('msgid')+ ' is blacklisted: ' +entry);
            return true;
          }
        }
      }

      // Yay, we made it to the goal \o/
      return false;
    }

    function hide(isThreadPage = true) {
      let query = processedPosts.length > 0 ?
        $('#no' + processedPosts[processedPosts.length-1]).nextAll() :
        $('#right div.' + (isThreadPage ? 'answer' : 'op_post'));

      query.each((i, el) => {
        if (shouldBeHidden(el)) {
          // Let's check what we haz to do
          if (hideActions.includes('hide')) {
            (isThreadPage ? hidePost : hideThread)(el.dataset.msgid, 1);
          }

          if (hideActions.includes('invisible')) {
            el.hidden = true;

            if (!isThreadPage) {
              el.parentElement.style.display = 'none';
            }
          }

          if (hideActions.some(a => /refs$/.test(a))) {
            hideReflinks(el);
          }
        }
      });
    }

    function hideReflinks(el) {
      $('#right .replies .reflink[data-msgid="' +el.dataset.msgid+ '"]').each((i, ref) => {
        if (hideActions.includes('grayrefs')) {
          ref.style.opacity = '0.3';
        }

        if (hideActions.includes('invisiblerefs')) {
          ref.style.display = 'none';
        }
      });
    }

    function newRepliesListener(callback) {
      const observer = new MutationObserver(callback);

      observer.observe($('.answers')[0], { childList: true });
    }

    let isThreadPage = !!$('#right.thread').length;

    hide(isThreadPage);
    if (isThreadPage) {
      newRepliesListener(() => hide(isThreadPage));
    }
  }
});