// ==UserScript==
// @name Ylilauta: Lataa kaikki
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://gitcdn.xyz/repo/Stuk/jszip/9fb481ac2a294f9c894226ea2992919d9d6a70aa/dist/jszip.js
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant none
// @version 1.0
// @description Lataa kaikki mediatiedostot langasta
// ==/UserScript==

runSafely(function() {
  const buttonsRight = $('.buttons_right');

  if (localStorage.getItem('downloadAllStorage') === 'true'
    && buttonsRight) {

    function afterLastSlash(text) {
      const parts = text.split('/');
      return decodeURI(parts[parts.length - 1]);
    }

    function downloadContent(content, filename) {
      const href = window.URL.createObjectURL(content);
      const link = $('<a />', {
        href,
        download: filename
      })[0];

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
    }

    async function downloadAll(event) {
      const el = $(event.target);
      el.text('Ladataan...');
      el.attr('disabled', true);

      const domMediaUris = $('figcaption').map(
        (i, container) => container.firstChild.href
      );
      const mediaUris = [...domMediaUris];
      const filteredMediaUris = mediaUris.filter(
        uri => (!downloads.alreadySaved.includes(uri)) && (!uri.match(/youtube.com/))
      );

      let ex_msg = '';

      if (filteredMediaUris.length === 0) {
        el.text('Tiedostoja ei löytynyt!');
      } else {
        const zip = new JSZip();

        let i = 0;
        let ex_count = 0;

        for (uri of filteredMediaUris) {
          el.text('Ladataan... ('+ (++i) +'/'+ filteredMediaUris.length +')');

          try {
            downloads.alreadySaved.push(uri);

            const response = await fetch(uri);
            const blob = await response.blob();

            const filename = afterLastSlash(response.url);

            zip.file(filename, blob);

          } catch (ex) {
            console.log('Zip-loader: ' + ex.toString().match(/(\w+(Error|Exception))/g).pop() + ' @ ' + uri);
            ex_count++;
          }
        }

        if (ex_count !== 0) {
          ex_msg = ' <sup>(' +ex_count+ '!)</sup><span class="hoverlabel">' +ex_count+ ' filun lataus epäonnistui, tarkista konsolista lisätiedot</span>';
        }
        
        el.html('Luodaan zip...' + ex_msg);

        downloads.timesDone++;

        const zipFile = await zip.generateAsync({ type: 'blob' });
        const zipName = $(document).find('title').text() +'-'+ afterLastSlash(window.location.href) + (downloads.timesDone === 1 ? '' : '-'+ downloads.timesDone) +'.zip';

        el.html('Zip luotu!' + ex_msg);

        downloadContent(zipFile, zipName);
      }

      setTimeout(() => el.html('Lataa tiedostot' + ex_msg).attr('disabled', false), 1000, el, ex_msg);
    }

    const downloadAllButton = $('<button />', {
      text: 'Lataa tiedostot',
      class: 'linkbutton',
      on: {
        click: (e) => downloadAll(e)
      }
    });

    const downloads = {
      alreadySaved: [],
      timesDone: 0
    };

    buttonsRight.prepend(downloadAllButton);
  }
});