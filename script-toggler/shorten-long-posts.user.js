// ==UserScript==
// @name Postauslyhennin
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant addStyle
// @description Lyhentää pitkät postaukset
// @version 0.2
// ==/UserScript==

runSafely(() => {
	if (localStorage.getItem('shortenLongPostsStorage') === 'true') {
		const thresold = JSON.parse(localStorage.getItem('shortenLongPostsThresold') || '10');
		const shownRows = JSON.parse(localStorage.getItem('shortenLongPostsShownRows') || '8');

		let query = '';
		if ($('#right.thread').length) {
			query = '#right .answer';
		} else if ($('#right.board>div,#right.customboard>div').filter('.threads.style-replies').length) {
			query = '#right .thread .op_post, #right .answer';
		}

		let postSubjectTest = $('#right .postsubject:first-of-type');

		// No need to run if we don't match
		if (postSubjectTest.length && query) {
			let buttonBackground = getComputedStyle(postSubjectTest[0]).backgroundColor;
			let shortenedBorder = getComputedStyle($('.linkbutton:first-of-type')[0]).borderBottomColor;

			GM_addStyle(`
.shortened-post {
	height: ${shownRows}em;
	border-bottom: 1px solid ${shortenedBorder};
	overflow: hidden;
	resize: vertical;
}
.shortenbutton {
	background-color: ${buttonBackground};
	margin: 5px;
}
`);

			function onButtonClick (eve) {
				let el = $(eve.target);
				el.prev().removeClass('shortened-post').css({height: '', maxHeight: ''});
				el.remove();
			}

			function shorten (el) {
				let root = $(el);
				let post = root.find('.post');
				let kkontent = post.find('.postcontent');

				let styles = getComputedStyle(kkontent[0]);
				let fontSize = parseFloat(styles.fontSize);

				if ((kkontent[0].clientHeight / fontSize) > thresold) {
					kkontent.css('max-height', styles.height)
					kkontent.addClass('shortened-post');

					post.append(
						$('<button class="linkbutton shortenbutton">Tätä postausta on lyhennetty, paina tästä niin näet koko viestin.</button>')
							.click(onButtonClick)
					);
				}
			}

			$(query).each((i, el) => {
				shorten(el);
			});
		}
	}
});