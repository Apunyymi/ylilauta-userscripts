// ==UserScript==
// @name Ylilauta.fi: Piilota postaukset jotka sisältävät blacklistattuja sanoja
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.2
// @locale en
// @description Piilota postaukset jotka sisältävät blacklistattuja sanoja
// ==/UserScript==

/*
 * Lisää piilotettavat sanat tähän
 */
const blacklist = [
  'add',
  'your',
  'words',
  'here'
];

function shouldBeHidden(div) {
  const post = Array.from(div.childNodes).find(c => c.className === 'post');
  
  // REMOVE .toLowerCase() IF YOU WANT THE MATCHING TO BE CASE-SENSITIVE
  const postcontent = Array.from(post.childNodes).find(c => c.className === 'postcontent').innerText.toLowerCase();
  
  return blacklist.some(word => postcontent.indexOf(word) !== -1);
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