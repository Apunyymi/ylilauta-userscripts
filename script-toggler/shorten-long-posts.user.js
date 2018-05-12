// ==UserScript==
// @name Postauslyhennin
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant addStyle
// @description Lyhentää pitkät postaukset
// @version 0.1
// ==/UserScript==

runSafely(() => {
	if (localStorage.getItem('shortenLongPostsStorage') === 'true') {
		const thresold = JSON.parse(localStorage.getItem('shortenLongPostsThresold') || '10');
		const shownRows = JSON.parse(localStorage.getItem('shortenLongPostsShownRows') || '8');

		GM_addStyle(`
.shortened-post {
	max-height: ${shownRows}em;
	border-bottom: 1px solid #d9bfb7;
	overflow: hidden;
	resize: vertical;
}
.shortenbutton {
	background-color: #d9bfb7;
	margin: 5px;
}
`);

		function onButtonClick (eve) {
			let el = $(eve.target);
			el.prev().removeClass('shortened-post');
			el.remove();
		}

		function shorten (el) {
			let root = $(el);
			let post = root.find('.post');
			let kkontent = post.find('.postcontent');

			let fontSize = parseFloat(getComputedStyle(kkontent[0]).fontSize);

			if ((kkontent[0].clientHeight / fontSize) > thresold) {
				kkontent.addClass('shortened-post');

				post.append(
					$('<button class="linkbutton shortenbutton">Tätä postausta on lyhennetty. Paina tästä niin näet koko viestin.</button>')
						.click(onButtonClick)
				);
			}
		}

		let query = '';
		if ($('#right.thread').length) {
			query = '#right .answer';
		} else if ($('#right.board').length) {
			query = '#right .thread';
		}

		if (query) {
			$(query).each((i, el) => {
				shorten(el);
			});
		}
	}
});