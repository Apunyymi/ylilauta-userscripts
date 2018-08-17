// ==UserScript==
// @name Lisää nappi koko viestihistorian poistamiseen
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/ownposts.php
// @require https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/64e3859524210c693fbc13adca01edc6acf42c80/script-toggler/runsafely.user.js
// @grant none
// @version 0.5
// ==/UserScript==

if (/^\/ownposts.php/.test(window.location.pathname)
  && localStorage.getItem('deleteAllPostsStorage') === 'true') {
  runSafely(() => {

    function closeDialog(xpath) {
      const element = document.querySelector(xpath)
      element.parentNode.removeChild(element)
      const body = document.querySelector('body')
      body.className = body.className.split(" ")
        .filter(c => c !== 'modal-open')
        .join(" ")
    }

    function openModal() {
      const modalContent = document.createElement('div')
      modalContent.className = 'content'
      const dialog = document.createElement('div')

      const message = document.createElement('h3')
      message.innerText = 'Poista kaikki lähetetyt viestit?'
      dialog.appendChild(message)

      const buttonsDiv = document.createElement('div')
      buttonsDiv.className = 'buttons'

      const confirm = document.createElement('button')
      confirm.onclick = () => {
        closeDialog('#modal-root')
        return deletePosts(true)
      }
      confirm.innerText = 'Poista'
      buttonsDiv.appendChild(confirm)

      const cancel = document.createElement('button')
      cancel.className ='right'
      cancel.onclick = () => {
        closeDialog('#modal-root')
        return false
      }
      cancel.innerText = 'Peruuta'
      buttonsDiv.appendChild(cancel)
      dialog.appendChild(buttonsDiv)

      const body = document.querySelector('body')
      body.className = body.className += " modal-open"

      const modalRoot = document.createElement('div')
      modalRoot.id = 'modal-root'

      const modal = document.createElement('div')
      modal.className = 'modal'
      modal.appendChild(dialog)

      modalRoot.appendChild(modal)
      body.appendChild(modalRoot)
    }

    function deletePosts(confirm=false) {
      if (!confirm) {
        openModal();
        return false;
      } else {
        // Delete in reverse order so messages are deleted before threads.
        [...document.querySelectorAll('a.ref')].reverse().map(e => {
          const formData = new FormData()
          formData.append('id', e.dataset.id)
          formData.append('onlyfile', false)

          fetch('https://ylilauta.org/scripts/ajax/delete.php', {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRF-Token': window.config.ajax.headers['X-CSRF-Token']
            },
            credentials: 'same-origin',
            redirect: 'follow',
            body: formData
          }).then(response => {
            if (response.status === 200) {
              e.parentNode.removeChild(e)
            }
          })
        })
        return true;
      }
    }

    const target = document.querySelector('#right');

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Poista kaikki postaukset';
    deleteButton.className = 'linkbutton';
    deleteButton.onclick = () => deletePosts();

    target.insertBefore(deleteButton, target.firstChild);
  });
}