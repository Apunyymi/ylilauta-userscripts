// ==UserScript==
// @name Duplikaattien ja toistoa sisältävien vastausten piilotus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @description Duplikaattilankojen ja viestien piilotus, sekä paljon toistoa sisältävien viestien piilotus.
// ==/UserScript==
(function () {
  function isToggled(name) {
    return localStorage.getItem(name) !== "false";
  }

  const answers = $('.answers');
  const processedPosts = [];
  const postMap = {};

  const duplicateThreads = isToggled("hideDuplicateThreadsStorage");
  const duplicateAnswers = isToggled("hideDuplicateAnswersStorage");
  const thresholdString = JSON.parse(localStorage.getItem("hideAnswersByRatioStorage")) || '0';
  const threshold = Number(thresholdString) / 100;

  function hideThreads() {
    const threadMap = {};

    $('.thread').each(function () {
      const text = this.innerText;

      if (threadMap[text] === undefined) {
        threadMap[text] = 1;
      } else {
        threadMap[text]++;
      }

      if (threadMap[text] > 1) {
        const id = $(this).parent().parent()[0].dataset.msgid;
        hideThread(id,true);
      }
    });
  }

  function hidePosts() {
    $('.postcontent').each(function () {

      const id = $(this).parent().parent()[0].dataset.msgid;
      const text = this.innerText;
      const splitted = text.split(/\s+/g);
      const withoutQuotes = splitted.filter(
        word => !word.includes('>>') && !word.includes('(AP)') && !word.includes('(Sinä)'));

      // Säästetään viestit joissa pelkkä viittaus toiseen viestiin,
      // koska viittauksen liitteenä voi olla jotain oikeasti kiinnostavaa.
      if (withoutQuotes.length === 0) return;

      if (processedPosts.includes(id) || text.length === 0) {
        return;
      } else {
        processedPosts.push(id);
      }

      if (postMap[text] === undefined) {
        postMap[text] = 1;
      } else {
        postMap[text]++;
      }

      if (duplicateAnswers && postMap[text] !== undefined && postMap[text] > 1) {
        hidePost(id,false);
        return;
      }

      if (threshold > 0.0) {
        const wordcount = new Set(splitted).size;
        const ratio = 1.0 * wordcount / splitted.length;
        if (wordcount > 0 && ratio < threshold) {
          hidePost(id,false);
        }
      }
    });
  }

  function newRepliesListener(callback) {
    const observer = new MutationObserver(callback);
    observer.observe($('.answers')[0], { childList: true });
  }
  
  if (duplicateThreads && $('.postcontent').length > 0 && answers[0] === undefined) {
    hideThreads()
  } else if (answers[0] !== undefined) {
    hidePosts()
    newRepliesListener(() => hidePosts())
  }
})();