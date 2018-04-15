// ==UserScript==
// @name Ylilauta.fi: Tiettyjen nimimerkkien postausten piilotus
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.3
// @locale en
// @description Piilota määriteltyjen käyttäjien postaukset
// ==/UserScript==

/*
 * Syötä käyttäjänimet tähän
 */
const namesToHide = [
  'username1',
  'username2'
];

function newRepliesListener(callback) {
  updateQuotes = () => {
    callback();

    return updateQuotes;
  };
}

function shouldBeHidden(div) {
  const postinfo = Array.from(div.childNodes).find(c => c.className === 'postinfo');
  const tags = Array.from(postinfo.childNodes).find(c => c.className === 'tags');
  const name = Array.from(tags.childNodes).find(c => c.className === 'postername').innerHTML;
  return namesToHide.includes(name);
}

function hide() {
  Array.from(document.querySelectorAll('div.op_post, div.answer'))
    .filter(div => shouldBeHidden(div))
    .map(div => div.hidden = true);
} 

hide();
newRepliesListener(() => hide());
