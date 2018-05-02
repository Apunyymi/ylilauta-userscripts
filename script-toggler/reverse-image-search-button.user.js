// ==UserScript==
// @name Ylilauta.fi: Käänteinen kuvahaku
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant none
// @version 0.6
// @locale en
// @description Lisää nappulan käänteiselle kuvahaulle
// ==/UserScript==

runSafely(function () {
  if (localStorage.getItem('reverseImageSearchStorage') === 'true') {
    function addSearchButtons() {
      Array.from(document.querySelectorAll('div.op_post, div.answer'))
        .map(div => {
          const post = Array.from(div.childNodes).find(n => n.className === 'post');
          if (post === undefined) return;

          const filecontainer = Array.from(post.childNodes).find(
            n => n.className && n.className.indexOf('filecontainer thumbnail file') !== -1
          );
          if (filecontainer === undefined) return;

          const expandlink = Array.from(filecontainer.childNodes).find(n => n.className === 'expandlink');
          if (expandlink === undefined) return;

          const href = expandlink.href;
          if (href === undefined) return;

          const postinfo = Array.from(div.childNodes).find(n => n.className === 'postinfo');
          const messageoptions = Array.from(postinfo.childNodes).find(n => n.className === 'messageoptions');
          const magnifier = Array.from(messageoptions.childNodes).find(n => n.className === 'icon-magnifier');
          
          if (magnifier === undefined) {
            const link = document.createElement('a');
            link.className = 'icon-magnifier';
            link.href = 'https://images.google.com/searchbyimage?image_url=' + href;
            link.title = 'Käänteinen kuvahaku';
            link.target = '_blank';

            messageoptions.insertBefore(link, messageoptions.children[1]);
          }
        });
    }

    function newRepliesListener(callback) {
      const observer = new MutationObserver(callback);
      
      observer.observe($('.answers')[0], { childList: true });
    }

    addSearchButtons();
    if ($('.answers').length > 0) {
      newRepliesListener(() => addSearchButtons());
    }
  }
});