// ==UserScript==
// @name         Ylilauta: TaaBot
// @namespace    *://ylilauta.org/*
// @version      1.3
// @description  Extract from YlisToolchain, trying to Tää :D over the Ylis!
// @locale       en
// @author       Apunyymi
// @match        *://ylilauta.org/*
// @require      https://github.com/Apunyymi/ylilauta-userscripts/raw/7ca6c42677a4a203e82493c51a071891eeee7184/script-toggler/runsafely.user.js
// @grant        none
// ==/UserScript==

runSafely(function () {
  // Don't even run any code if this module is not enabled
  if (localStorage.getItem('taaBotStorage') === 'true') {
    // Initialize all these global vars
    var runTaaVar = false, // is the Tää :D bot running
      taatimer = false; // used in Tää :D bot
    const taamsgids = [], // shows which msgids have been already tää :D'd
      alertFunc = window.alert; // holds window.alert closure when it's replaced with no-op

    // Init LocalStorage
  	if (localStorage.getItem('ytc_taabot') === null) localStorage.setItem('ytc_taabot', 'false');

    // This function tells if the Tää :D bot is running (and also save choice to localStorage so it persists
    // between new tabs)

    function isTaaRunning(truth = null) {
      if (truth === null) {
        return runTaaVar;
      } else {
        runTaaVar = truth;
        window.alert = runTaaVar ? () => {} : alertFunc;
        localStorage.setItem('ytc_taabot', JSON.stringify(truth));
      }
    }

    // Tää :D bot launcher
    function taaMachine() {
      // if Tää :D bot is NOT running AND we are starting it AND we haz over nine thousand activity points, start the bot
      if (!isTaaRunning() && $('#left nav.user .taabot input')[0].checked && +($('#left nav.user .activitypoint')[0].innerText.match(/(\d+)/g).join("")) > 9000) {
        // plz note that the msgs var is different from the more global one, which is used in miner and bump bot
        // this msgs is just a placeholder to get all post elements, msgids is a shuffled array of all message ids
        let msgids = [],
          msgs = document.querySelectorAll("div[data-msgid]");

        for (let i = 0; i < msgs.length; i++) {
          let msgid = msgs[i].dataset.msgid;

          if (!msgids.includes(msgid) && !taamsgids.includes(msgid)) {
            msgids.push(msgid);
          }
        }

        msgids.sort(function(i) {return Math.random()*2-1;});

        isTaaRunning(true);
        taaBot(msgids.length-1, msgids);

      // if Tää :D bot IS running AND we are stopping the bot, do the Stuntti Seis maneuvre
      } else if (isTaaRunning() && !$(this).find('input')[0].checked) {
        clearTimeout(taatimer);
        isTaaRunning(false);
        taatimer = false;

        taaBlinker(false);
      // else, wtf :D
      } else {
        return false;
      }
    }

    // Tää :D bot
    // Control flow (runs only if box is ticked):
    // - call YBoard JS API to gibe Tää :D to next post in shuffled message id array
    // - check if we haz over nine thousand activity points
    // - if we have more messages to Tää :D and still enough activity points, schedule next run in a second
    function taaBot(i, msgids) {
      if (isTaaRunning()) {
        add_this(msgids[i]);

        taamsgids.push(msgids[i]);

        let enoughaps = $('#left nav.user .taabot input')[0].checked && +($('#left nav.user .activitypoint')[0].innerText.match(/(\d+)/g).join("")) > 9000;

        if (--i > 0 && enoughaps) {
          taatimer = setTimeout(function () {
              taaBot(i, msgids);
          }, 1000);
        } else {
          taatimer = false;
        }

        taaBlinker(taatimer !== false, i);
      }
    }

    function taaBlinker(status = false, count = 0) {
      let e = $('#left .taabot-blinker'),
        title = "";

      if (status) {
        e.addClass('active');
        title = `Jokaiselle viestille ollaan parhaillaan antamassa tää :D (${count})`;
      } else {
        e.removeClass('active');
        if (taamsgids.length !== 0) {
          title = "Tääbotti on tauolla";
        } else {
          title = "Tääbotti ei ole käynnissä";
        }
      }

      e.attr('title', title);
    }

    // Make the activity point thing a bit more obvious and efficient
    if ($('#left .activitypoint').length === 0) {
      $('#left nav.user a[href="/preferences?profile"]').addClass('activitypoint');
    }

    // Add a button to toggle Tää :D bot
    $('#left .user').append('<label class="linkbutton taabot"><input type="checkbox" style="vertical-align:top"> T&auml;&auml; :D</label>');
    $('#left .user .taabot').change(taaMachine);

    // Add the tää :D blinker
    $('#left .user').append('<span class="linkbutton taabot-blinker icon-pointer-upright"></span>');

    // Tää :D every message on page load :D
    if (JSON.parse(localStorage.getItem('ytc_taabot'))) {
      $('#left .user .taabot input')[0].checked = true;
      taaMachine();
    }
  }
});