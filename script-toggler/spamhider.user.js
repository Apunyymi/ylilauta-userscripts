// ==UserScript==
// @name Spämminpiiloitin
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant none
// @description Duplikaattipostausten piilotus, sekä paljon toistoa sisältävien viestien piilotus.
// @version 0.5
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

    // Apparently this can be undefined, and it breaks the hidePost-function.
    if (!hiddenPosts) {
      hiddenPosts = JSON.parse(localStorage.getItem('hiddenPosts')) || [];
    }
    
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
    const dupeCountThresold = JSON.parse(localStorage.getItem('hideDuplicateCountThresold') || '"3"');

    // Always false if dupeCountThresold couldn't be cast to a number
    const repetitionRegex = dupeCountThresold > 0 ? new RegExp('/(.+)(?=\\' +dupeCountThresold+ '+)/') : false;

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
    const caseless = (localStorage.getItem('wordBlackListCaseless') || 'false') === 'true';
    const regex = (localStorage.getItem('wordBlackListRegex') || 'false') === 'true';

    if (caseless) {
      for (var i = 0; i < blacklist.length; i++) {
        blacklist[i] = blacklist[i].toLowerCase();
      };
    }

    function shouldBeHidden(el, kkontent) {
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
        let words = kkontent.split(/\W+/g).filter(word =>
          !word.includes('>>') &&
          !word.includes('(AP)') &&
          !word.includes('(Sinä)')
        );

        // Don't test there is only a reflink/no post
        if (words.length > 1) {
          // If there is another post with same kkontent
          if (postMap[kkontent] >= dupeCountThresold) {
            console.log('SpamHider debug: #no' +el.data('msgid')+ ' is a duplicate post: "' +kkontent.substr(0,20)+ '..."');
            return true;
          }

          // Then check the post for unique word count
          if (threshold > 0.0) {
            let ratio = 1.0 * (new Set(words).size) / words.length;
            if (ratio < threshold) {
              console.log('SpamHider debug: #no' +el.data('msgid')+ ' has too few unique words (' +(ratio*100).toPrecision(2)+ '%): "' +kkontent.substr(0,20)+ '..."');
              return true;
            }
          }

          // Then check for pattern repetition without spaces
          if (repetitionRegex && repetitionRegex.test(kkontent)) {
            console.log('SpamHider debug: #no' +el.data('msgid')+ ' is repetitive: "' +kkontent.substr(0,20)+ '..."');
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
        if (kkontent) {
          if (caseless) {
            kkontent = kkontent.toLowerCase();
          }

          let entry = '';

          // First test for regexes (if applicable)
          if (regex) {
            for (let i = 0; i < blacklist.length; i++) {
              if (new RegExp(blacklist[i]).test(kkontent)) {
                console.log('SpamHider debug: #no' +el.data('msgid')+ ' is blacklisted by regex: ' +blacklist[i]);
                return true;
              }
            }
          }

          // and then go full strpos if we're still here
          for (let i = 0; i < blacklist.length; i++) {
            if (kkontent.indexOf(blacklist[i]) !== -1) {
              console.log('SpamHider debug: #no' +el.data('msgid')+ ' is blacklisted by word: ' +blacklist[i]);
              return true;
            }
          }
        }
      }

      // Yay, we made it to the goal \o/
      return false;
    }

    function postMapper(kkontent) {
      if (postMap[kkontent] === undefined) {
        postMap[kkontent] = 1;
      } else {
        postMap[kkontent]++;
      }
    }

    function unhide(id) {
      let el = $('#no' + id);
      let isThreadPage = !!$('#right.thread').length;

      // Reverse hide actions
      if (hideActions.includes('hide')) {
        (isThreadPage ? restorePost : restoreThread)(el.data('msgid'));
      }

      if (hideActions.includes('invisible')) {
        el.attr('hidden', false);

        if (!isThreadPage) {
          el.parent().css('display', '');
        }
      }

      // Remove hide style from reflinks
      $('#right .reflink[style][data-msgid="' +el.data('msgid')+ '"]').each((i, ref) => {
        ref.attributes.removeNamedItem('style');
      });

      // Return true to allow hash change
      return true;
    }

    function hide(isThreadPage = true) {
      let query = processedPosts.length > 0 ?
        $('#no' + processedPosts[processedPosts.length-1]).nextAll() :
        $('#right div.' + (isThreadPage ? 'answer' : 'op_post'));

      let posts = query.map((i, e) => {
        el = $(e);
        return [[el, el.find('.postcontent').text()]];
      });

      // Map the posts first so we know what should be hidden
      posts.each((i, e) => {
        postMapper(e[1]);
      });

      // Then process hides
      posts.each((i, e) => {
        let el = e[0];
        let kkontent = e[1];

        if (shouldBeHidden(el, kkontent)) {
          // Let's check what we haz to do
          if (hideActions.includes('hide')) {
            (isThreadPage ? hidePost : hideThread)(el.data('msgid'), 1);
          }

          if (hideActions.includes('invisible')) {
            el.attr('hidden', true);

            if (!isThreadPage) {
              el.parent().css('display', 'none');
            }
          }

          if (hideActions.some(a => /refs$/.test(a))) {
            hideReflinks(el);
          }
        }
      });
    }

    function hideReflinks(el) {
      $('#right .reflink[data-msgid="' +el.data('msgid')+ '"]').each((i, ref) => {
        if (hideActions.includes('grayrefs')) {
          ref.style.opacity = '0.3';
        }

        if (hideActions.includes('invisiblerefs')) {
          ref.style.display = 'none';
        }
        
        ref.onclick = () => unhide(el.data('msgid'));
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