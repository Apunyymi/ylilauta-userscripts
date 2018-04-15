// ==UserScript==
// @name Ylilauta.fi: Piilota kaikki nimipostaukset
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.2
// @locale en
// @description Piilottaa kaikki nimipostaukset
// ==/UserScript==

function shouldBeHidden(div) {
  const postinfo = Array.from(div.childNodes).find(c => c.className === 'postinfo');
  const tags = Array.from(postinfo.childNodes).find(c => c.className === 'tags');
  const name = Array.from(tags.childNodes).find(c => c.className === 'postername').innerHTML;
  return name !== 'Anonyymi';
}

function hide() {
  Array.from(document.querySelectorAll('div.op_post, div.answer'))
    .filter(div => shouldBeHidden(div))
    .map(div => div.hidden = true);
}

function newRepliesListener(callback) {
  updateQuotes = () => {
    callback();

    return updateQuotes;
  };
}

hide();

newRepliesListener(() => hide());