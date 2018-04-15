// ==UserScript==
// @name Ylilauta.fi: Lataa kaikki
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://gitcdn.xyz/repo/Stuk/jszip/9fb481ac2a294f9c894226ea2992919d9d6a70aa/dist/jszip.js
// @grant none
// @version 0.1
// @description Lataa kaikki mediatiedostot langasta
// ==/UserScript==

function afterLastSlash(text) {
  const parts = text.split('/');
  return parts[parts.length - 1];
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

async function downloadAll() {
  const domMediaUris = $('figcaption').map(
    (i, container) => container.firstChild.href
  );
  const mediaUris = [...domMediaUris];
  const filteredMediaUris = mediaUris.filter(uri => !uri.match(/youtube.com/));

  const zip = new JSZip();

  for (uri of filteredMediaUris) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = afterLastSlash(response.url);

    zip.file(filename, blob);
  }

  const zipFile = await zip.generateAsync({ type: 'blob' });
  const threadId = afterLastSlash(window.location.href);

  downloadContent(zipFile, threadId + '.zip');
}

const downloadAllButton = $('<button />', {
  text: 'Lataa kaikki',
  class: 'linkbutton',
  on: {
    click: () => downloadAll()
  }
});

$('.buttons_right').prepend(downloadAllButton);
