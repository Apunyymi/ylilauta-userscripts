// ==UserScript==
// @name       Ylilauta.fi: Näytä langan poiston syy
// @namespace  Violentmonkey Scripts
// @include    *://ylilauta.org/*
// @require    https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant      none
// @version    0.1
// ==/UserScript==

if (localStorage.getItem('show404DeleteReasonStorage') === 'true'
	&& /^404/.test(document.title)) {
	runSafely(() => {
		let id = location.pathname.match(/(\d{8,})/);

		if (id) {
			$.post(siteUrl + '/scripts/deletereason.php', {'id': id[1]},
				(resp) => {
					let deleted = $(resp).filter('p[style]')[0].innerText.match(/(\d{8,}): (.*)$/);

					if (deleted) {
						$('#right>div>p:first-of-type').text('Poiston syy: ' + deleted[2]);
					}
				}
			);
		}
	});
}