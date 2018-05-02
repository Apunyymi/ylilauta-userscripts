// ==UserScript==
// @name Ylilauta.fi: Lisää ilmoituksiin luettu-ruksi
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant GM_addStyle
// @version 0.3
// @locale en
// @description Lisää ilmoituksiin ruksin, josta voi klikata ilmoituksen luetuksi avaamatta sitä
// ==/UserScript==

runSafely(function() {
	if (localStorage.getItem('notificationXStorage') === 'true') {
		
		GM_addStyle(`
#notifications .unread p:first-of-type {
	padding-right: 2em;
}
#notifications .unread .linkbutton {
	float: right;
	margin-top: -2em;
	opacity: 0.99;
}`);

		$('#left a[href="javascript:get_notifications()"]').click(() => {
			let t = setInterval(() => {
				if ($('#notifications .unread').length > 0) {
					clearTimeout(t);

					$('#notifications .unread').each((i, e) => {
						let el = $(e);

						let a = document.createElement('a');
						a.classList.add('linkbutton');
						a.innerHTML = '&times;';
						a.onclick = (e) => {
							let el = $(e.target).closest('div.notification');
							$.get(el.find('a.reflink')[0].href, (r) => {
								el.removeClass('unread');
								$(e.target).remove();
							});
						};

						el.append(a);
					});
				}
			}, 200);
		});
	}
});