// ==UserScript==
// @name         Ylilauta: Newestid- ja aktiivisuuspistepäivitin
// @namespace    *://ylilauta.org/*
// @version      1.0
// @description  Extract from YlisToolchain, updates some values on hover
// @locale       en
// @author       Apunyymi
// @match        *://ylilauta.org/*
// @require      https://github.com/AnonyymiHerrasmies/ylilauta-userscripts/raw/5cdc110388e1efdb6685951cc273577eadc4ee4f/script-toggler/runsafely.js
// @grant        none
// ==/UserScript==

runSafely(function() {
	// Don't even run any code if this module is not enabled
	if (localStorage.getItem('updateOnhoverStorage') === 'true') {
		// Throttles updating
		var updateTimer = false;

			// Will give the newest post id (read from Ylilauta main page)
	    function updater() {
	        $.get('/', function (r) {
	            $('.newestid span').text($('#title h2', r)[0].innerText.match(/[0-9]+/g).join(''));

	            $('#left nav.user .activitypoint').text($('nav.user a[href="/preferences?profile"]', r).text());
	        });
	    }

	    // Make the activity point thing a bit more obvious and efficient
	    if ($('#left .activitypoint').length === 0) {
	        $('#left nav.user a[href="/preferences?profile"]').addClass('activitypoint');
	    }

	    // Show newest post id in side panel (and allow its mouseover update)
	    $('#left .user').append('<li style="cursor:pointer;" class="newestid">Newest ID: <span></span></li>');
	    updater();

	    // Final update code
        $('.newestid,.activitypoint').on('mouseenter', function (e) {
	        updater();
	        updateTimer = setInterval(updater, 2000);
	    }).on('mouseleave', function () {
	    	clearInterval(updateTimer);
	        updateTimer = false;
	    });
	}
});