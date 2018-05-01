// ==UserScript==
// @name Lisää nappi koko viestihistorian poistamiseen
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/ownposts.php
// @grant none
// ==/UserScript==
(function() {
  if (/^\/ownposts.php/.test(window.location.pathname)
     && localStorage.getItem('deleteAllPostsStorage') === 'true') {
    
    function deletePosts(confirm=false) {
      if (!confirm) {
        const dialog = document.createElement('div');
        dialog.id = 'delete_all_posts';
        dialog.className = 'dialog';
        
        const message = document.createElement('h3');
        message.innerText = 'Poista kaikki lähetetyt viestit?';
        dialog.appendChild(message);
        
        const confirm = document.createElement('button');
        confirm.onclick = () => {
          closeDialog('#delete_all_posts');
          return deletePosts(true);
        }
        confirm.innerText = 'Poista';
        dialog.appendChild(confirm);
        
        const cancel = document.createElement('button');
        cancel.className ='right';
        cancel.onclick = () => {
          closeDialog('#delete_all_posts');
          return false;
        }
        cancel.innerText = 'Peruuta';
        dialog.appendChild(cancel);
        
        $('body').append(dialog);
        return false;
      } else {
        $('.reflink').each(function() {
          const msgid = this.dataset.msgid;
          $.post(siteUrl + '/scripts/ajax/delete.php', {"msgid": msgid}, (data) => console.log(data));
          this.remove();
        });
        return true;
      }
    }
    
    const target = $('#right')[0];
  
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Poista kaikki postaukset';
    deleteButton.className = 'linkbutton';
    deleteButton.onclick = () => deletePosts();

    target.insertBefore(deleteButton, target.firstChild);
  }
})();