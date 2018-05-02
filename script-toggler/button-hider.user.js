// ==UserScript==
// @name         Ylilauta: Viestinappien piilotus
// @namespace    *://ylilauta.org/
// @version      1.3
// @description  Piilottaa halutut napit viesteistä
// @locale       en
// @match        *://ylilauta.org/*
// @require      https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant        GM_addStyle
// ==/UserScript==

runSafely(function() {
	if (localStorage.getItem('buttonHiderStorage') === 'true') {

		// These are used to get info about what buttons even are here
		const allButtons = [];
		const allDescriptions = [];
		$('.thread:has("figure") .messageoptions a[title]').each((i, e) => {
			let button = [...($(e)[0].classList.values())].filter((x) => x.startsWith('icon-'))[0];

			if (!allButtons.includes(button)) {
				allButtons.push(button);
				allDescriptions.push($(e).attr('title'));
			}
		});

		const before = JSON.parse(localStorage.getItem('buttonHiderAllButtons') || '[]');

		// If there are somehow more buttons added, let's update the possible settings
		if (before.length < allButtons.length) {
			localStorage.setItem('buttonHiderAllButtons', JSON.stringify(allButtons));
			localStorage.setItem('buttonHiderAllDescriptions', JSON.stringify(allDescriptions));
		}

		// And then the main code :D
		const toHide = JSON.parse(localStorage.getItem('buttonHiderList') || '[]');

		if (toHide.length > 0)  {
			let elems = [];

			for (let i = toHide.length - 1; i >= 0; i--) {
				elems.push('#right .postinfo .messageoptions>.' + toHide[i]);
			};

			GM_addStyle(elems.join(',') + '{display: none;}')
		}
	}
});