// ==UserScript==
// @name         Userscript-paketti Ylilauta.org:iin
// @version      1.0.33
// @description  Skriptipaketti Ylilaudalle
// @author       Pinkponiautist
// @match        http://ylilauta.org/*
// @match        https://ylilauta.org/*
// @require      https://static.ylilauta.org/js/jquery-3.1.0.min.js
// ==/UserScript==

(function() {

    $.fn.extend({
        insertAtCaret: function(startTag, endTag, e) {
            if (typeof endTag == 'undefined')
                endTag = '';
            if (typeof e == 'undefined')
                e = '';
            return this.each(function() {
                if (document.selection) {
                    sel = document.selection.createRange();
                    sel.text = startTag + sel.text + endTag;
                    if (!e.metaKey && !e.ctrlKey) {
                        this.focus();
                    }
                } else if (this.selectionStart || this.selectionStart == '0') {
                    selectedText = this.value.substr(this.selectionStart, (this.selectionEnd - this.selectionStart));
                    startPos = this.selectionStart;
                    endPos = this.selectionEnd;
                    this.value = this.value.substring(0, startPos) + startTag + selectedText + endTag + this.value.substring(endPos, this.value.length);
                    if (!e.metaKey && !e.ctrlKey) {
                        this.focus();
                    }
                    if (selectedText.length == 0) {
                        this.selectionStart = startPos + startTag.length;
                        this.selectionEnd = startPos + startTag.length;
                    } else {
                        this.selectionStart = this.value.length;
                        this.selectionEnd = this.value.length;
                    }
                } else {
                    this.value += startTag + endTag;
                    if (!e.metaKey && !e.ctrlKey) {
                        this.focus();
                    }
                }
            });
        }
    });

    function setStorage(sname, val) {
        localStorage.setItem(sname, val);
    }

    function getStorage(sname) {
        return localStorage.getItem(sname);
    }

    var allscripts = ['scriptversion', 'filenametitles', 'hoverexpand', 'newestidbar', 'hidename', 'oldstylebantext', 'hideusedactions', 'hideloginname', 'postoptionshide', '4chanstylelinks', 'hidebbcode', 'followedcount', 'postformtotop', 'hideposternames', 'autofunctions', 'videovolume', 'colorids', 'hidepostsbyid', 'wordfilter', 'namefilter', 'filteredcount', 'countopanswers', 'loadfullpngs', 'quickbbcode', 'oldstylejs', 'hidesidebar', 'hidenamefagposts', 'filenamefilter', 'filenametimestamps', 'showresolution', 'boardlistonbottom', 'inthreadsearch', 'sortboardsbyshortname', 'shownboards', 'shownlinks', 'deletejustfile', 'countownanswers', 'hidethreadswofile', 'savelastpost', 'countanswersbyid',
    'wtautoupdate', 'doubleclickidfilter', 'backlinkhover', 'customcss', 'oldpostinfoorder', 'oldmessagebuttons', 'newversionready', 'boardnameform', 'infobeforefile', 'showrepliesonly'];
    var settings = {};

    function checkStorage(reset) {

        if (reset === 'reset') {
            setStorage('firstrun', '1');

            Object.keys(localStorage).forEach(function(key) {
                 if (/hiddenUIDs$/.test(key)) {
                        localStorage.removeItem(key);
                }
            });

            $.each(allscripts, function(i, name) {
                switch (name) {
                    case 'scriptversion':
                        setStorage('scriptversion', GM_info.script.version);
                        break;
                    case 'namefilter':
                        setStorage('namefilter', '');
                        break;
                    case 'wordfilter':
                        setStorage('wordfilter', '');
                        break;
                    case 'filenamefilter':
                        setStorage('filenamefilter', '');
                        break;
                    case 'autofunctions':
                        setStorage('autofunctions', '');
                        break;
                    case 'shownboards':
                        setStorage('shownboards', '');
                        break;
                    case 'shownlinks':
                        setStorage('shownlinks', '');
                        break;
                    case 'customcss':
                        setStorage('customcss', '');
                        break;
                    case 'videovolume':
                        setStorage('videovolume', '100');
                        break;
                    default:
                        setStorage(name, '0');
                        break;
                }
                settings[name] = getStorage(name);
            });
        } else {
            setStorage('firstrun', '1');

            if(GM_info.script.version > getStorage('scriptversion')) {
                $('body').prepend('<div id="scriptupdatenotice" style="display:none; width:100%; background-color: white;padding: 5px 0; text-align: center; position: fixed;"><a href="/preferences?site">Ylilauta Userscript-paketti v' + GM_info.script.version + ' ladattu!</a> <a href="http://pastebin.com/SL4PVkSY" style="color:blue;font-size:0.9em;font-weight:bold" target="blank_">Muutoslogi</a></div>');
                setStorage('scriptversion', GM_info.script.version);
                setStorage('newversionready', '0');
                $('#scriptupdatenotice').slideDown('slow').delay(8000).slideUp('slow');
            }

            $.each(allscripts, function(i, name) {
                if (getStorage(name) == undefined) {
                    switch (name) {
                        case 'namefilter':
                            setStorage('namefilter', '');
                            break;
                        case 'wordfilter':
                            setStorage('wordfilter', '');
                            break;
                        case 'filenamefilter':
                            setStorage('filenamefilter', '');
                            break;
                        case 'autofunctions':
                            setStorage('autofunctions', '');
                            break;
                        case 'shownboards':
                            setStorage('shownboards', '');
                            break;
                        case 'shownlinks':
                            setStorage('shownlinks', '');
                            break;
                        case 'customcss':
                            setStorage('customcss', '');
                            break;
                        case 'videovolume':
                            setStorage('videovolume', '100');
                            break;
                        default:
                            setStorage(name, '0');
                            break;
                    }
                }
            settings[name] = getStorage(name);
            });
        }
    }

    checkStorage();

    if (/preferences/.test(location.pathname)) {

        $('#site').append('<h3>Ylilauta Userscript-paketti v' + getStorage("scriptversion") + '</h3>');
        $('#site').append('<h4>Ylilauta Userscript-paketin skriptien asetukset lÃ¶ytyvÃ¤t tÃ¤Ã¤ltÃ¤. TÃ¤mÃ¤n alla olevat asetukset tallentuvat itsestÃ¤Ã¤n, kun teet muutoksia niihin, mutta tekstikenttien kohdalla on klikattava tekstikentÃ¤n ulkopuolelta sen tallentuakseen.</h4>');
        $('#site').append('<h4>Skriptit ovat tehty Ylilauta 2011-teemalle. <a href="http://pastebin.com/SL4PVkSY" style="color:blue;font-size:0.9em;font-weight:bold" target="blank_">Muutoslogi ja ohjeita</a></h4>');
        $('#site').append('<h3>Viestien automaattinen filtterÃ¶inti</h3><span class="block" style="color:red">Varo tyhjiÃ¤ rivejÃ¤ filttereissÃ¤!</span>');
        $('#site').append('<h4>Nimifiltteri</h4>');
        $('#site').append('<span class="block">Piilottaa viestejÃ¤ viestinimen perusteella. Kirjainkokoa ei oteta huomioon. Vain yksi nimi per rivi.</span>');
        $('#site').append('<span class="block"><textarea class="scripttxtfield" id="namefilter" name="namefilter" cols="35" rows="3" style="white-space: nowrap;"></textarea></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hidenamefagposts" name="hidenamefagposts"> <label for="hidenamefagposts">Piilota kaikki nimellÃ¤ lÃ¤hetetyt viestit</label></span>');
        $('#site').append('<h4>Sanafiltteri</h4>');
        $('#site').append('<span class="block">Piilottaa viestejÃ¤ viestin sisÃ¤llÃ¶n perusteella. Viesti/lanka piilotetaan, jos se sisÃ¤ltÃ¤Ã¤ jonkin mÃ¤Ã¤ritetyistÃ¤ sanoista. Kirjainkokoa ei oteta huomioon. Vain yksi sana/lause per rivi.</span>');
        $('#site').append('<span class="block">Regex toimii lisÃ¤Ã¤mÃ¤llÃ¤ "//" rivin alkuun ja loppuun ilman lainausmerkkejÃ¤.</span>');
        $('#site').append('<span class="block"><textarea class="scripttxtfield" id="wordfilter" name="wordfilter" cols="35" rows="3" style="white-space: nowrap;"></textarea></span>');
        $('#site').append('<h4>Tiedostonimifiltteri</h4>');
        $('#site').append('<span class="block">Piilottaa viestejÃ¤ tiedostonimen perusteella. Viesti/lanka piilotetaan, jos sen tiedoston nimi vastaa jotakin mÃ¤Ã¤ritetyistÃ¤ sanoista. Kirjainkokoa ei oteta huomioon. Vain yksi nimi per rivi.</span>');
        $('#site').append('<span class="block"><textarea class="scripttxtfield" id="filenamefilter" name="filenamefilter" cols="35" rows="3" style="white-space: nowrap;"></textarea></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="deletejustfile" name="deletejustfile"> <label for="deletejustfile">Poista vain tiedosto ja jÃ¤tÃ¤ viesti nÃ¤kyviin</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hidethreadswofile" name="hidethreadswofile"> <label for="hidethreadswofile">Piilota langat, joidenka aloituspostauksessa ei ole tiedostoa</label></span>');
        $('#site').append('<span class="block" style="font-weight:bold" id="filteredcount">' + settings['filteredcount'] + ' ViestiÃ¤ tai lankaa piilotettu filttereillÃ¤</span><span onclick="javascript:localStorage.setItem(\'filteredcount\', 0);$(this).text(\'Laskuri nollattu\');$(\'#filteredcount\').text(\'0 ViestiÃ¤ tai lankaa piilotettu filttereillÃ¤\');" style="color:blue;font-size:0.9em;font-weight:bold;cursor:pointer;">Nollaa</span>');
        $('#site').append('<h3>Langat, viestit ja tiedostot</h3>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hideposternames" name="hideposternames"> <label for="hideposternames">Piilota viestinimet viesteistÃ¤</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hidepostsbyid" name="hidepostsbyid"> <label for="hidepostsbyid">Piilota viestejÃ¤ langoista ID:n perusteella ctrl-klikkaamalla ID:tÃ¤</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="doubleclickidfilter" name="doubleclickidfilter"> <label for="doubleclickidfilter">NÃ¤ytÃ¤ yhden ID:n postaukset tuplaklikkaamalla ID:tÃ¤. Toimii myÃ¶s AP- ja YllÃ¤pitÃ¤jÃ¤/Mod-tageja klikkaamalla.</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="showrepliesonly" name="showrepliesonly"> <label for="showrepliesonly">NÃ¤ytÃ¤ viestin vastaukset tuplaklikkaamalla "Vastaukset:" tekstiÃ¤</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="colorids" name="colorids"> <label for="colorids">VÃ¤rjÃ¤Ã¤ lankakohtaiset ID:t eri vÃ¤reillÃ¤</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="countanswersbyid" name="countanswersbyid"> <label for="countanswersbyid">NÃ¤ytÃ¤ saman kÃ¤yttÃ¤jÃ¤n postausten mÃ¤Ã¤rÃ¤ ID:n perÃ¤ssÃ¤</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hoverexpand" name="hoverexpand"> <label for="hoverexpand">Suurenna kuvat "hoveraamalla"</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="filenametitles" name="filenametitles"> <label for="filenametitles">NÃ¤ytÃ¤ tiedoston koko nimi "hoveraamalla" sen nimeÃ¤</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="loadfullpngs" name="loadfullpngs"> <label for="loadfullpngs">.png-kuvien lÃ¤pinÃ¤kyvyys (lataa koko kuvan, saattaa hidastaa sivun latautumista)</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="backlinkhover" name="backlinkhover"> <label for="backlinkhover">Korosta vastauslinkkiÃ¤ "hoveratessa" vastatun viestin ID viestin esikatseluikkunassa</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="countopanswers" name="countopanswers"> <label for="countopanswers">Laske AP:n vastaukset langan tietoihin</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="countownanswers" name="countownanswers"> <label for="countownanswers">Laske omat vastaukset langan tietoihin</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="filenametimestamps" name="filenametimestamps"> <label for="filenametimestamps">Muuta tiedostonimet UNIX-timestampeiksi</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="infobeforefile" name="infobeforefile"> <label for="infobeforefile">SiirrÃ¤ tiedoston tai upotteen tiedot sen ylÃ¤puolelle</label></span>');
        $('#site').append('<h4>Videoiden oletus Ã¤Ã¤nenvoimakkuus</h4>');
        $('#site').append('<span class="block"><input type="number" min="0" max="100" class="scripttxtfield" id="videovolume" name="videovolume"> %</span>');
        $('#site').append('<h3>Postauslomake</h3>');
        $('#site').append('<h4>Oletustoiminnot</h4>');
        $('#site').append('<span class="block"><input type="text" class="scripttxtfield" id="autofunctions" name="autofunctions"></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hidename" name="hidename"> <label for="hidename">Piilota oma viestinimi oletuksena</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hideusedactions" name="hideusedactions"> <label for="hideusedactions">Piilota toiminnot, joiden kÃ¤yttÃ¶kerrat ovat loppu, tai niitÃ¤ ei voi kÃ¤yttÃ¤Ã¤</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="postoptionshide" name="postoptionshide"> <label for="postoptionshide">Postausasetusten piilotus/paljastus</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hidebbcode" name="hidebbcode"> <label for="hidebbcode">BBcode-nappien piilotus/paljastus ctrl-klikkaamalla viestikentÃ¤stÃ¤</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="savelastpost" name="savelastpost"> <label for="savelastpost">Palauta viimeisin postaus napilla viestiominaisuuksissa</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="quickbbcode" name="quickbbcode"> <label for="quickbbcode">BBcode-pikanÃ¤ppÃ¤imet</label> <span style="color:blue;font-size:0.9em;font-weight:bold;cursor:help;" title="Kun kirjoitat viestikenttÃ¤Ã¤n voit nopeasti lisÃ¤tÃ¤ muotoiluja. Paina ctrl + shift + jotain alla olevista kirjaimista\nA = Spoiler\nB = Bold\nE = Kursivointi\nV = Shadow"> ? </span></span>');
        $('#site').append('<h3>Ulkoasu</h3>');
        $('#site').append('<span class="block" style="font-weight:bold">Tunnuksesta erillinen Custom CSS-laatikko</span>');
        $('#site').append('<span class="block">KÃ¤ytÃ¤ tÃ¤tÃ¤ vain jos et voi kÃ¤yttÃ¤Ã¤ Ylilaudan omaa custom css-laatikkoa.</span>');
        $('#site').append('<span class="block"><textarea class="scripttxtfield" id="customcss" name="customcss" cols="35" rows="3" style="white-space: nowrap;"></textarea></span>');
        $('#site').append('<span class="block">NÃ¤ytÃ¤ sivupalkin lautatarjottimessa alueiden <select class="scriptdropdown" id="boardnameform" name="boardnameform"><option value="0">Nimet</option><option value="1">Lyhenteet</option><option value="2">Lyhenteet ja nimet</option></select></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="oldstylejs" name="oldstylejs"> <label for="oldstylejs">KÃ¤ytÃ¤ vanhaa ulkoasua (Ylilaudalta poistettu yotsuba.js, Sopsyn tekemÃ¤.)</label> <a href="http://pastebin.com/raw.php?i=hyuHFkMk" target="blank_" style="color: #00e;text-decoration: underline;"> Suositeltu custom css tÃ¤mÃ¤n valinnan kanssa</a></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="oldpostinfoorder" name="oldpostinfoorder"> <label for="oldpostinfoorder">Vanha viestitietojen jÃ¤rjestys</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="oldmessagebuttons" name="oldmessagebuttons"> <label for="oldmessagebuttons">Vanhat viestinapit</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="sortboardsbyshortname" name="sortboardsbyshortname"> <label for="sortboardsbyshortname">JÃ¤rjestÃ¤ lautatarjotin lautojen lyhyiden nimien mukaan</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="boardlistonbottom" name="boardlistonbottom"> <label for="boardlistonbottom">NÃ¤ytÃ¤ lautatarjotin myÃ¶s sivun alareunassa</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="hideloginname" name="hideloginname"> <label for="hideloginname">Piilota kÃ¤yttÃ¤jÃ¤nimi</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="4chanstylelinks" name="4chanstylelinks"> <label for="4chanstylelinks">4chan-tyyliset top/bottom/catalog-linkit</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="oldstylebantext" name="oldstylebantext"> <label for="oldstylebantext">Vanha banniteksti</label></span>');
        $('#site').append('<h3>Muu</h3>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="newestidbar" name="newestidbar"> <label for="newestidbar">Uusin viesti-ID ylÃ¤palkkiin</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="wtautoupdate" name="wtautoupdate"> <label for="wtautoupdate">PÃ¤ivitÃ¤ Seuratut Langat-laatikko 30 sekunnin vÃ¤lein</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="inthreadsearch" name="inthreadsearch"> <label for="inthreadsearch">Lankojen sisÃ¤lle ja lankaluetteloon haku-/filtteripalkki</label></span>');
        $('#site').append('<span class="block"><input type="checkbox" class="scriptoption" id="followedcount" name="followedcount"> <label for="followedcount">NÃ¤ytÃ¤ seurattujen lankojen mÃ¤Ã¤rÃ¤ seuratut langat-laatikossa</label></span>');
        $('#site').append('<span style="margin-top: 10px;" class="block"><button id="scriptreset">Resetoi skriptiasetukset</button></span>');

        $('#site').append('<h3>Lautatarjottimesta piilotettavat linkit</h3><span class="block"><button id="resethiddenlinks">TyhjennÃ¤ valinnat</button></span><ul style="list-style-type:none; padding: 0 5px; margin: 3px 0; max-width:800px" id="shownlinksselect"></ul>');
        $('#site').append('<h3>Piilotettavat alalaudat</h3><span class="block"><button id="resethiddenboards">TyhjennÃ¤ valinnat</button></span><ul style="list-style-type:none; padding: 0 5px; margin: 3px 0; max-width:800px" id="shownboardsselect"></ul>');
        $('head').append('<style>#shownboardsselect {-webkit-column-count: 3; -moz-column-count: 3; column-count: 3;}</style>')
        $('head').append('<style>#shownlinksselect {-webkit-column-count: 3; -moz-column-count: 3; column-count: 3;}</style>')

        var shownboards = settings['shownboards'];

        $('.boardlist a').each(function() {

            var boardname = $(this).find('span').contents().get(0).nodeValue;
            var boardshortname = $(this).data('shortname');
            $('#shownboardsselect').append('<li style="display: block; margin: 2px 0"> <input type="checkbox" style="vertical-align:middle;" class="shownboardscheckbox" name="' + boardshortname + '" id="board_' + boardshortname + '"> <label for="board_' + boardshortname + '"> /' + boardshortname + '/ - ' + boardname + '</label> </li>');

            if(new RegExp('\/' + boardshortname + '\/', 'i').test(shownboards)) {
                $('#board_' + boardshortname).prop('checked', true);
                $('#board_' + boardshortname).next().css('opacity', '0.5');
            }

        });

        var shownlinks = settings['shownlinks'];

        $('#left .meta a, #left .user a, #left .customized a').each(function() {

            var linkname = $(this).text();
            if(/(Ilmoitukset)/.test(linkname)) {
                var linkname = 'Ilmoitukset';
            }
            var linkhref = $(this).attr('href').split('/').pop().replace(/(javascript:|\(\)|\.php|\?)/g, '');
            if(linkname == 'Etusivu') {
                var linkhref = 'etusivu';
            }
            $('#shownlinksselect').append('<li style="display: block; margin: 2px 0"> <input type="checkbox" style="vertical-align:middle;" class="shownlinkscheckbox" name="' + linkhref + '" id="link_' + linkhref + '"> <label for="link_' + linkhref + '">' + linkname + '</label> </li>');

            if(new RegExp(linkhref, 'i').test(shownlinks)) {
                $('#link_' + linkhref).prop('checked', true);
                $('#link_' + linkhref).next().css('opacity', '0.5');
            }

        });

        $('#link_get_notifications').parent().after('<li style="display: block; margin: 2px 0"> <input type="checkbox" style="vertical-align:middle;" class="shownlinkscheckbox" name="cse-search-box2" id="link_cse-search-box2"> <label for="link_cse-search-box2">"Hae Ylilaudalta"-laatikko</label> </li>');

        if(new RegExp('cse-search-box2', 'i').test(shownlinks)) {
            $('#link_cse-search-box2').prop('checked', true);
            $('#link_cse-search-box2').next().css('opacity', '0.5');
        }

        if(settings['sortboardsbyshortname'] == '1') {
            $('#shownboardsselect li').each(function() {
                $(this).data('shortname', $(this).children('input').attr('name'));
            });
            if (typeof $('#shownboardsselect li').data('sorted') == 'undefined') {
                $('#shownboardsselect li').sort(function(a, b) {
                    if (typeof $(a).data('shortname') == 'undefined') return -1;
                    if (typeof $(b).data('shortname') == 'undefined') return 1;
                    return $(a).data('shortname').toLowerCase().localeCompare($(b).data('shortname').toLowerCase());
                }).appendTo('#shownboardsselect');
                $('#shownboardsselect li').data('sorted', '1');
            }
        }

        $('#resethiddenboards, #resethiddenlinks').click(function() {

            if($(this).attr('id') == 'resethiddenboards') {
                $('.shownboardscheckbox').prop('checked', false);
                $('#shownboardsselect label').css('opacity', '1');
                setStorage('shownboards', '');
            } else {
                $('.shownlinkscheckbox').prop('checked', false);
                $('#shownlinksselect label').css('opacity', '1');
                setStorage('shownlinks', '');
            }

        });

    }

    $('#scriptreset').click(function() {
        var confirmation = confirm('Nollaa Ylilauta Userscript-paketti-asetukset?');
        if (confirmation == true) {
            checkStorage('reset');

            $('.scriptoption').each(function() {
                var optname = $(this).attr('id');
                var optvalue = getStorage(optname);
                if (optvalue !== '0') {
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                }
            });

            $('.scripttxtfield').each(function() {
                var optname = $(this).attr('id');
                var optvalue = getStorage(optname);
                $(this).val(optvalue);
            });

            alert('Asetukset resetoitu');
        } else {
            return false;
        }
    });

    $('.scriptoption').each(function() {
        var optname = $(this).attr('id');
        var optvalue = settings[optname];
        if (optvalue !== '0') {
            $(this).prop('checked', true);
        } else {
            $(this).prop('checked', false);
        }
    });

    $('.scriptdropdown').each(function() {
        var optname = $(this).attr('id');
        var optvalue = settings[optname];
        $(this).val(optvalue);
    });

    $('.scripttxtfield').each(function() {
        var optname = $(this).attr('id');
        var optvalue = settings[optname];
        $(this).val(optvalue);
    });

    $('.scriptdropdown').change(function() {
        var optname = $(this).attr('id');
        var fieldval = $(this).val();
        setStorage(optname, fieldval);

    });

    $('.scripttxtfield').change(function() {
        var optname = $(this).attr('id');
        var fieldval = $(this).val();
        setStorage(optname, fieldval);
    });

    $('.scriptoption').change(function() {
        var optname = $(this).attr('id');
        var optvalue = getStorage(optname);
        if (optvalue !== '0') {
            setStorage(optname, '0');
        } else {
            setStorage(optname, '1');
        }
    });

    $('.shownboardscheckbox').change(function() {
        var board = $(this).attr('name');
        if(!$(this).is(':checked')) {
            setStorage('shownboards', getStorage('shownboards').replace(new RegExp('(\/' + board + '\/,)', 'i'), ''));
            $(this).next().css('opacity', '1');
        } else {
            setStorage('shownboards', getStorage('shownboards') + '/' + board + '/,');
            $(this).next().css('opacity', '0.5');
        }

    });

    $('.shownlinkscheckbox').change(function() {
        var linkhref = $(this).attr('name');
        if(!$(this).is(':checked')) {
            setStorage('shownlinks', getStorage('shownlinks').replace(new RegExp('(' + linkhref.replace(/\?/, '') + ',)', 'i'), ''));
            $(this).next().css('opacity', '1');
        } else {
            setStorage('shownlinks', getStorage('shownlinks') + linkhref + ',');
            $(this).next().css('opacity', '0.5');
        }

    });

    //
    //
    // SKRIPTIT ALKAA
    //
    //

    if(settings['customcss'] !== '' || undefined) {

        var customcss = settings['customcss'];

        $('head').append('<style>' + customcss + '</style>');

    }

    if (settings['hoverexpand'] !== '0' || undefined) {


        $('.threads.style-replies .thumbnail .imagefile').hover(

            function() {
                if (!$(this).closest('.filecontainer').hasClass('thumbnail') || /naamapalmu\.com/i.test($(this).closest('.filecontainer').find('figcaption a').attr("href")) && $(this).parents('a').hasClass('playembedlink')) return;
                if($(this).parents('a').hasClass('playembedlink') && $(this).parents('a').data('embedsource') == 'local') {
                    $(this).parent().find('span.overlay').hide();
                    var imgurl = $(this).closest('.filecontainer').find('figcaption a').attr("href");
                    var windowwidth = $(window).width();
                    var maxwidth = windowwidth / 2 + 'px';


                    $(this).click(function() {
                        $('body').find('#hoverimgcontainer').remove();
                        $(this).parent().find('span').show();
                        clearInterval(updateTrackbar);
                    });
                } else if(!$(this).parents('a').hasClass('playembedlink')) {
                    var imgurl = $(this).parents('a').attr("href");
                    var windowwidth = $(window).width();
                    var thispos = $(this).offset();
                    var thiswidth = $(this).outerWidth(true);
                    var maxwidth = windowwidth - (thispos.left + thiswidth) - 4 + 'px';
                    $('body').append('<img style="position:fixed;max-width:' + maxwidth + ';max-height:100%;top:0px;right:0px;z-index:9001;" class="hoverimage" src="' + imgurl + '">');

                    $(this).click(function() {
                        $('body').find('.hoverimage, #trackbar').remove();
                        trackwidth = 0;
                        tracktop = 0;
                    });
                }
            },

            function() {
                $('body').find('.hoverimage, #trackbar, #hoverimgcontainer').remove();
                $(this).parent().find('span').show();
                if(typeof(updateTrackbar) !== 'undefined') { clearInterval(updateTrackbar) };
                trackwidth = 0;
                tracktop = 0;
            }

        );

        $('.threads.style-replies .playembedlink').hover(function() {

            if($(this).data('embedsource') == 'local') {

                var imgurl = $(this).closest('.post').find('figcaption a').attr("href");

                if(/naamapalmu\.com/i.test(imgurl)) return;

                var windowwidth = $(window).width();
                var maxwidth = windowwidth / 2 + 'px';

                if($(this).find('.icon-floppy-disk').length == 0) {
                    var posterurl = $(this).find('img').attr('src');
                } else {
                    maxwidth = '200px';
                    var posterurl = '//static.ylilauta.org/img/logo/norppa_ylilauta.svg';
                }

                $('body').append('<div id="hoverimgcontainer" style="position:fixed;top:0;right:0;max-width' + maxwidth + '"><video autoplay poster="' + posterurl + '" style="position:fixed;max-width:' + maxwidth + ';max-height:calc(100% - 2px);top:0;right:0px;z-index:9001;" class="hoverimage"><source src="' + imgurl  + '"></video><div id="trackbar" style="height:2px;background-color:#464646;z-index:100;position:fixed;right:0"><div id="trackindicator" style="height:2px;background-color:red;z-index:609;width:0%;border-right:1px solid #B9B9B9;transition-property: width,;transition-timing-function: linear;transition-duration: 0.2s;"></div></div></div>');
                $('#hoverimgcontainer').append("<script>var loc = 0;var videoLength = 0;var indicatorLoc = 0;var trackwidth = 0;var tracktop = 0;function asd(){videoLength = $('.hoverimage')[0].duration;loc=$('.hoverimage')[0].currentTime+0.2;if(loc=='undefined'){loc=0};if(loc < 1){trackwidth=$('.hoverimage').innerWidth();$('#trackbar').css('width',trackwidth);tracktop=$('.hoverimage').innerHeight();$('#trackbar').css('top',tracktop);};indicatorLoc=(loc/videoLength)*100+'%';$('#trackindicator').css({'width':indicatorLoc,'transition-duration': '0.2s'})};$('.hoverimage')[0].onended=function(){$('#trackindicator').css({'width':'0','transition-duration':'0s'});$('.hoverimage')[0].currentTime=0;$('.hoverimage')[0].play();};var updateTrackbar=setInterval(function(){asd();},200);</script>");
                $('video.hoverimage').prop('volume', parseInt(getStorage('videovolume')) / 100);


                $(this).click(function() {
                    $('body').find('.hoverimage')[0].pause();
                    $('body').find('#hoverimgcontainer').remove();
                    $(this).parent().find('span').show();
                    clearInterval(updateTrackbar);
                });

            }

        }, function() {

            if($(this).data('embedsource') == 'local') {
                $('body').find('.hoverimage')[0].pause();
                $('body').find('.hoverimage, #trackbar, #hoverimgcontainer').remove();
                $(this).parent().find('span').show();
                if(typeof(updateTrackbar) !== 'undefined') { clearInterval(updateTrackbar) };
                trackwidth = 0;
                tracktop = 0;
            }

        });

    }

    if (settings['newestidbar'] !== '0' || undefined) {
        $('nav.customized').append('<span style="cursor:pointer;" class="newestid">Newest ID: <span></span> /</span>');
        /*if(/(nosidebar|2011)/.test($('link[rel="stylesheet"]').attr('href'))) {
            $('.newestid span').after(' / ');
        }*/
        if(settings['boardlistonbottom'] == '0') {
            $(".newestid span").load("/scripts/newestid.php");
        }

        $(".newestid").click(function() {
            $('.newestid span').load("/scripts/newestid.php");
        });
    }

    if(settings['hidenamefagposts'] !== '0' || undefined) {

        $('.op_post').each(function() {

            if($(this).find('.postername').text() != 'Anonyymi') {
                $(this).closest('.thread').remove();
                var filteredcount = parseInt(settings['filteredcount']);
                setStorage('filteredcount', ++filteredcount);
            }

        });

        $('.answer').each(function() {

            if($(this).find('.postername').text() != 'Anonyymi') {
                $(this).remove();
                var filteredcount = parseInt(settings['filteredcount']);
                setStorage('filteredcount', ++filteredcount);
            }

        });
    }

    if(settings['namefilter'] !== '' || undefined) {

        var matchName = function(name) {
            var bannednames = settings['namefilter'].toLowerCase().replace(/[\r\n]+/g, ',').split(',');
            return bannednames.indexOf(name);
        };

        $('.op_post').each(function() {

            var name = $(this).find('.postername').text().toLowerCase();
            var matchtonamefilter = matchName(name);

            if(matchtonamefilter > '-1') {
                window.location = 'javascript:' + $(this).find('.postinfo').find('a[onclick*="hideThread"]').attr('onclick');
                $(this).closest('.thread').remove();
                var filteredcount = parseInt(settings['filteredcount']);
                setStorage('filteredcount', ++filteredcount);
            }

        });

        $('.answer').each(function() {
            var name = $(this).find('.postername').text().toLowerCase();
            var matchtonamefilter = matchName(name);

            if(matchtonamefilter > '-1') {
                $(this).remove();
                var filteredcount = parseInt(settings['filteredcount']);
                setStorage('filteredcount', ++filteredcount);
            }

        });

    }

    if (settings['hideposternames'] !== '0' || undefined) {
        $('.postername').text('');
    }

    if (settings['hidename'] !== '0' || undefined) {
        $('input[name="hide_poster_name"]').prop('checked', true);
    }

    if (settings['oldstylebantext'] !== '0' || undefined) {
        $('.thread .banned').each(function() {
            var bantxt = $(this).text().substring(1,$(this).text().length-1).replace(/(estetty\:\s|bannattu\:\s|jokin muu syy\:\s)+((\d\.?)+)?/i,'');
            var oldbantxt = '<p class="banned" style="margin-top:4px!important">' + bantxt + '</p>';
            var thismsg = $(this).closest(".op_post, .answer").find(".post");
            $(this).remove();
            $(thismsg).append(oldbantxt);
            $('.banned').css({
                'display': 'table',
                'text-transform': 'uppercase',
                'white-space': 'nowrap',
                'padding': '4px 7px',
                'margin': '5px',
                'border-radius': '2px',
                'border': '2px solid #F00'
            });
        });
    }

    if (settings['4chanstylelinks'] !== '0' || undefined) {

        $('p.navigatebar a').hide();
        $('p.navigatebar').text('');

        $('span.disabled').filter(":contains('|')").hide();
        $('.button').filter(":contains('Lankaluettelo')").hide();

        $('p.navigatebar').prepend('<span style="margin-right:6px;">[<a href="javascript:location.reload();">PÃ¤ivitÃ¤</a>]</span>');
        $('body').append('<div id="bottom"></div>');
        $('p.navigatebar').first().prepend('<span class="scrolltolink" style="margin-right:6px;">[<a href="#bottom">Alas</a>]</span>');
        $('p.navigatebar').last().prepend('<span class="scrolltolink" style="margin-right:6px;">[<a href="#">YlÃ¶s</a>]</span>');

        var board = window.location.pathname.replace(/(-\d+)?\/(\d+)?/gi, '');
        if(!/^\/([a-z\_0-9]+)\/(!?[0-9]+)$/.test(window.location.pathname) && !$('.threads').hasClass('style-box')) {
            $('.scrolltolink').before('<span class="cataloglink" style="margin-right:6px;">[<a href="javascript:changeDisplayStyle(1)">Lankaluettelo</a>]</span>');
        } else if(!/^\/([a-z\_0-9]+)\/(!?[0-9]+)$/.test(window.location.pathname) && $('.threads').hasClass('style-box')) {
            $('.scrolltolink').before('<span style="margin-right:6px;">[<a href="javascript:changeDisplayStyle(0)">VastausnÃ¤kymÃ¤</a>]</span>');
        } else {
            $('.scrolltolink').before('<span class="cataloglink"></span>');
        }
        if (/^\/([a-z\_0-9]+)\/(!?[0-9]+)$/.test(window.location.pathname)) {
            $('.cataloglink').before('<span style="margin-right:6px;">[<a href="/' + board + '/">Takaisin</a>]</span>');
        }

    }

    if (settings['hideusedactions'] !== '0' || undefined) {
        $(".buttons_right button:disabled").each(function() {
            $(this).hide();
        });
    }

    if (settings['hidebbcode'] !== '0' || undefined) {
        $('#postbuttons').css("display", "none");
        $('#msg').click(function(e) {
            if(e.ctrlKey) {
                e.preventDefault();
                $('#postbuttons').toggle('fast');
                var $this = $(this).find('span');
                $this.text($this.text() == '(+)' ? '(â€“)' : '(+)');
            }
        });
    }

    if (settings['followedcount'] !== '0' || undefined) {
        var followedthreadscount = $("#followedcontent p").length;

        $('#followedtitle').append('<span style="font-weight: normal;" title="Seurattujen lankojen mÃ¤Ã¤rÃ¤" id="followedthreadscount">(' + followedthreadscount + ')</span>');

    }

    if (settings['videovolume'] !== undefined) {
        var defaultvolume = settings['videovolume'];

        $('.embedcontainer').on('DOMNodeInserted', '.media', function () {
            $(this).prop('volume', (defaultvolume/100));
        });

    }

    if (settings['colorids'] !== '0' || undefined) {

        var ids = [];
        var uniqueids = [];
        var idsandcolors = [];

        var getRandomColor = function(id) {
            var id = id.replace(/\W/g, '').replace(/^(.).{2,6}(.).{3}(.)$/g, '$1$2$3').split('');
            var color = [];

            $.each(id, function(i, num) {

                var charcode = num.charCodeAt(0);
                var number = 128 + (Math.pow(-1, (charcode % 10))) * charcode; // Vitun autisti Jonnerheim
                if(num === num.toUpperCase() && isNaN(num)) {
                    mult = '1.' + charcode % 10;
                    number = number * parseFloat(mult);
                } else if($.isNumeric(num)) {
                    mult = '0.' + charcode % 10;
                    number = number * parseFloat(mult);
                }

                if(number < 0) {
                    number = 0;
                }
                if(number > 255) {
                    number = 255;
                }

                number = Math.round(number);

                color.push(number);

            });

            return color;

        };

        $('.postuid').each(function() {
            var id = $(this).text().substr(4).substring(0,10).trim();
            var color = getRandomColor(id);

            $(this).css({
                'background': 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')',
                'color': 'white',
                'text-shadow': '0px 0px 2px black, 0px 0px 3px black',
                'padding': '0px 7px',
                'margin': '0 1px',
                'border-radius': '7px'
            });
        });
    }

    if(settings['countanswersbyid'] !== '0' || undefined) {

        if (/^\/([a-z\_0-9]+)\/(!?[0-9]+)$/.test(window.location.pathname)) {

            var postids = {};

            $('.answer .postuid').each(function() {

                var thisid = $(this).text().substr(4).trim();
                if(typeof(postids[thisid]) == 'undefined') {
                    postids[thisid] = 1;
                } else {
                    postids[thisid] = ++postids[thisid];
                }

            });

            $('.postuid').each(function() {

                var thistxt = $(this).text();
                var thisid = $(this).text().substr(4).trim();
                var idpostcount = postids[thisid];
                if(typeof(idpostcount) == 'undefined') {
                    idpostcount = 0;
                }
                $(this).text(thistxt + ' / ' + idpostcount);

            });

        }

    }

    if (settings['hidepostsbyid'] !== '0' || undefined) {

        var hideUID = function(threadID, UID) {
            if( getStorage(threadID + 'hiddenUIDs') === null || undefined) {
                setStorage(threadID + 'hiddenUIDs', UID);
            } else {
                var hiddenUIDs = getStorage(threadID + 'hiddenUIDs');
                var newHiddenUIDs = hiddenUIDs + ' ' + UID;
                setStorage(threadID + 'hiddenUIDs', newHiddenUIDs);
            }
        };

        $('.answer .postinfo .postuid').click(function(e) {
            if(e.ctrlKey) {
                var threadID = $(this).closest('.thread').attr('id').substr(7);
                var UID = $(this).text().substr(4).substring(0,10).trim();
                hideUID(threadID, UID);
                $(this).closest('.answer').hide();

                $('.answer .postinfo .postuid').each(function() {
                    var threadID = $(this).closest('.thread').attr('id').substr(7);
                    var UID = new RegExp($(this).text().substr(4).substring(0,10).trim());
                    var hiddenUIDs = getStorage(threadID + 'hiddenUIDs');

                    if (UID.test(hiddenUIDs)) {
                        $(this).closest('.answer').hide();
                    }

                });

            }
        });

        $('.answer .postinfo .postuid').each(function() {
            var threadID = $(this).closest('.thread').attr('id').substr(7);
            var UID = new RegExp($(this).text().substr(4).substring(0,10).trim());
            var hiddenUIDs = getStorage(threadID + 'hiddenUIDs');

            if (UID.test(hiddenUIDs)) {
                $(this).closest('.answer').hide();
                var filteredcount = parseInt(settings['filteredcount']);
                setStorage('filteredcount', ++filteredcount);
            }
        });

    }

    if(settings['hidethreadswofile'] !== '0' || undefined) {

        $('.op_post').each(function() {

            if($(this).find('.filecontainer').length == '0') {
                window.location = 'javascript:' + $(this).find('.postinfo').find('a[onclick*="hideThread"]').attr('onclick');
                $(this).closest('.thread').remove();
                var filteredcount = parseInt(settings['filteredcount']);
                setStorage('filteredcount', ++filteredcount);
            }

        });
    }

    if(settings['wordfilter'] !== '' || undefined) {

        var bannedwords;

        (function() {
            var filter;
            $.each(settings['wordfilter'].split(/[\r\n]+/), function(i, string) {

                if(/^[/]{2}.*[/]{2}$/i.test(string)){
                    if(filter == undefined) {
                        filter = string.substring(2,string.length-2);
                    } else {
                        filter += '|' + string.substring(2,string.length-2);
                    }
                } else {
                    if(filter == undefined) {
                        filter = string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\:]/g, "\\$&");
                    } else {
                        filter += '|' + string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\:]/g, "\\$&");
                    }
                }

            });
            filter = '(' + filter + ')';
            bannedwords = new RegExp(filter, 'i');
        })();

        var matchPost = function(msg) {
            if(bannedwords.test(msg)) {
                return '1';
            } else {
                return '0';
            }

        };

        $('.op_post').each(function() {
            var msg = $(this).find('.post').text();
            var subject = $(this).find('.postsubject').text();
            var matchtowordfilter = matchPost(subject + ' ' + msg);

            if(matchtowordfilter == '1') {
                window.location = 'javascript:' + $(this).find('.postinfo').find('a[onclick*="hideThread"]').attr('onclick');
                $(this).closest('.thread').remove();
                var filteredcount = parseInt(settings['filteredcount']);
                setStorage('filteredcount', ++filteredcount);
            }

        });

        $('.answer').each(function() {
            var msg = $(this).find('.post').text();
            var matchtowordfilter = matchPost(msg);

            if(matchtowordfilter == '1') {
                $(this).remove();
                var filteredcount = parseInt(settings['filteredcount']);
                setStorage('filteredcount', ++filteredcount);
            }

        });

    }

    if(settings['filenamefilter'] !== '' || undefined) {

        var deletejustfile = settings['deletejustfile'];
        var matchFile = function(filename) {
            var bannedfiles = settings['filenamefilter'].toLowerCase().replace(/[\r\n]+/g, ',').split(',');
            return bannedfiles.indexOf(filename);
        };

        $('.op_post').each(function() {
            var filename = $(this).find('.filecontainer .file figcaption > a').text().toLowerCase();
            var matchtfilefilter = matchFile(filename);

            if(matchtfilefilter > '-1') {
                if(deletejustfile == '1') {
                    $(this).find('.filecontainer').remove();
                    var filteredcount = parseInt(settings['filteredcount']);
                    setStorage('filteredcount', ++filteredcount);
                } else {
                    window.location = 'javascript:' + $(this).find('.postinfo').find('a[onclick*="hideThread"]').attr('onclick');
                    $(this).closest('.thread').remove();
                    var filteredcount = parseInt(settings['filteredcount']);
                    setStorage('filteredcount', ++filteredcount);
                }
            }

        });


        $('.answer').each(function() {
            var filename = $(this).find('.filecontainer .file figcaption > a').text().toLowerCase();
            var matchtfilefilter = matchFile(filename);

            if(matchtfilefilter > '-1') {
                if(deletejustfile == '1') {
                    $(this).find('.filecontainer').remove();
                    var filteredcount = parseInt(settings['filteredcount']);
                    setStorage('filteredcount', ++filteredcount);
                } else {
                    $(this).remove();
                    var filteredcount = parseInt(settings['filteredcount']);
                    setStorage('filteredcount', ++filteredcount);
                }
            }

        });

    }

    if(settings['filenametimestamps'] !== '0' || undefined) {

        $('.filecontainer figcaption > a, .file .expandlink').each(function() {
            var url = $(this).attr('href');
            if(/naamapalmu\.com/i.test(url)) return;
            var posttime = $(this).closest('.filecontainer').parent().prev().find('.posttime').text().split(/[\s\.:]/);
            var imagename = Date.parse(new Date(posttime[2], posttime[1], posttime[0], posttime[3], posttime[4], posttime[5], '0')) / 1000 + (Math.floor(Math.random() * (999 - 100 + 1)) + 100).toString();
            var imgext = url.substr(url.lastIndexOf('.'));
            var new_name = url.replace(url.substring(url.lastIndexOf('/') + 1), imagename+imgext);
            $(this).attr('href', new_name);
        });

    }

    if((settings['countopanswers'] !== '0' || undefined) || (settings['countownanswers'] !== '0' || undefined)) {

        if (/^\/([a-z\_0-9]+)\/(!?[0-9]+)$/.test(window.location.pathname)) {

            var omitted = $('.omitted .extrainfo').parent().text();
            if((settings['countopanswers'] == '1') && settings['countownanswers'] == '0') {
                var opposts = $('.postedbyop').length - 1;
                $('.omitted .extrainfo').parent().text(omitted + ', ' + opposts + ' AP:n vastausta');
            }
            if((settings['countopanswers'] == '0') && settings['countownanswers'] == '1') {
                var ownposts = $('.own_post').length;
                $('.omitted .extrainfo').parent().text(omitted + ', ' + ownposts + ' omaa vastausta');
            }
            if((settings['countopanswers'] == '1') && settings['countownanswers'] == '1') {
                var opposts = $('.postedbyop').length - 1;
                var ownposts = $('.answer.own_post').length;
                $('.omitted .extrainfo').parent().text(omitted + ', ' + ownposts + ' omaa vastausta, ' + opposts + ' AP:n vastausta');
            }

        }

    }

    if(settings['loadfullpngs'] !== '0' || undefined) {

        $('head').prepend('<style>.thumbnail .imagefile{height:auto;width:auto;max-height:240px;max-width:240px;}</style>');

        $('.file').each(function() {
            var filesrc = $(this).children('a:first-of-type').attr('href');
            var png = new RegExp('\.png$', 'i');
            if(png.test(filesrc)) {
                $(this).children('a:first-of-type').attr('data-thumbfile', filesrc);
                $(this).find('img').attr('src', filesrc);
            }
        });

    }

    if(settings['quickbbcode'] !== '0' || undefined) {

        $('#msg').bind('keydown', function(event) {
            if (event.ctrlKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {

                case 's':
                    event.preventDefault();
                    $('#msg').insertAtCaret('[spoiler]','[/spoiler]');
                    break;
                case 'b':
                    event.preventDefault();
                    $('#msg').insertAtCaret('[b]','[/b]');
                    break;
                case 'e':
                    event.preventDefault();
                    $('#msg').insertAtCaret('[em]','[/em]');
                    break;
                }
            }
        });

    }

    if(settings['oldpostinfoorder'] !== '0' || undefined) {

        $('.postinfo').each(function() {

            $(this).find('.tags').prependTo($(this));
            $(this).find('.postnumber').appendTo($(this));
            $(this).find('.postnumber').css('margin-left', '4px');
            $(this).find('.messageoptions').appendTo($(this));
            $(this).find('.upvote_count').appendTo($(this));
            $(this).find('.postsubject').prependTo($(this));

            if($(this).find('.postedbyop').length > 0 && $(this).find('.postername').length > 0) {
                $(this).find('.postedbyop').prependTo($(this).find('.tags'));
                $(this).find('.postername').prependTo($(this).find('.tags'));
            } else {
                $(this).find('.postedbyop').prependTo($(this));
            }

        });

    }

    if(settings['oldstylejs'] !== '0' || undefined) {

        $('.navigationbar.top').insertAfter('form#post')
        $('label[for="msg"]').remove();

        // Move options -field to main form
        $('#functions').remove();
        $('<label class="label" for="functions">' + txt_47 + '</label><input type="text" id="functions" name="functions" />').prependTo($('form#post'));

        // Drop file end embed inputs to bottom
        $('label[for="file"]').insertAfter('#msg');
        $('#file').insertAfter('label[for="file"]');
        $('label[for="embed"]').insertAfter('#file');
        $('#embed').insertAfter('label[for="embed"]');
        $('#embedtype').insertAfter('#embed');

        // Remove placeholders
        $('#msg').attr('placeholder', '');
        $('#subject').attr('placeholder', '');
        $('#embed').attr('placeholder', '');

        // Move submit button after options
        if ($('#subject').length != 0)
            $('#submit').insertAfter('#subject').attr('value', txt_46);
        else
            $('#submit').insertAfter('#functions').attr('value', txt_46);

        // Remove some checkboxes from the postform
        $('#sage').remove();
        $('label[for="sage"]').remove();
        $('label[for="post_return_to_thread_off"]').remove();
        $('label[for="post_return_to_thread_on"]').remove();
        $('#post_return_to_thread_off').remove();
        $('#post_return_to_thread_on').remove();
        $('#postoptions .col:first-of-type > h4:last-of-type').remove();
        $('#asyncreply_on_button').remove();
        $('#asyncreply_off_button').remove();
        $('#postoptions_toggle').remove();
        $('#postoptions').css('display', 'block');

        // Move thread subject to postinfo

        if ($('.threads').hasClass('style-replies')) {
            $('.postsubject').each(function() {
                $(this).prependTo($(this).next());
            });
        }

        // Move OP files outside of the post
        if ($('.threads').hasClass('style-replies')) {
            $('.op_post').each(function() {
                var filecontainer = $(this).find('.filecontainer');
                if($(filecontainer).find('.playembedlink').length == 0) {
                    $(this).find('.filecontainer').prependTo($(this).parent());
                }
            });
        }

        // Add [Reply] -links
        if (!/^\/([a-z\_0-9]+)\/([0-9]+)$/.test(window.location.pathname) && !$('.threads').hasClass('style-box')) {
            $('.thread').each(function() {
                $('<a class="oldstyle-replylink" href="' + $(this).find('.op_post .postsubject').attr('href') + '">[<span>Avaa lanka</span>]</a>').appendTo($(this).find('.op_post .postinfo'));
            });
        }

        $('#functions').css('width', '226px');
        $('#subject').css('width', '226px');
        $('#right form#post').css('max-width', '400px');
        $('#submit').css({
            'float': 'none',
            'margin-left': '2px'
        });
    }

    if (settings['infobeforefile'] !== '0' || undefined) {

        $('.threads.style-replies .file > figcaption').each(function() {

            var filename = $(this).find('a').first().text();

            if(filename.length > 50) {
                filename = filename.substr(0,47) + '...';
                $(this).find('a').first().text(filename);
            }

            $(this).css({'margin': '0px 4px'});
            $(this).find('a').css({'text-decoration': 'none'})
            $(this).find('span').text('(' + $(this).find('span').text() + ')');
            $(this).prependTo($(this).closest('.thread, .post').before());
        });

    }

    if (settings['postoptionshide'] !== '0' || undefined) {
        $('#postoptions').hide();
        $('#postoptions .col:last-of-type h4:first-of-type').append(' <a id="alltagstoggle" style="cursor:pointer;font-size: 0.8em;"><span class="smalltext">Toggle All Tags</span></a>');
        $('#postoptions').after('<a id="option-toggle" style="display:block;text-align:center;font-weight:bold;cursor:pointer;"><span>(+)</span></a>');

        $('a#option-toggle').click(function() {
            $('#postoptions').toggle('fast');
            var $this = $(this).find('span');
            $this.text($this.text() == '(+)' ? '(â€“)' : '(+)');
        });

        $('a#alltagstoggle').click(function() {
            var checkBoxes = $('input[name*="posttag"]');
            checkBoxes.prop("checked", !checkBoxes.prop("checked"));
        });
    }

    if(settings['sortboardsbyshortname'] !== '0' || undefined) {

        if (typeof $('nav.boardlist a').data('sorted') == 'undefined') {
            $('nav.boardlist a').sort(function(a, b) {
                if (typeof $(a).data('shortname') == 'undefined') return -1;
                if (typeof $(b).data('shortname') == 'undefined') return 1;
                return $(a).data('shortname').toLowerCase().localeCompare($(b).data('shortname').toLowerCase());
            }).appendTo('nav.boardlist');
            $('nav.boardlist a').data('sorted', '1');
        }

    }

    if (settings['hideloginname'] !== '0' || undefined) {
        $('h4').filter(':contains("Kirjautuneena")').hide();
    }

    if (settings['autofunctions'] !== '0' || undefined) {
        var autofunctions = settings['autofunctions'];
        $('#functions').val(autofunctions);
    }

    if(settings['shownboards'] !== '' || undefined) {

        $('.boardlist a').each(function() {
            var boardname =  '/' + $(this).data('shortname') + '/';
            var shownboards = settings['shownboards'];
            if(shownboards.indexOf(boardname) > '-1') {
                $(this).hide();
            }
        });

        if(!$('.boardlist li.header').is(':visible')) {
            $('.boardlist li').filter(':visible:first').before('<span style="cursor:pointer"> / </span>');
        }

    }

    if(settings['shownlinks'] !== '' || undefined) {

        $('#left .meta a, #left .user a, #left .customized a').each(function() {
            var linkname = $(this).text();
            var linkhref = $(this).attr('href').split('/').pop().replace(/(javascript:|\(\)|\.php|\?)/g, '');
            if(linkname == 'Etusivu') {
                linkhref = 'etusivu';
            }
            var shownlinks = settings['shownlinks'];
            if(shownlinks.indexOf(linkhref) > '-1') {
                $(this).hide();
            }
        });

        if(/cse-search-box2/.test(settings['shownlinks'])) {

            $('#cse-search-box2').hide();

        }


    }

    if(settings['boardlistonbottom'] !== '0' || undefined) {

        $('#left').clone().insertAfter('#right');

        if(settings['newestidbar'] == '1') {
            $(".newestid span").load("/scripts/newestid.php");
        }

    }

    if(settings['inthreadsearch'] !== '0' || undefined) {

        if (/^\/([a-z\_0-9]+)\/(!?[0-9]+)$/.test(window.location.pathname)) {
            $('.navigationbar.top .navigatebar').append('<input type="text" id="threadfilter" style="margin-left: 3px;" placeholder="Etsi langasta"></input> <input type="checkbox" id="blacklistfilter" name="blacklistfilter" style="vertical-align: middle"></input> <label for="blacklistfilter">Mustalista</label> <span id="filteredcount" style="color:#789922;font-weight:bold;"></span>');

            $('#threadfilter').keyup(function() {
                $('.answer:hidden').show();
                if($(this).val() == '') {
                    $('#filteredcount').text('');
                    return;
                }
                filtermsgs($(this).val());
                var filteredmessagescount = $('.answer:hidden').length;
                if(filteredmessagescount > 0) {
                    $('#filteredcount').text(filteredmessagescount + ' viestiÃ¤ piilotettu');
                } else {
                    $('#filteredcount').text('');
                }
            });

            $('#blacklistfilter').click(function() {
                $('.answer:hidden').show();
                if($('#threadfilter').val() == '') return;
                filtermsgs($('#threadfilter').val());
                var filteredmessagescount = $('.answer:hidden').length;
                if(filteredmessagescount > 0) {
                    $('#filteredcount').text(filteredmessagescount + ' viestiÃ¤ piilotettu');
                } else {
                    $('#filteredcount').text('');
                }
            });

            var filtermsgs = function(word) {

                var filterword = new RegExp(word, 'i');
                $('.answer').each(function() {
                    var post = $(this).find('.post').text();
                    if($('#blacklistfilter').is(':checked')) {
                        if (filterword.test(post)) {
                            $(this).hide();
                        }
                    } else {
                        if(!filterword.test(post)) {
                            $(this).hide();
                        }
                    }
                });
            }
        }

        if ($('.threads').hasClass('style-box')) {
            $('.navigationbar:not(.bottom:last-of-type) .navigatebar').append('<input type="text" id="threadfilter" style="margin-left: 3px;" placeholder="Etsi lankaluettelosta"></input> <input type="checkbox" id="blacklistfilter" name="blacklistfilter" style="vertical-align: middle"></input> <label for="blacklistfilter">Mustalista</label> <span id="filteredcount" style="color:#789922;font-weight:bold;"></span>');

            $('#threadfilter').keyup(function() {
                $('.thread:hidden').show();
                if($(this).val() == '') {
                    $('#filteredcount').text('');
                    return;
                }
                filtermsgs($(this).val());
                var filteredmessagescount = $('.thread:hidden').length;
                if(filteredmessagescount > 0) {
                    $('#filteredcount').text(filteredmessagescount + ' lankaa piilotettu');
                } else {
                    $('#filteredcount').text('');
                }
            });

            $('#blacklistfilter').click(function() {
                $('.tlist_thread:hidden').show();
                if($('#threadfilter').val() == '') return;
                filtermsgs($('#threadfilter').val());
                var filteredmessagescount = $('.thread:hidden').length;
                if(filteredmessagescount > 0) {
                    $('#filteredcount').text(filteredmessagescount + ' lankaa piilotettu');
                } else {
                    $('#filteredcount').text('');
                }
            });

            var filtermsgs = function(word) {

                var filterword = new RegExp(word, 'i');
                $('.thread').each(function() {
                    var post = $(this).find('.post').text();
                    if($('#blacklistfilter').is(':checked')) {
                        if (filterword.test(post)) {
                            $(this).hide();
                        }
                    } else {
                        if(!filterword.test(post)) {
                            $(this).hide();
                        }
                    }
                });
            }
        }
    }

    if(settings['filenametitles'] !== '0' || undefined) {

        $('figcaption > a').hover(
            function() {
                if(/(youtube\.com|naamapalmu\.com)/ig.test($(this).attr('href'))) { return }
                $(this).data('fullname', decodeURIComponent($(this).attr('href').match(/[^/]*$/)));
                $(this).data('shortname', $(this).text());
                $(this).text($(this).data('fullname'));
        },
            function() {
                $(this).text($(this).data('shortname'));
        });

    }

    if(settings['savelastpost'] !== '0' || undefined) {

        $('#right form#post #postoptions .col:last-of-type').prepend('<a href="#" style="display:block;cursor:pointer;" id="restoremsg">Palauta viimeinen viesti</a>');

        $('textarea#msg').change(function() {

            var currentmsg = $('textarea#msg').val();
            setStorage('savedmessage', currentmsg);

        });

        $('#restoremsg').click(function(e) {

            e.preventDefault();
            var savedmessage = getStorage('savedmessage');
            if(savedmessage == null) {
                var currentmsg = $('textarea#msg').val();
                $('textarea#msg').val('Ei tallennettua viestiÃ¤');
                setTimeout(function() {
                    $('textarea#msg').val(currentmsg);
                }, 750);
            } else {
                $('textarea#msg').val('Viesti palautettu');
                setTimeout(function() {
                    $('textarea#msg').val(savedmessage);
                }, 750);
            }

        });

    }

    if(settings['wtautoupdate'] !== '0' || undefined) {

        setInterval(function() { ftUpdate(); }, 30000);

    }

    if(settings['doubleclickidfilter'] !== '0' || undefined) {

        if (/^\/([a-z\_0-9]+)\/(!?[0-9]+)$/.test(window.location.pathname)) {

            var hiddenposts = 0;
            var position = 0;

            $('.postuid').dblclick(function() {

                if(hiddenposts > 0) {

                    return;

                } else {

                    position = $(this).offset();

                    var postuid = $(this).text().replace(/\s/g, '').substr(3).substring(0,10);

                    $('.answer').each(function() {

                        if($(this).find('.postuid').text().replace(/\s/g, '').substr(3).substring(0,10) !== postuid) {
                            $(this).hide();
                            ++hiddenposts;
                        } else {
                            $(this).find('.posttime').before('<a href="#" class="quickuidfilter-button1" style="margin: 0 3px 0 3px;" title="NÃ¤ytÃ¤ kaikki viestit ja palaa takaisin siihen missÃ¤ olit">Palaa takaisin</a><a href="#" class="quickuidfilter-button2" style="margin: 0 5px 0 4px;" title="NÃ¤ytÃ¤ kaikki viestit ja jÃ¤Ã¤ tÃ¤hÃ¤n viestiin">JÃ¤Ã¤ tÃ¤hÃ¤n</a>')
                        }

                    });

                    $('.op_post').find('.posttime').before('<a href="#" class="quickuidfilter-button1" style="margin: 0 3px 0 3px;" title="NÃ¤ytÃ¤ kaikki viestit ja palaa takaisin siihen missÃ¤ olit">Palaa takaisin</a><a href="#" class="quickuidfilter-button2" style="margin: 0 5px 0 4px;" title="NÃ¤ytÃ¤ kaikki viestit ja jÃ¤Ã¤ tÃ¤hÃ¤n viestiin">JÃ¤Ã¤ tÃ¤hÃ¤n</a>')

                    window.scrollTo(0, $(this).offset().top + $(this).closest('.answer, .op_post').outerHeight() - (window.innerHeight / 2));

                    $('.quickuidfilter-button1').click(function(e) {

                        e.preventDefault();
                        hiddenposts = 0;
                        $('.answer').show();
                        window.scrollTo(0, position.top - (window.innerHeight / 2));
                        $('.quickuidfilter-button1, .quickuidfilter-button2').remove();
                        position = 0;

                    });

                    $('.quickuidfilter-button2').click(function(e) {

                        e.preventDefault();
                        hiddenposts = 0;
                        $('.answer').show();
                        position = $(this).offset();
                        window.scrollTo(0, $(this).offset().top + $(this).closest('.answer, .op_post').outerHeight() - (window.innerHeight / 2));
                        $('.quickuidfilter-button1, .quickuidfilter-button2').remove();
                        position = 0;

                    });

                }

            });

            $('.postedbyop').dblclick(function() {

                if(hiddenposts > 0) {

                    return;

                } else {

                    position = $(this).offset();

                    $('.answer').each(function() {

                        if($(this).find('.postedbyop').length == 0) {
                            $(this).hide();
                            ++hiddenposts;
                        } else {
                            $(this).find('.posttime').before('<a href="#" class="quickuidfilter-button1" style="margin: 0 3px 0 3px;" title="NÃ¤ytÃ¤ kaikki viestit ja palaa takaisin siihen missÃ¤ olit">Palaa takaisin</a><a href="#" class="quickuidfilter-button2" style="margin: 0 5px 0 4px;" title="NÃ¤ytÃ¤ kaikki viestit ja jÃ¤Ã¤ tÃ¤hÃ¤n viestiin">JÃ¤Ã¤ tÃ¤hÃ¤n</a>')
                        }

                    });

                    window.scrollTo(0, $(this).offset().top + $(this).closest('.answer, .op_post').outerHeight() - (window.innerHeight / 2));

                    $('.quickuidfilter-button1').click(function(e) {

                        e.preventDefault();
                        hiddenposts = 0;
                        $('.answer').show();
                        window.scrollTo(0, position.top - (window.innerHeight / 2));
                        $('.quickuidfilter-button1, .quickuidfilter-button2').remove();
                        position = 0;

                    });

                    $('.quickuidfilter-button2').click(function(e) {

                        e.preventDefault();
                        hiddenposts = 0;
                        $('.answer').show();
                        position = $(this).offset();
                        window.scrollTo(0, $(this).offset().top + $(this).closest('.answer, .op_post').outerHeight() - (window.innerHeight / 2));
                        $('.quickuidfilter-button1, .quickuidfilter-button2').remove();
                        position = 0;

                    });

                }

            });

            $('.admin').dblclick(function() {

                if(hiddenposts > 0) {

                    return;

                } else {

                    position = $(this).offset();

                    $('.answer').each(function() {

                        if($(this).find('.admin').length == 0) {
                            $(this).hide();
                            ++hiddenposts;
                        } else {
                            $(this).find('.posttime').before('<a href="#" class="quickuidfilter-button1" style="margin: 0 3px 0 3px;" title="NÃ¤ytÃ¤ kaikki viestit ja palaa takaisin siihen missÃ¤ olit">Palaa takaisin</a><a href="#" class="quickuidfilter-button2" style="margin: 0 5px 0 4px;" title="NÃ¤ytÃ¤ kaikki viestit ja jÃ¤Ã¤ tÃ¤hÃ¤n viestiin">JÃ¤Ã¤ tÃ¤hÃ¤n</a>')
                        }

                    });

                    window.scrollTo(0, $(this).offset().top + $(this).closest('.answer, .op_post').outerHeight() - (window.innerHeight / 2));

                    $('.quickuidfilter-button1').click(function(e) {

                        e.preventDefault();
                        hiddenposts = 0;
                        $('.answer').show();
                        window.scrollTo(0, position.top - (window.innerHeight / 2));
                        $('.quickuidfilter-button1, .quickuidfilter-button2').remove();
                        position = 0;

                    });

                    $('.quickuidfilter-button2').click(function(e) {

                        e.preventDefault();
                        hiddenposts = 0;
                        $('.answer').show();
                        position = $(this).offset();
                        window.scrollTo(0, $(this).offset().top + $(this).closest('.answer, .op_post').outerHeight() - (window.innerHeight / 2));
                        $('.quickuidfilter-button1, .quickuidfilter-button2').remove();
                        position = 0;

                    });

                }

            });

        }

    }

    if(settings['backlinkhover'] !== '0' || undefined) {

        var hoveredid;

        $('.backlink').hover(function() {

            hoveredid = $(this).parent().parent().attr('id').substr(2);
            replierid = $(this).text().substring(2,10);

            if($('#tooltip-' + replierid).length > 0) {

                $('#tooltip-' + replierid).find('.post').find('.reflink').each(function() {
                    var thisref = $(this).text().substr(2);
                    if(thisref == hoveredid) {
                        $(this).css({'text-decoration': 'none', 'border-bottom': '1px dashed'});
                    }
                });

            } else {

                $('body').on('DOMNodeInserted', '.tooltip', function() {

                    $(this).find('.post').find('.reflink').each(function() {
                        var thisref = $(this).text().substring(2,10);
                        if(thisref == hoveredid) {
                            $(this).css({'text-decoration': 'none', 'border-bottom': '1px dashed'});
                        }
                    });

                });
            }

            if($('#no' + replierid).length > 0) {

                $('#no' + replierid).find('.post').find('.reflink').each(function() {
                    var thisref = $(this).text().substring(2,10);
                    if(thisref == hoveredid) {
                        $(this).css({'text-decoration': 'none', 'border-bottom': '1px dashed'});
                    }
                });

            }

        }, function() {

            $('.reflink').css({'text-decoration': '', 'border-bottom': ''});

        });

    }

    if(settings['oldmessagebuttons'] !== '0' || undefined) {

        $('.messageoptions .icon-minus').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1MzQ0MEM5MTMwNzExRTVCQURCQTQ2MkRGRUQ4M0IyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1MzQ0MENBMTMwNzExRTVCQURCQTQ2MkRGRUQ4M0IyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzUzNDQwQzcxMzA3MTFFNUJBREJBNDYyREZFRDgzQjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzUzNDQwQzgxMzA3MTFFNUJBREJBNDYyREZFRDgzQjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7WR24lAAAACVBMVEX///////8TO14g9U0OAAAAAXRSTlMAQObYZgAAADxJREFUeNrs16ERACAQA8FA/0WDQTMDCn6vgHURSWb9sKweB/plAAAAAPgbaJsANQBbAAAAgNqA75whwADuuR6BnW3yrwAAAABJRU5ErkJggg==" style="height: 16px; width: 16px;">')
        });
        $('.messageoptions .icon-pointer-upright').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYwOUY3NkVCMTMwNzExRTVCQjUyRUQ1OTExRkFBQzI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYwOUY3NkVDMTMwNzExRTVCQjUyRUQ1OTExRkFBQzI3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjA5Rjc2RTkxMzA3MTFFNUJCNTJFRDU5MTFGQUFDMjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjA5Rjc2RUExMzA3MTFFNUJCNTJFRDU5MTFGQUFDMjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Kn2CdAAADAFBMVEUTO17///90k6s5YIFOf5jL3Of7+/s0WGy70uCGsMUgVXFGaYZ5nLYUPF45WXEUO151mLb///8SEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+0DJ8kAAAAEnRSTlP//////////////////////wDiv78SAAAApklEQVR42uzXywqDMBSE4eCF1mub939UF3FGEhAxUXTlxG+neH4hRG2NBXPRMisQWPuBuePhgT84yDkwAQNfyDXQgPNi15TA6ypQDNBegEMccCs85nnlQOltB8NwC8lFfGigAJeQvLNIIDbI8O6mEQt8YDvIl2tY2A5yDIQPTeGNoByIbaTaY+xwMwkEBkg9UD2oB2Iv17CQp39sCQRy9P53trMAAwDBLX5+caPj2AAAAABJRU5ErkJggg==" style="height: 16px; width: 16px;">')
        });
        $('.messageoptions .icon-magnifier').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgxOEZBRUMwMTMwNzExRTU5RTMzQTE5MUVCNDY1Qzg2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjgxOEZBRUMxMTMwNzExRTU5RTMzQTE5MUVCNDY1Qzg2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODE4RkFFQkUxMzA3MTFFNTlFMzNBMTkxRUI0NjVDODYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODE4RkFFQkYxMzA3MTFFNTlFMzNBMTkxRUI0NjVDODYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6zad/sAAADAFBMVEX///8TO17///8DAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+JUMq5AAAAA3RSTlP//wDXyg1BAAAAXUlEQVR42uzXOw4AIAgDUOD+d/azF0h0a+mqvEkhWJz4Y26tEQD+GUZggSgBqKBDmIDqYnXGBlQPZoABlAD1fjBzoR+uGcQIVJ8JIUpAhqgBqLkqAow70+zOsQUYAMFWmz8DD5xJAAAAAElFTkSuQmCC" style="height: 16px; width: 16px;">')
        });
        $('.messageoptions .icon-flag2').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhGQjc5REYzMTMwNzExRTU4M0VCQjkzODRENTM0RTk5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhGQjc5REY0MTMwNzExRTU4M0VCQjkzODRENTM0RTk5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEZCNzlERjExMzA3MTFFNTgzRUJCOTM4NEQ1MzRFOTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEZCNzlERjIxMzA3MTFFNTgzRUJCOTM4NEQ1MzRFOTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4zAq7+AAADAFBMVEX///////8TO14DAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+ffti5AAAAAXRSTlMAQObYZgAAAERJREFUeNrs17ERACAIBMEf+u8ZDTQhlAj/roCNhEFpF4/pNhyIZgD/A3lyBbIEAADgC7ATAbgPeAcAzIIrwN9ZS4ABAIsCurDQAEKnAAAAAElFTkSuQmCC" style="height: 16px; width: 16px;">');
        });
        $('.messageoptions .icon-trash2').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVFMjI2QUIyMTMwNzExRTVBQUM4OEFCNEJFREVBQkM0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVFMjI2QUIzMTMwNzExRTVBQUM4OEFCNEJFREVBQkM0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUUyMjZBQjAxMzA3MTFFNUFBQzg4QUI0QkVERUFCQzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUUyMjZBQjExMzA3MTFFNUFBQzg4QUI0QkVERUFCQzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz47jnrHAAADAFBMVEX///////8TO14DAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+ffti5AAAAAXRSTlMAQObYZgAAAE5JREFUeNrs1zEOABAQRNHJ3v/OKEgUiFAZf0oxr1sbUkkcRi2PA3EZAAAAXyDV7J47AqPLs7Iz0JdWZQBv4PdZ4E1kNwIA/Azwd1YWYAAz9JsQKD7SRwAAAABJRU5ErkJggg==" style="height: 16px; width: 16px;">');
        });
        $('.messageoptions .icon-pencil-line').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM3RjdERDI4MTMwODExRTU5QUFFRTdGNDM4RUE3QjQyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM3RjdERDI5MTMwODExRTU5QUFFRTdGNDM4RUE3QjQyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzdGN0REMjYxMzA4MTFFNTlBQUVFN0Y0MzhFQTdCNDIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzdGN0REMjcxMzA4MTFFNTlBQUVFN0Y0MzhFQTdCNDIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4DsmMvAAADAFBMVEX///////8TO14DAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+ffti5AAAAAXRSTlMAQObYZgAAAEtJREFUeNrs1ysOACAMBNFN739nwNQhNqBYZmyTJyr4SKs6TN3jQF0GAJAIDLNUYDd0kESgh+4iAQAAcoGfz0TuRt5IAAD8nTUFGABfDTBs9pEJYAAAAABJRU5ErkJggg==" style="height: 16px; width: 16px;">');
        });
        $('.messageoptions .icon-eye-crossed').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBGM0I3MEI3MTMwODExRTVBMjE3REM5OUJCRDg1MDU4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBGM0I3MEI4MTMwODExRTVBMjE3REM5OUJCRDg1MDU4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEYzQjcwQjUxMzA4MTFFNUEyMTdEQzk5QkJEODUwNTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEYzQjcwQjYxMzA4MTFFNUEyMTdEQzk5QkJEODUwNTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6UPSwwAAADAFBMVEX/////f38TO14DAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+uK12gAAAAAXRSTlMAQObYZgAAAF1JREFUeNrs1zsOACAIA1Dk/ofGhcUAJjJZ2lHlTX5QZEcfI57PAW2GAC6wkkwAqoXZPBJQFUYQGhAV3zaRj6ECZ1GEEMAHJp4F3ol8G9kjsVcm0P87gvydTQABBgCtyRyBATSRkAAAAABJRU5ErkJggg==" style="height: 16px; width: 16px;">');
        });
        $('.messageoptions .icon-eye').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZCODJBOTdDMTMwNzExRTVBRDIxQTk0QzcwNUYxNDc3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZCODJBOTdEMTMwNzExRTVBRDIxQTk0QzcwNUYxNDc3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkI4MkE5N0ExMzA3MTFFNUFEMjFBOTRDNzA1RjE0NzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkI4MkE5N0IxMzA3MTFFNUFEMjFBOTRDNzA1RjE0NzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7a6pb2AAADAFBMVEX///////8TO14DAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFSUlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRlZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29wcHBxcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///+ffti5AAAAAXRSTlMAQObYZgAAAFxJREFUeNrs1zsOACAIA1DC/e8sLiwGMJHJ0o4qb/KDIjv6GPF8DmgzBHCBlWQCUC3M5pGAqjCC0ICo+LaJfAwVOIsihAA+MPEs8E7k28geib0ygf7fEeTvbAIMAFioFq5UsfMFAAAAAElFTkSuQmCC" style="height: 16px; width: 16px;">');
        });
        $('.messageoptions .icon-expand4').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $(this).append('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRCMjExRDA4MTMwNzExRTU5RUQ1QjUyRUE1NEQ1REFEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRCMjExRDA5MTMwNzExRTU5RUQ1QjUyRUE1NEQ1REFEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REIyMTFEMDYxMzA3MTFFNTlFRDVCNTJFQTU0RDVEQUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REIyMTFEMDcxMzA3MTFFNTlFRDVCNTJFQTU0RDVEQUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6d+Rj0AAAACVBMVEX///////8TO14g9U0OAAAAAXRSTlMAQObYZgAAAGZJREFUeNrsl8EOABAMQ8f/fzQXiUhLwknXHlneodHZIrrqpWLoc0B9lBKgTGLFqEYRcDJNHYDMQsapAtZLZCg6UwWwR5UJsAtSRgALUQYAaiaZACxI6gD/jZ6RPCt7Z/LuHE2AAQD5vhvhD7Fs4QAAAABJRU5ErkJggg==" style="height: 16px; width: 16px;">');
        });
        $('.icon-pushpin').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $('head').append('<style>.icon-pushpin:before { content: "" }</style>');
            $(this).append('<img style="max-height: 21px!important" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAaVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqtduBm+kzMzN8j8iWp9I6Yr3////l5eUGL4xqjeOvwPIKQb5OeNpYfeQINp7DzvY8bdqmt/KTquwJO60MSdEAAAAOMkusAAAADXRSTlOCLSieEGQLRjsHGwMAG8IbDQAAALdJREFUGNNtz0duw1AMBFA5tn4jk7ip/c65/yGzMCIxRmb5QBAzA/+XgZl5xJFhVweZW6tR1o5xV4Js81Ln2Ce4Xdmg32/XlCa4cCgZyFLjCvthDmWC5CodNpDW7y0v5V09JLfYYYNXfx3un7c+YVR/yaC0XK9r0h0MpMx5KduaVF+IbF+tthIl4VCdXf0lhIAn7CkEvY3I4wEbPOm+zIQH3GuD1uF5Pl3elR3G17A/Sufwe6pU5weUMRyUsO4tlgAAAABJRU5ErkJggg==">');
        });
        $('.icon-lock').each(function() {
            $(this).css({'font-size': '0','padding': '0','background': 'transparent'});
            $('head').append('<style>.icon-lock:before { content: "" }</style>');
            $(this).append('<img style="max-height: 24px!important" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAA81BMVEVMTEwpKSkAAACUlJQAAAAMBQC0tLQYGBg4ODjQ0NAAAAAAAABHPzgAAAAAAADHx8cAAAAAAAAXEw9oaGcaGhoAAAAAAAAGAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW1tbV1dW3trbVto7cwJ3kxqBtQhWsjGWbYB6wdTDu7u7Y2Njm0balbjPZtYPg4OCfn59dW1omHhYyJRi9i0zKn2nt1rrjw5zgwJeueTzn5+fZvpjHnGWYXRq0eTS1gUO/kVfFmGC4fzvWr4DJnmTQp3G7hUTTq3nEllm7jVXv2b23hkvNpGwAAADDOzmnAAAAI3RSTlPeyVr8Iqz83Pn8Hcf7hhb9sev9/PBFN5TAMuEBDXAECQ9LAETWbwsAAAEfSURBVCjPhdHncoJAAEZR0+wKFooIC6Q3NaFqhGDoTeT9nyaLQoDMZHL/nvlmZ3cb13/U+B/O0V6PRHHwGwYtUdcRccyw8xoQ0kK/uRWWYps4SQ58e9FpUKPppNPsnzY5oMLyjGIwpjVBLshLUMJUR0YM3uX4qSBSOFsBoUlhXTAHlH43wugCCEWWJHmsyGO5P5EU5QqecoR0v9+sVg+fWfduuEtnbAGPbuivDZhtBV+7lKcL+DiCt/YgOBC4Eta2FcdWnJjHRQXeXf8A8yKnBtvQsOOsbPFSX4Q/i7cSNlvftpIsU3NeaxCWC0erwcGwI5ilBmoJg2c/UhPTNAM1SBLtiSwuiBNpNZIpngQMZxhfaTYE+bMDlubKaBb+1DdwQmSF5Q1qFQAAAABJRU5ErkJggg==">');
        });

        $('.icon-medal-empty').css('font-size', '14px')
    }

    if(settings['boardnameform'] !== '0' || undefined) {

        if(settings['boardnameform'] == '1') {

            $('.boardlist a').each(function() {

                if($(this).find('.nsfwinfo').length > 0) {

                    $(this).html('<span>/' + $(this).data('shortname') + '/ <span class="nsfwinfo">NSFW</span></span>');

                } else {

                    $(this).html('<span>/' + $(this).data('shortname') + '/</span>');

                }

            });

        }

        if(settings['boardnameform'] == '2') {

            $('.boardlist a').each(function() {

                if($(this).find('.nsfwinfo').length > 0) {

                    $(this).html('<span>/' + $(this).data('shortname') + '/ - ' + $(this).text().substring(0 , $(this).text().length -4) + '<span class="nsfwinfo">NSFW</span></span>');

                } else {

                    $(this).html('<span>/' + $(this).data('shortname') + '/ - ' + $(this).text() + '</span>');

                }

            });

        }

    }

    if(settings['showrepliesonly'] !== '0' || undefined) {

        var hiddenposts = 0;

        $('.replies span').dblclick(function() {

            if(hiddenposts > 0) {

                return;

            } else {

                position = $(this).offset();
                $('.highlighted').removeClass('highlighted');
                var thismsgid = $(this).closest('.op_post, .answer').attr('id');
                var replies = $(this).parent().children('a').map(function() {
                    return 'no' + $(this).data('msgid');
                });
                $('div.answer').each(function() {
                    if (($.inArray($(this).attr('id'), replies) < 0) && $(this).attr('id') !== thismsgid) {
                        ++hiddenposts;
                        $(this).hide();
                    } else {
                        $(this).find('.posttime').before('<a href="#" class="quickuidfilter-button1" style="margin: 0 3px 0 3px;" title="NÃ¤ytÃ¤ kaikki viestit ja palaa takaisin siihen missÃ¤ olit">Palaa takaisin</a><a href="#" class="quickuidfilter-button2" style="margin: 0 5px 0 4px;" title="NÃ¤ytÃ¤ kaikki viestit ja jÃ¤Ã¤ tÃ¤hÃ¤n viestiin">JÃ¤Ã¤ tÃ¤hÃ¤n</a>')
                    }
                });

                window.scrollTo(0, $(this).closest('.answer, .op_post').offset().top);

                $('.quickuidfilter-button1').click(function(e) {

                    e.preventDefault();
                    hiddenposts = 0;
                    $('.answer').show();
                    $(this).closest('.answer, .op_post').addClass('highlighted');
                    window.scrollTo(0, position.top - (window.innerHeight / 2));
                    $('.quickuidfilter-button1, .quickuidfilter-button2').remove();
                    position = 0;

                });

                $('.quickuidfilter-button2').click(function(e) {

                    e.preventDefault();
                    hiddenposts = 0;
                    $('.answer').show();
                    $(this).closest('.answer, .op_post').addClass('highlighted');
                    position = $(this).offset();
                    window.scrollTo(0, $(this).offset().top + $(this).closest('.answer, .op_post').outerHeight() - (window.innerHeight / 2));
                    $('.quickuidfilter-button1, .quickuidfilter-button2').remove();
                    position = 0;

                });

            }

        });

    }

    console.log('%c Ylilauta Userscript-paketti v' + getStorage("scriptversion") + ' ladattu ', 'color: #3774AD;')

})();