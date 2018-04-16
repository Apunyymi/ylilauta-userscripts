$.ajaxSetup({
    cache: false,
    headers: {
        'X-CSRFToken': csrf_token
    }
});

var hiddenPosts;
var lastQuoted;
var reflink_active = false;
var threadId;
var expandInProgress = false;
var submitInProgress = false;

var updateRunning = false;
var updateRetryCount = 0;
var unreadCount = 0;
var nextReplyUpdateTimeout = false;
var documentTitle = document.title;

var window_height = $(window).height();

if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
}

/* Prevents iOS web apps from opening links in Safari */
(function (document, navigator, standalone) {
    // prevents links from apps from opening in mobile safari
    // this javascript must be the first script in your <head>
    if ((standalone in navigator) && navigator[standalone]) {
        var curnode, location = document.location, stop = /^(a|html)$/i;
        document.addEventListener('click', function (e) {
            curnode = e.target;
            while (!(stop).test(curnode.nodeName)) {
                curnode = curnode.parentNode;
            }
            // Conditions to do this only on links to your own app
            // if you want all links, use if('href' in curnode) instead.
            if ('href' in curnode && // is a link
                (chref = curnode.href).replace(location.href, '').indexOf('#') && // is not an anchor
                (    !(/^[a-z\+\.\-]+:/i).test(chref) ||                       // either does not have a proper scheme (relative links)
                chref.indexOf(location.protocol + '//' + location.host) === 0 ) // or is in the same protocol and domain
            ) {
                e.preventDefault();
                location.href = curnode.href;
            }
        }, false);
    }
})(document, window.navigator, 'standalone');

if (document.location.protocol == 'https:') {
    siteUrl = siteUrl.replace('http:', 'https:');
}

function pageReload() {
    if (location.href.indexOf("#") > -1) {
        location.assign(location.href.replace(/\/?#[a-z0-9_=-]*/, ""));
    } else {
        document.location = document.location;
    }
}

$.fn.extend({
    clickableLinks: function () {
        if (this.length == 0) {
            return;
        }

        var html = this.html();

        if (html.indexOf('http://') == -1 && html.indexOf('https://') == -1) {
            return;
        }

        //URLs starting with http://, https://
        var regex = /(^|\s|\n|>)(https?:\/\/[^\s<]+)/gi;
        var replacedText = html.replace(regex, function ($0, $1, $2) {
            return $1 + '<a href="' + $2 + '" target="_blank" rel="noopener noreferrer nofollow">' + $2 + '</a>';
        });

        this.html(replacedText);
    },
    insertAtCaret: function (startTag, endTag, e) {
        if (typeof endTag == 'undefined') {
            endTag = '';
        }
        if (typeof e == 'undefined') {
            e = '';
        }

        return this.each(function () {
            if (document.selection) {
                // IE
                var sel = document.selection.createRange();
                sel.text = startTag + sel.text + endTag;
                if (!e.metaKey && !e.ctrlKey) {
                    this.focus();
                }
            } else if (this.selectionStart || this.selectionStart == '0') {
                // MOZILLA/NETSCAPE
                var selectedText = this.value.substr(this.selectionStart, (this.selectionEnd - this.selectionStart));
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
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
                this.scrollTop = scrollTop;
            } else {
                // CHROME
                this.value += startTag + endTag;
                if (!e.metaKey && !e.ctrlKey) {
                    this.focus();
                }
            }
        });
    },
    drags: function (options) {
        return this.each(function () {
            var dx, dy, el = $(this);
            el.on({
                mousedown: function (e) {
                    e.preventDefault();
                    var os = el.offset();
                    dx = e.pageX - os.left;
                    dy = e.pageY - os.top;
                    $(document).on('mousemove.drag', function (e) {
                        el.offset({
                            top: e.pageY - dy,
                            left: e.pageX - dx
                        });
                    });
                },
                mouseup: function (e) {
                    if (el.attr('id') == 'followedthreads') {
                        if ($('#followedthreads').css('top').replace('px', '') < 0) {
                            $('#followedthreads').css('top', 0);
                        }
                        if ($('#followedthreads').css('left').replace('px', '') < 0) {
                            $('#followedthreads').css('left', 0);
                        }

                        localStorage.ftbox_top = $('#followedthreads').css('top');
                        localStorage.ftbox_left = $('#followedthreads').css('left');
                    }
                    $(document).off('mousemove.drag');
                }
            });
        });
    }
});

$(document).ready(function () {

    // Add quote links and backlinks
    // First because they add to the page height
    //updateQuotes();
    updateQuoteSuffixes();

    $('form#post').attr('onsubmit', 'submitAsyncreply(this, event)');
    $('form#post #async').attr('value', 'true');

    $(window).on('beforeunload', function (e) {
        if (!submitInProgress && $('#msg').is('*') && $('#msg').val().length != 0) {
            return messages.confirmPageLeave;
        } else {
            e = null;
        }
    });

    $('.post').each(function () {
        $(this).clickableLinks()
    });

    // Mobile messageoptions
    $(document.body).on('click', '.messageoptions_mobile', function () {
        $(this).closest('.answer, .op_post').find('.messageoptions').toggle();
    });

    // Followed threads box
    $('#followedthreads').drags();

    $(document.body).on('click', 'span.postedbyop', function () {
        $('.highlighted').removeClass('highlighted');
        $(this).parents('div.thread').find('div.answer').each(function () {
            if ($(this).find('span.postedbyop').length > 0) {
                $(this).addClass('highlighted');
            }
        });
    });

    $(document.body).on('click', '.replies span', function () {
        $('.highlighted').removeClass('highlighted');
        var replies = $(this).parent().children('a').map(function () {
            return 'no' + $(this).data('msgid');
        });
        $('div.answer').each(function () {
            if ($.inArray($(this).attr('id'), replies) >= 0) {
                $(this).addClass('highlighted');
            }
        });
    });

    $(document.body).on('click', 'span.postuid.ip', function () {
        var uid = $(this).text();
        $('.highlighted').removeClass('highlighted');
        $('.answer').each(function () {
            if ($(this).find('.postuid.ip').text() == uid) {
                $(this).addClass('highlighted');
            }
        });
    });

    $(document.body).on('click', 'span.postuid.id', function () {
        var uid = $(this).text();
        $('.highlighted').removeClass('highlighted');
        $('.answer').each(function () {
            if ($(this).find('.postuid.id').text() == uid) {
                $(this).addClass('highlighted');
            }
        });
    });

    // Untruncating a post
    /*
     $(document.body).on('click', '.untruncatelink', function (e) {
     var button = $(this);
     button.html('<img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '">');
     var postId = button.data('msgid');
     var boardurl = button.data('boardurl');
     var getUrl = siteUrl + '/scripts/ajax/message.php?msgonly=true&id=' + postId + '&boardurl=' + boardurl;
     $.get(getUrl, function (data) {
     $$$(postId).find('.post').html(data).clickableLinks();
     button.remove();
     });
     e.preventDefault();
     });
     */
    /*
     $('.post').each(function () {
     var this_elm = $(this);
     if (this_elm.height() > 350) {
     this_elm.addClass('truncated');
     $('<a class="linkbutton untruncatelink" onclick="unTruncatePost(' + this_elm.parent().data('msgid') + ', this)">' + messages.viewFullPost + '</a>').insertAfter(this_elm);
     }
     });
     */

    // Threadlist links
    $('.threads.style-box').on('click', '.expandlink, .playembedlink', function (e) {
        e.preventDefault();
        var link = $(this).closest('.thread').find('.postsubject').attr('href');
        if (!link) {
            return true;
        }
        window.location = link;
    });

    // Expanding an image
    $('.threads.style-replies').on('click', '.expandlink', function (e) {
        e.preventDefault();
        expandImage($(this), e);
    });

    // Play embed -link
    $('.threads.style-replies').on('click', '.playembedlink', function (e) {
        e.preventDefault();
        $(this).closest('.post').parent().find('.untruncatelink').click();
        $(this).closest('.filecontainer').removeClass('thumbnail');
        $('.playembedlink').show();
        $('.embedcontainer').html('');
        $(this).hide();

        var fileid = $(this).data('fileid');

        var loading = setTimeout(function () {
            $$$(fileid).find('.embedcontainer').show();
            $$$(fileid).find('.embedcontainer').html('<img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '" />');
        }, 500);

        $.get(siteUrl + "/scripts/ajax/embedhtml.php", {
            "id": $(this).data('embedcode'),
            "type": $(this).data('embedsource')
        }, function (text) {
            clearTimeout(loading);
            $$$(fileid).find('.embedcontainer').html(text + '<button class="embed-hidelink" onclick="removeEmbed()">' + txt_15 + '</button>');
        });

        return false;
    });

    // Clicking a quotation link
    $(document.body).on('click', '.postnumber', function (e) {
        var url = $(this).attr('href').substr(0, $(this).attr('href').indexOf("#"));
        var re = new RegExp(url, "i");

        if (!document.location.href.match(re) && !quickReplyActive) {
            // The thread is not open, redirect to the correct page
            document.location = $(this).attr('href');
        } else {
            // Correct thread is open, insert the quote into the messagefield
            lastQuoted = $(this).data('quoteid');
            $('#msg').insertAtCaret('>>' + lastQuoted + "\r\n", '', e);
            $('#qrinfo').html('<button onclick="highlightPost(' + lastQuoted + '); return false;">' + txt_28 + '</button>');
            return false;
        }
    });

    // Hide hidden posts
    hiddenPosts = JSON.parse(localStorage.getItem('hiddenPosts'));
    if (hiddenPosts) {
        hiddenPosts.forEach(function (data) {
            hidePost(data, false);
        });
    } else {
        hiddenPosts = [];
    }

    // Hack to fix spoilers on iDevices, http://www.quirksmode.org/blog/archives/2008/08/iphone_events.html
    $('.spoiler').hover(function () {
    });

    // Reflinks
    $(document.body).on('click', '.reflink', function (e) {
        if (!reflink_active) {
            return false;
        }

        var msgid = $(this).data('msgid');
        if ($$$(msgid).is(':visible')) {
            if (!$(this).closest('div').hasClass('notification')) {
                e.preventDefault();
                highlightPost(msgid);
                ;
            }
        }
    });
    $(document.body).on('mouseenter', '.reflink', function (e) {
        setTimeout('reflink_active = true;', 50);
        var tooltipId = 'tooltip-' + $(this).data('msgid');
        var tooltip = $("#" + tooltipId);
        if (!tooltip.is('*')) {
            $("body").append('<div id="' + tooltipId + '" class="tooltip"><img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '" /></div>');
            tooltip = $("#" + tooltipId);
            var msg_elm = $$$($(this).data('msgid'));
            if (msg_elm.is('*')) {
                tooltip.html(msg_elm.html().replace('autoplay=1', '').replace('autoplay', ''));
                positionTooltip(tooltip, e);
            } else {
                $.get(siteUrl + '/scripts/ajax/message.php?id=' + $(this).data('msgid'), function (data) {
                    tooltip.html(data);
                    positionTooltip(tooltip, e);
                });
            }
            tooltip.show();
        } else {
            positionTooltip(tooltip, e);
            tooltip.show();
        }
    });
    $(document.body).on('mousemove', '.reflink', function (e) {
        positionTooltip($('#tooltip-' + $(this).data('msgid')), e);
    });
    $(document.body).on('mouseleave', '.reflink', function () {
        $('.tooltip').remove();
        reflink_active = false;
    });
});

$(window)
    .on('load', function () {
        if (!$('#banner_ad_bottom').is(':visible')) {
            $('<p class="infobar" id="blocking-notification"><b>' + txt_40 + '</b><br />' + txt_41 + '<br /><br />' + txt_42 + '</p>').insertAfter('#post');
            $.post(siteUrl + '/scripts/ajax/ping.php');
        }

        if (window.location.hash.substr(0, 3) == "#no") {
            var msgid = window.location.hash.substr(3).replace(/\D/g, '');
            highlightPost(msgid);
        }
    })
    .on('focus', function () {
        unreadCount = 0;
        if (document.title != documentTitle) {
            document.title = documentTitle;
        }
    })
    .on('scroll', function () {
        threadId = $('body').data('threadid');
        if (typeof threadId == 'undefined') {
            return null;
        }
        var scroll_offset = $(document).scrollTop() + window_height;
        var thread = $('.threads .thread');
        var thread_offset = thread.offset().top + thread.outerHeight(true) - 100;

        if (autoupdate && !nextReplyUpdateTimeout && scroll_offset > thread_offset) {
            forceReplyUpdate(threadId);
        } else if (nextReplyUpdateTimeout && scroll_offset < thread_offset) {
            stopReplyUpdate();
        }
    })
    .on('resize', function () {
        window_height = $(window).height();
    });

function unTruncatePost(postId, buttonElm) {
    $$$(postId).children('.post').removeClass('truncated');

    if (typeof buttonElm !== 'undefined') {
        buttonElm.remove();
    }
}

function updateQuotes() {
    if (!/^\/([a-z\_0-9]+)(-)?([0-9]+)?\/?(!?[0-9]+)?$/.test(window.location.pathname)) {
        return false;
    }
    var appended = [];
    var replies = {};
    $('.replies').remove();
    $('a.reflink').each(function () {
        var thisId = $(this).data('postid');
        var threadId = $(this).data('threadid');
        var quotedId = $(this).data('msgid');

        if (typeof thisId == 'undefined' || typeof threadId == 'undefined' || threadId == 0) {
            return;
        }

        var firstResult = !(quotedId in replies);

        if (appended.indexOf(quotedId + '-' + thisId) != '-1') {
            return true;
        }

        $(this).attr('href', siteUrl + '/scripts/redirect.php?id=' + quotedId);

        if (firstResult) {
            replies[quotedId] = ['<span>' + txt_49 + ':</span>'];
        }

        replies[quotedId] += ' <a data-msgid="' + thisId + '" href="' + siteUrl + '/scripts/redirect.php?id=' + thisId + '" class="reflink backlink">&gt;&gt;' + thisId;

        replies[quotedId] += '</a>';

        appended.push(quotedId + '-' + thisId);

    });

    for (var key in replies) {
        $$$(key).append('<div class="replies">' + replies[key] + '</div>');
    }

    updateQuoteSuffixes();
}

function updateQuoteSuffixes() {
    $('a.reflink').each(function (i) {
        var this_elm = $(this);
        var quotedId = this_elm.data('msgid');
        var quotedPost = $$$(quotedId);

        if (this_elm.html().substr(-1) == ')') {
            return true;
        }

        if (quotedPost.hasClass('op_post')) {
            this_elm.html(this_elm.html() + ' (' + messages.op + ')');
        } else if (quotedPost.hasClass('own_post')) {
            this_elm.html(this_elm.html() + ' (' + messages.you + ')');
        }
    });
}

function positionTooltip(elm, e) {
    var offset = 10;
    var elmY = e.pageY + offset;
    var elmX = e.pageX + offset;

    // Reverse direction if overflows
    if (elmY + elm.outerHeight() > $(document).scrollTop() + window.innerHeight) {
        if (e.pageY - $(document).scrollTop() > $(document).scrollTop() + window.innerHeight - e.pageY) {
            elmY = e.pageY - offset - elm.outerHeight();
        }
    }
    if (elmX + elm.outerWidth() > $(document).scrollLeft() + window.innerWidth) {
        elmX = 0;
    }

    elm.css("top", (elmY) + "px").css("left", elmX + "px");
}

function hidePost(id, store) {
    var elm = document.getElementById('no' + id);
    if (!elm) {
        return;
    }
    elm.classList.add('hidden');

    if (store && hiddenPosts.indexOf(id) === -1) {
        hiddenPosts.push(id);
        localStorage.setItem('hiddenPosts', JSON.stringify(hiddenPosts));
    }
}

function restorePost(id) {
    var elm = document.getElementById('no' + id);
    if (!elm) {
        return;
    }
    elm.classList.remove('hidden');

    var index = hiddenPosts.indexOf(id);
    if (index >= 0) {
        hiddenPosts.splice(index, 1);
        localStorage.setItem('hiddenPosts', JSON.stringify(hiddenPosts));
    }
}

function hidePostFromAll(id) {
    var elm = document.getElementById('no' + id);
    if (!elm) {
        return;
    }
    elm.classList.add('hidden');

    $.post(siteUrl + '/scripts/ajax/op_hide.php', {
        add: 'true',
        id: id
    }, function (data) {
        if (data !== '') {
            restorePostFromAll(id);
            alert(data);
        }
    });
}

function restorePostFromAll(id) {
    var elm = document.getElementById('no' + id);
    if (!elm) {
        return;
    }
    elm.classList.remove('hidden');

    $.post(siteUrl + '/scripts/ajax/op_hide.php', {
        add: 'false',
        id: id
    });
}

function hideThread(id, store) {

    var elm = $$(id);
    var html = '\
        <p class="hidden" id="hidden_' + id + '">\
        <a onclick="restoreThread(' + id + ')" class="icon-plus" title="' + messages.restoreThread + '"></a>\
        <span class="hiddensubject">' + elm.find('.postsubject').html() + '</span>\
        <span class="posttime">' + elm.find('.posttime').html() + '</span>\
        ' + elm.find('.postnumber').html() + '\
        </p>';
    elm.after(html);
    elm.hide();

    $.post(siteUrl + '/scripts/ajax/hide_ping.php', {
        add: 'true',
        id: id
    });
}

function restoreThread(id) {
    $$(id).show();
    $('#hidden_' + id).remove();
    $.post(siteUrl + '/scripts/ajax/hide_ping.php', {
        add: 'false',
        id: id
    });
}

function editMessage(msgid) {
    if ($('#edit_' + msgid).length != 0) {
        return;
    }

    var boardurl = $$$(msgid).data('board');

    var subjectinput = '';
    if ($$$(msgid).find('.postsubject .subject').length != 0) {
        var subject = $$$(msgid).find('.postsubject .subject').html();
        subjectinput = '<input type="text" name="subject" maxlength="50" placeholder="' + txt_56 + '" id="editsubject_' + msgid + '" value="' + subject + '" />';
    }
    $('body').append('<div class="dialog" id="edit_' + msgid + '"><h3>' + txt_37 + '</h3><form action="" class="editform" method="post" onsubmit="editSave(' + msgid + '); return false;">' + subjectinput + '<textarea id="editmessage_' + msgid + '" placeholder="' + txt_57 + '">' + txt_1 + '</textarea><button onclick="if(confirm(txt_20 + \'?\')) { closeDialog(\'#edit_' + msgid + '\'); } return false;">' + txt_20 + '</button><input type="submit" value="' + txt_18 + '" /></form></div>');
    var getUrl = siteUrl + '/scripts/ajax/message.php?msgonly=true&id=' + msgid + '&boardurl=' + boardurl + '&nohtml=true';
    $.get(getUrl, function (data) {
        $('#editmessage_' + msgid).text(data).focus();
    });
}

function editSave(msgid) {
    var msg = $('#editmessage_' + msgid).val();

    var subject = '';
    if ($$$(msgid).find('.postsubject .subject').length != 0) {
        if ($('#editsubject_' + msgid).length != 0) {
            subject = $('#editsubject_' + msgid).val();
        }
    }

    var msgBoard = $$$(msgid).data('board');

    $$$(msgid).find('.post .postcontent').html('<p><img src="' + staticUrl + '/img/loading.gif" alt="' + txt_19 + '" /></p>');
    $.post(siteUrl + '/scripts/ajax/savemessage.php', {
        "msgid": msgid,
        "subject": subject,
        "msg": msg
    }, function (data) {
        var getUrl = siteUrl + '/scripts/ajax/message.php?msgonly=true&id=' + msgid + '&boardurl=' + msgBoard;
        $.get(getUrl, function (data) {
            $$$(msgid).find('.post .postcontent').html('<p>' + data + '</p>');
            if ($$$(msgid).find('.postsubject .subject').length != 0) {
                $$$(msgid).find('.postsubject .subject').html(subject.replace('<', '&lt;'));
            }
            closeDialog('#edit_' + msgid);
        });

        if (data != '') {
            alert(data);
        }
    });
}

function showEdits(msgid) {
    $$$(msgid).find('.post').append('<p class="loading"><img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '" /></p>');
    $.get(siteUrl + '/scripts/ajax/getedits.php', {"msgid": msgid}, function (data) {
        $('.loading').remove();
        if ($('#edits_' + msgid)) {
            $('#edits_' + msgid).remove();
        }
        $$$(msgid).find('.post').append(data);
    });
}

function closeDialog(elm) {
    $(elm).remove()
}

function reportMessage(msgid) {
    if ($('#report_' + msgid).length != 0) {
        return;
    }

    $('body').append('<div class="dialog" id="report_' + msgid + '"><h3>' + txt_35 + '</h3><p>' + txt_36 + '</p><form class="reportform" action="' + siteUrl + '/scripts/delete.php" method="post"><input type="hidden" name="msgid" value="' + msgid + '" /><select id="reportmessage_' + msgid + '" name="reason"><option value="0">Valitse</option></select><label for="reasonadd_' + msgid + '">Valinnainen lisäperuste</label><input type="text" id="reasonadd_' + msgid + '" name="reasonadd" /><input type="submit" value="' + txt_35 + '" name="report" /><button onclick="closeDialog(\'#report_' + msgid + '\'); return false;">' + txt_20 + '</button></form></div>');
    $.each(ruleOptions, function (key, val) {
        if (typeof val == 'object') {
            $('#reportmessage_' + msgid).append('<optgroup label="' + key + '"></optgroup>');
            $.each(val, function (subKey, subVal) {
                if (subKey != 'boards') {
                    $('#reportmessage_' + msgid + ' optgroup:last').append('<option>' + subVal + '</option>');
                }
            });
        } else {
            $('#reportmessage_' + msgid).append('<option>' + val + '</option>');
        }
    });
    $('#reportmessage_' + msgid).focus();
}

function deleteMessage(msgid, confirm) {
    if (typeof confirm == 'undefined') {
        confirm = false;
    }
    if ($('#delete_' + msgid).length != 0 && !confirm) {
        return;
    }

    if (!confirm) {
        $('body').append('<div class="dialog" id="delete_' + msgid + '"><h3>' + txt_38 + '</h3><p>' + txt_39 + '</p><button onclick="deleteMessage(' + msgid + ', true)">' + txt_38 + '</button><button class="right" onclick="closeDialog(\'#delete_' + msgid + '\'); return false;">' + txt_6 + '</button></div>');
        $('#delete_' + msgid).css({'background-color': $('body').css('background-color')});
    } else {
        // Show the loading icon if the loading takes long
        var loading = setTimeout("$('#delete_" + msgid + "').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);

        $.post(siteUrl + '/scripts/ajax/delete.php', {"msgid": msgid}, function (data) {
            clearTimeout(loading);
            closeDialog('#delete_' + msgid);
            if (data == '') {
                $$(msgid).remove();
                $$$(msgid).remove();
            } else {
                alert(data);
            }
        });
    }
}

$(document).keydown(function (e) {
    // This brings down the server load quite a bit, as not everything is reloaded when pressing F5
    if (e.which == 116 && !e.ctrlKey) { // F5
        pageReload();
        return false;
    } else if (e.which == 82 && e.ctrlKey && !e.shiftKey) { // R
        pageReload();
        return false;
    } else if (e.which == 77 && e.ctrlKey && e.shiftKey) { // M
        window.location = siteUrl + '/mod/';
        return false;
    }
});

function expandImage(elm, e) {
    var imgElm = elm.find('.imagefile');
    var container = elm.closest('.filecontainer');
    container.parent().parent().find('.untruncatelink').click();
    if (container.hasClass('thumbnail')) {
        // Not expanded, expand the image
        container.removeClass('thumbnail');
        imgElm.data('t-src', imgElm.attr('src'));
        changeSrc(imgElm, elm.data('imagefile'), false);
    } else {
        // Is expanded, contract it
        container.addClass('thumbnail');
        changeSrc(imgElm, imgElm.data('t-src'), true);
    }
}
function changeSrc(imgElm, src, scroll) {
    var loading = setTimeout(function () {
        imgElm.after('<img class="overlay center loading" src="' + staticUrl + '/img/loading.gif" alt="">');
    }, 200);
    imgElm.attr('src', src).on('load', function () {
        clearTimeout(loading);
        imgElm.parent().find('.loading').remove();
        if (scroll) {
            var elmTop = imgElm.closest('.filecontainer').offset().top;
            if ($(document).scrollTop() > elmTop) {
                $(document).scrollTop(elmTop);
            }
        }
    });
}

function expandAllImages(thread, answersOnly, elm) {

    if (expandInProgress) {
        return;
    }

    var imagefileClass = '.imagefile';
    if (elm) {
        if (!$(elm).hasClass('active')) {
            imagefileClass += '.thumbnail';
            $(elm).addClass('active');
        } else {
            imagefileClass += ':not(.thumbnail)';
            $(elm).removeClass('active');
        }
        expandInProgress = true;
    }

    if (thread) {
        if (answersOnly) {
            var links = $$(thread).find('.answers').find('a.expandlink');
        } else {
            var links = $$(thread).find('a.expandlink');
        }
    } else {
        var links = $('a.expandlink');
    }

    var timeout = (imagefileClass == '.imagefile:not(.thumbnail)' ? 10 : 100);
    var files = links.find(imagefileClass);

    setTimeout(function () {
        // After the expansion should be ready
        expandInProgress = false;
    }, files.length * timeout);

    files.each(function (i) {
        // Expand images one at a time to prevent browser hangs on long threads
        var elm = $(this);
        setTimeout(function () {
            elm.trigger('click');
        }, timeout * i);
    });
}

function removeEmbed() {
    var embedcontainer = $('.embedcontainer');
    embedcontainer.find('video').trigger('pause');
    embedcontainer.html('');
    $('.playembedlink').show();
    embedcontainer.closest('.filecontainer').addClass('thumbnail');
}

function ftPin() {
    if (localStorage.ftbox_pin == undefined) {
        $("#followedthreads").css("position", "fixed");
        $("#followedpin").removeClass("unpinned").addClass("pinned");
        localStorage.ftbox_pin = true;
    } else {
        $("#followedthreads").css("position", "absolute");
        $("#followedpin").removeClass("pinned").addClass("unpinned");
        localStorage.removeItem('ftbox_pin');
    }
}

function ftUpdate(noshow) {
    $('#followedupdate').removeAttr('href');
    $('#followedupdate').css({'text-decoration': 'underline'});

    var loading = setTimeout('$(\'#followedupdated\').show();$(\'#followedupdated\').html(\'<img src="' + staticUrl + '/img/loading.gif" style="height: 10px" alt="' + txt_1 + '" />\');', 500);

    var boardurl = $('#followedthreads').data('boardurl');
    $.get(siteUrl + "/scripts/ajax/ftupdate.php", {"boardurl": boardurl}, function (text) {
        $('#followedcontent').html(text);
        clearTimeout(loading);
        if (!noshow) {
            $('#followedupdated').fadeIn(150);
            $('#followedupdated').html(txt_5);
            setTimeout("$('#followedupdated').fadeOut(150);", 2000);
        } else {
            $('#followedupdated').hide();
        }
        setTimeout("$('#followedupdate').attr('href','javascript:ftUpdate();');", 3000);
    });
}

// Highlighting a post
// Called from $(document).ready .. I think.
function highlightPost(id) {
    $('.highlighted').removeClass("highlighted");
    var elm = $$$(id);
    if (elm.is(':not(empty)')) {
        elm.addClass("highlighted");
        $(document).scrollTop(elm.offset().top);
    }
}

function followThread(id) {
    $.get(siteUrl + "/scripts/ajax/follow.php", {"id": id}, function (text) {
        if (text == txt_9) {
            $$(id).find('.followlink').attr('onclick', 'unfollowThread(' + id + ')')
                .removeClass('icon-eye').addClass('icon-eye-crossed').attr('title', txt_10);
            ftUpdate(true);
        } else {
            alert(text);
        }
    });
}

function unfollowThread(id) {
    $.get(siteUrl + "/scripts/ajax/follow.php", {
        "id": id,
        "do": "remove"
    }, function (text) {
        if (text == txt_11) {
            $$(id).find('.followlink').attr('onclick', 'followThread(' + id + ')')
                .removeClass('icon-eye-crossed').addClass('icon-eye').attr('title', txt_12);
            ftUpdate(true);
        } else {
            alert(text);
        }
    });
}

var expandingThread = false;
function expandThread(id, loadCount) {
    if (expandingThread) {
        return false;
    }
    expandingThread = true;

    // Show the loading icon if the loading takes long
    $$(id).find('.expandcontainer').prepend('<img class="loading" src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '" />');

    var from_id = $$(id).find('.answer').first().data('msgid');
    $.get(siteUrl + "/scripts/ajax/expand.php", {
        'id': id,
        'count': loadCount,
        'start': from_id
    }, function (text) {
        $$(id).find('.loading').remove();
        if (text.length == 0) {
            $$(id).find('.morereplies').hide();
        } else {
            var loaded = $(text).find('.post').length;

            $('.separator-line').remove();
            $$$(from_id).before('<div class="separator-line"></div>');

            if (loaded < loadCount) {
                $$(id).find('.morereplies').hide();
            }

            $$(id).find('.expandcontainer').prepend(text);
            $$(id).find('.lessreplies').show();

            $$(id).find('.expandcontainer .post').each(function () {
                $(this).clickableLinks();
            });

            updateVisibleReplyCount(id);
            expandingThread = false;
        }
    });
}

function contractThread(id) {
    $('.separator-line').remove();
    $$(id).find('.expandcontainer').html('');
    $$(id).find('.morereplies').show();
    $$(id).find('.lessreplies').hide();
    updateVisibleReplyCount(id);
}

function updateVisibleReplyCount(id) {
    var repliesVisible = $$(id).find('.answers .answer').length;
    $$(id).find('.reply-count-visible').html(repliesVisible);
}

function activateGold() {
    $('#activategold').attr("disabled", true);
    var loading = setTimeout("$('#goldstatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);

    if ($('#goldkey').val() == '') {
        clearTimeout(loading);
        $('#goldstatus').html(txt_21);
        $('#goldstatus').addClass('error');
        setTimeout("$('#goldstatus').html('');", 2000);
        setTimeout("$('#goldstatus').removeClass('error');", 2000);
        setTimeout("$('#activategold').attr('disabled', false);", 2200);
        return false;
    } else {
        $.post(siteUrl + '/scripts/ajax/activategold.php', {"code": $('#goldkey').val()}, function (data) {
            clearTimeout(loading);
            if (data != 'OK') {
                $('#goldstatus').html(data);
                $('#goldstatus').addClass('error');
                setTimeout("$('#goldstatus').html('');", 2000);
                setTimeout("$('#goldstatus').removeClass('error');", 2000);
                setTimeout("$('#activategold').attr('disabled', false);", 2200);
                return false;
            } else {
                $('#goldstatus').html(txt_22);
                $('#goldstatus').addClass('success');
                setTimeout("pageReload();", 2000);
                return true;
            }
        });
    }
}

function checkName(type) {
    var checking;
    var val;

    if (typeof checking == 'undefined') {
        checking = false;
    }
    if (!checking) {
        checking = true;
        if (type == 'login') {
            val = $('#loginname').val();
        } else if (type == 'poster') {
            val = $('#postername').val();
        } else {
            return false;
        }
        $.post(siteUrl + '/scripts/ajax/checkname.php', {
            "name": val,
            "type": type
        }, function (data) {
            setTimeout("checking = false;", 100);
            if (data != 'OK') {
                $('#' + type + 'namestatus').html(data);
                $('#' + type + 'namestatus').addClass('error');
                return false;
            } else {
                $('#' + type + 'namestatus').html('');
                $('#' + type + 'namestatus').removeClass('error');
                return true;
            }
        });
    }
}

function savePosterName() {
    $('#savepostername').attr("disabled", true);
    $('#postername').attr("disabled", true);
    var loading = setTimeout("$('#posternamestatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);

    $.post(siteUrl + '/scripts/ajax/savepostername.php', {"name": $('#postername').val()}, function (data) {
        clearTimeout(loading);
        if (data != 'OK') {
            $('#posternamestatus').html(data);
            $('#posternamestatus').addClass('error');
            setTimeout("$('#savepostername').attr('disabled', false);", 100);
            setTimeout("$('#postername').attr('disabled', false);", 100);
            return false;
        } else {
            $('#posternamestatus').html(txt_23);
            $('#posternamestatus').addClass('success');
            setTimeout("$('#posternamestatus').html('');", 2000);
            setTimeout("$('#posternamestatus').removeClass('success');", 2000);
            setTimeout("$('#savepostername').attr('disabled', false);", 2200);
            setTimeout("$('#postername').attr('disabled', false);", 2200);
            return true;
        }
    });
}

function saveLoginName() {
    $('#saveloginname').attr("disabled", true);
    $('#loginname').attr("disabled", true);
    var loading = setTimeout("$('#loginnamestatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);

    $.post(siteUrl + '/scripts/ajax/saveloginname.php', {
        "name": $('#loginname').val(),
        "password": $('#loginnamepassword').val()
    }, function (data) {
        clearTimeout(loading);
        if (data != 'OK') {
            $('#loginnamestatus').html(data);
            $('#loginnamestatus').addClass('error');
            setTimeout("$('#saveloginname').attr('disabled', false);", 100);
            setTimeout("$('#loginname').attr('disabled', false);", 100);
            return false;
        } else {
            $('#loginnamestatus').html(messages.nameChanged);
            $('#loginnamestatus').addClass('success');
            setTimeout("$('#loginnamestatus').html('');", 2000);
            setTimeout("$('#loginnamestatus').removeClass('success');", 2000);
            setTimeout("$('#saveloginname').attr('disabled', false);", 2200);
            setTimeout("$('#loginname').attr('disabled', false);", 2200);
            return true;
        }
    });
}

function changePassword() {
    var password = $('#password').val();
    var passwordconfirm = $('#passwordconfirm').val();
    var currentpassword = $('#currentpassword').val();

    $('#password').attr("disabled", true);
    $('#passwordconfirm').attr("disabled", true);
    $('#currentpassword').attr("disabled", true);
    $('#changepassword').attr("disabled", true);

    if (password == '') {
        changePasswordError(txt_26);
        return false;
    }
    if (password.length < 6) {
        changePasswordError(txt_27);
        return false;
    }
    if (password != passwordconfirm) {
        changePasswordError(txt_25);
        return false;
    }
    if (currentpassword == '') {
        changePasswordError(txt_30);
        return false;
    }

    var loading = setTimeout("$('#passwordchangestatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);
    $.post(siteUrl + '/scripts/ajax/changepassword.php', {
        'password': password,
        'current': currentpassword
    }, function (data) {
        clearTimeout(loading);
        if (data != 'OK') {
            changePasswordError(data);
            return false;
        } else {
            $('#passwordchangestatus').html(txt_31);
            $('#passwordchangestatus').addClass('success');
            setTimeout("pageReload();", 2000);
            return true;
        }
    });
}

function changePasswordError(str) {
    $('#passwordchangestatus').addClass('error');
    $('#passwordchangestatus').html(str);
    setTimeout("$('#passwordchangestatus').html('');", 2000);
    setTimeout("$('#passwordchangestatus').removeClass('error');", 2000);
    setTimeout("$('#password').attr('disabled', false);", 2200);
    setTimeout("$('#passwordconfirm').attr('disabled', false);", 2200);
    setTimeout("$('#currentpassword').attr('disabled', false);", 2200);
    setTimeout("$('#changepassword').attr('disabled', false);", 2200);
}

function deleteProfile() {
    $('#deleteprofile').attr("disabled", true);
    $('#confirmpassword').attr("disabled", true);
    $('#confirmdelete').attr("disabled", true);

    var confirmed = $('#confirmdelete').is(':checked');
    if (confirmed) {
        var doubleConfirm = confirm(txt_24);
        if (doubleConfirm) {
            var loading = setTimeout("$('#deleteprofilestatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);
            $.post(siteUrl + '/scripts/ajax/deleteprofile.php', {
                'confirm': 'on',
                'password': $('#confirmpassword').val()
            }, function (data) {
                clearTimeout(loading);
                if (data != 'OK') {
                    deleteProfileError(data);
                    return false;
                } else {
                    $('#deleteprofilestatus').html(txt_33);
                    $('#deleteprofilestatus').addClass('success');
                    setTimeout("pageReload();", 2000);
                    return true;
                }
            });
        } else {
            deleteProfileError(txt_32);
            return false;
        }
    } else {
        deleteProfileError(txt_32);
        return false;
    }
}

function deleteProfileError(str) {
    $('#deleteprofilestatus').addClass('error');
    $('#deleteprofilestatus').html(str);
    setTimeout("$('#deleteprofilestatus').html('');", 2000);
    setTimeout("$('#deleteprofilestatus').removeClass('error');", 2000);
    setTimeout("$('#deleteprofile').attr('disabled', false);", 2200);
    setTimeout("$('#confirmpassword').attr('disabled', false);", 2200);
    setTimeout("$('#confirmdelete').attr('disabled', false);", 2200);
}

function submitAsyncreply(form, e) {
    submitInProgress = true;
    if (typeof FormData == "undefined") {
        $('form#post #async').attr('value', 'false');
        return true;
    }

    var formElm = form;
    var textareaElm = $(formElm).find('#msg');
    var submitElm = $(formElm).find('#submit');
    var origMessage = textareaElm.val();

    e.preventDefault();
    var fd = new FormData(formElm);

    if ('delete' in fd && document.getElementById('file') && document.getElementById('file').value === '') {
        fd.delete('file');
    }

    submitElm.attr('disabled', 'disabled');
    textareaElm.attr('disabled', 'disabled').val(txt_1);
    $.ajax({
        url: $(formElm).attr("action"),
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        data: fd,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = Math.round((evt.loaded / evt.total) * 100);
                        if (percentComplete != 100) {
                            textareaElm.val(txt_54 + ' ' + percentComplete + '%');
                        } else {
                            textareaElm.val(txt_55);
                        }
                    }
                }, false);
            }
            return myXhr;
        },
        success: function (data, textStatus, jqXHR) {

            // An error occurred
            if (data.length != 0 && data.substr(0, 3) != 'OK:') {
                textareaElm.val(txt_51 + "\r\n" + data);
                setTimeout(function () {
                    submitElm.prop('disabled', false);
                    textareaElm.prop('disabled', false).val(origMessage);
                }, 2000);
                return;
            } else if (data.substr(0, 3) == 'OK:') {
                window.location = data.substr(3);
            }

            var hide_poster_name = $(formElm).find('input[name="hide_poster_name"]').is(':checked');
            $(formElm)[0].reset();
            $(formElm).find('input[name="hide_poster_name"]').prop('checked', hide_poster_name);

            submitElm.prop('disabled', false);
            textareaElm.prop('disabled', false).val('');
            forceReplyUpdate($('#thread').val());

            $(formElm).removeClass('asyncreply');
            submitInProgress = false;

            if (quickReplyActive) {
                toggleQuickReply(quickReplyActive);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(txt_51 + ': ' + textStatus + ' ' + errorThrown);
            textareaElm.val(txt_51 + "\r\n" + textStatus + ' ' + errorThrown);
            setTimeout(function () {
                textareaElm.val(origMessage);
                submitElm.prop('disabled', false);
                textareaElm.prop('disabled', false);
            }, 2000);
            submitInProgress = false;
        }
    }).done(function () {
        setTimeout(function () {
            submitElm.prop('disabled', false);
            textareaElm.prop('disabled', false);
        }, 2000);
        submitInProgress = false;
    });
}

// Ajax thread update
function forceReplyUpdate(threadId) {
    clearTimeout(nextReplyUpdateTimeout);
    updateRetryCount = 0;
    nextReplyUpdateTimeout = setTimeout(function () {
        loadNewReplies(threadId)
    }, 1);
}

function getNewReplies(elm, threadId) {
    var button_elm = $(elm);
    forceReplyUpdate(threadId);
    button_elm.prop('disabled', true);
    setTimeout(function () {
        button_elm.prop('disabled', false)
    }, 2000);
}

function stopReplyUpdate() {
    clearTimeout(nextReplyUpdateTimeout);
    nextReplyUpdateTimeout = false;
}

function loadNewReplies(threadId) {
    if (updateRunning) {
        return false;
    }

    if ($('#msg').is(':focus')) {
        if (autoupdate) {
            nextReplyUpdateTimeout = setTimeout(function () {
                loadNewReplies(threadId)
            }, 2000);
        } // Run again
        return false;
    }

    var lastAnswer = $$(threadId).find('.answers .answer:last');

    if (lastAnswer.is('*')) {
        var latestReply = lastAnswer.attr('id').replace('no', '');
    } else {
        var latestReply = 1;
    }

    if (threadId.length == 0 || latestReply.length == 0) {
        return false;
    }

    updateRunning = true;
    $.get(siteUrl + '/scripts/ajax/get_new_replies.php', {
        thread: threadId,
        latest_reply: latestReply
    }, function (data) {
        updateRunning = false;
        if (!data.html) {
            updateRetryCount += 1;
            if (updateRetryCount > 30) {
                // Inactive for too long (a little over half an hour), cancel autoupdate until next focus
                stopReplyUpdate();
                return;
            }
        } else {
            updateRetryCount = 0;
        }

        if (autoupdate) {
            nextReplyUpdateTimeout = setTimeout(function () {
                loadNewReplies(threadId)
            }, 2000 * (updateRetryCount + 1));
        } // Run again

        if (typeof data.unreadCount == 'undefined' || typeof data.html == 'undefined' || data.unreadCount.length == 0 || data.html.length == 0) {
            return;
        }

        unreadCount += data.unreadCount;

        // Notify about new posts on title
        if (!document.hasFocus()) {
            document.title = '(' + unreadCount + ') ' + documentTitle;
        } else {
            unreadCount = 0;
        }
        var postformInFocus = $('form#post input, form#post textarea').is(":focus");
        var scrollBottom = $(document).height() - ($(window).scrollTop() + window.innerHeight);

        $$(threadId).find('.answers').append(data.html.replace('class="answer', 'class="answer addlinks'));

        latestReply = $('.answer:last-of-type').attr('id').replace('no', '');

        updateQuotes();
        $('.answer.addlinks').each(function () {
            $(this).children('.post').each(function () {
                $(this).clickableLinks();
            });
            $(this).removeClass('addlinks');
        });

        if (postformInFocus) {
            $(window).scrollTop($(document).height() - window.innerHeight - scrollBottom);
        }
    }).fail(function () {
        updateRunning = false;
        stopReplyUpdate();
    });
}

// On preferences -page
function switch_preferences_tab(id, pushState) {
    if (typeof pushState == 'undefined') {
        pushState = false;
    }

    $("#right.preferences #tabchooser li").removeClass("cur");
    $("#right.preferences #tabchooser li[data-tabid='" + id + "']").addClass("cur");
    $("#right.preferences div.tab").hide();
    $("#right.preferences div.tab#" + id).show();

    if (pushState) {
        history.pushState({id: Date.now()}, '', window.location.href.split('?')[0] + '?' + id);
    }
}

// "This" -button
function add_this(post_id) {
    if (typeof post_id == 'undefined') {
        return;
    }

    var count_elm = $$$(post_id).find('.upvote_count');
    if (count_elm.data('this') == 1) {
        return;
    }

    count_elm.data('this', 1);
    count_elm.data('count', (count_elm.data('count') + 1));
    count_elm.html('+' + count_elm.data('count'));

    $.post(siteUrl + '/scripts/ajax/addthis.php', {
        'post_id': post_id
    }, function (data) {
        if (data.length == 0) {
            return true;
        } else {
            alert(data);
            count_elm.data('count', (count_elm.data('count') - 1));
            count_elm.html('+' + (count_elm.data('count')));
        }
    }).fail(function () {
        count_elm.data('count', (count_elm.data('count') - 1));
        count_elm.html('+' + (count_elm.data('count')));
    });
}

// Gibe gold to another user
function gibe_gold(post_id) {
    closeDialog('.dialog');
    var htmlContent = '<div class="dialog">' + '<h3>' + messages.donateGoldTitle + '</h3>' + '<p>' + messages.donateGoldTextCode + '</p>' + '<p>' + messages.donateGoldSelectedPost + ': <span class="reflink" data-msgid="' + post_id + '">&gt;&gt;' + post_id + '</span><br><br></p>' + '<div id="unused_keys_donate"><img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '"></div>' + '<br><br><button onclick="gibe_gold_terms()">' + messages.donateGoldTermsTitle + '</button> <button onclick="closeDialog(\'.dialog\')" class="close">' + txt_20 + '</button>' + '</div>';
    $('body').append(htmlContent);

    $.get(siteUrl + '/scripts/ajax/get_unused_gold_keys.php', function (data) {
        var keys = JSON.parse(data);
        if (keys.length == 0) {
            $('#unused_keys_donate').html('<p>' + messages.donateGoldNoKeys + '<br><br><a href="/kultatili">' + messages.donateGoldGoPurchase + '</a></p>');
        } else {
            var newHtml = '<table class="donategold" style="width:100%">';
            $.each(keys, function (key, val) {
                newHtml += '<td><td>' + key + '</td><td><button onclick="donate_gold_key(\'' + key + '\', ' + post_id + ')">' + messages.donateGoldButton + '</button></td></tr>';
            });
            newHtml += '</table>'
            $('#unused_keys_donate').html(newHtml);
        }
    });
}
function gibe_gold_terms() {
    closeDialog('#donateterms');
    $('body').append('<div class="dialog" id="donateterms"><h3>' + messages.donateGoldTitle + '</h3><div class="data"><p>' + messages.donateGoldTermsTitle + '</p><p>' + messages.donateGoldTermsText + '</p></div><button onclick="closeDialog(\'#donateterms\')" class="close">' + txt_20 + '</button></div>');
}
function donate_gold_key(key, post_id) {
    if (typeof key == 'undefined' || typeof post_id == 'undefined') {
        alert(txt_51);
    }

    $.post(siteUrl + '/scripts/ajax/donate_gold_key.php', {
        key: key,
        post_id: post_id
    }, function (data) {
        if (data.length != 0) {
            alert(data);
        } else {
            closeDialog('.dialog');
            alert(messages.donateGoldSuccess);
        }
    }).fail(function () {
        closeDialog('.dialog');
        alert(txt_51);
    });
}

// Notifications
function get_notifications() {
    if ($('#notifications').is('*')) {
        return;
    }

    $('body').append('<div class="dialog" id="notifications"><h3>' + txt_43 + '</h3><div class="data">' + txt_1 + '</div><button onclick="closeDialog(\'#notifications\')" class="close">' + txt_20 + '</button><button onclick="mark_notifications_as_read()">' + txt_44 + '</button></div>');
    $.get(siteUrl + '/scripts/notifications/get.php', function (data) {
        $('#notifications .data').html(data);
    });
}

function mark_notifications_as_read() {
    if (!$('#notifications').is('*')) {
        return;
    }

    $.get(siteUrl + '/scripts/notifications/markasread.php', function (data) {
        closeDialog('#notifications');
        $('.notifications').css('font-weight', '').children('.notification_count').remove();
        $('.notification_count').remove();
    });
}

// Mobile sidebar toggle
function toggle_menu() {
    $('body').toggleClass('menu_opened');
}

// Hide menu when clicked on border
$('body').on('click', '#left', function (e) {
    var offsetX = e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX;

    if (offsetX <= $(this).innerWidth()) {
        return true;
    }
    if (!$('body').hasClass('menu_opened')) {
        return true;
    }

    toggle_menu();
    return false;
});

// Hide mobile messageoptions when a link is clicked
$('.messageoptions_mobile').on('click', function () {
    $('.messageoptions a').click(function () {
        $(this).parent().hide();
    });
});

// Forcebump
function forceBump(id) {
    if (!confirm(messages.confirmForceBump)) {
        return false;
    }

    $.post(siteUrl + '/scripts/ajax/forcebump.php', {id: id}, function (data) {
        if (data.length != 0) {
            alert(data);
        } else {
            $('.forcebump').attr('disabled', 'disabled');
            $('.forcebump').html(txt_7);
        }
    });
}

function superSage(id) {
    if (!confirm(messages.confirmSupersage)) {
        return false;
    }

    $.post(siteUrl + '/scripts/ajax/supersage.php', {id: id}, function (data) {
        if (data.length != 0) {
            alert(data);
        } else {
            $('.supersage').attr('disabled', 'disabled');
            $('.supersage').html(txt_8);
        }
    });
}

function reviveThread(id) {
    if (!confirm(messages.confirmRevive)) {
        return false;
    }

    $.post(siteUrl + '/scripts/ajax/revivethread.php', {id: id}, function (data) {
        if (data.length != 0) {
            alert(data);
        } else {
            $('.revivethread').attr('disabled', 'disabled');
            $('.revivethread').html(txt_16);
        }
    });
}

var quickReplyActive = false;
function toggleQuickReply(id) {
    if (quickReplyActive && quickReplyActive != id) {
        toggleQuickReply(quickReplyActive);
    }
    if (!quickReplyActive) {
        $('form#post').appendTo($$(id));
        $('#thread').attr('value', id);
        $$(id).find('.quickreply').html(txt_20);
        $('#display_postform button').click();
        $('label[for="subject"]').hide();
        $('#subject').hide();
        $('#msg').focus();
        quickReplyActive = id;
    } else {
        $('form#post').appendTo($('#postform'));
        $('#thread').attr('value', 0);
        $$(id).find('.quickreply').html(txt_17);
        $('label[for="subject"]').show();
        $('#subject').show();
        quickReplyActive = false;
    }
}

function addBbCode(code) {
    $('#msg').insertAtCaret('[' + code + ']', '[/' + code + ']');
}

function changeDisplayStyle(id) {
    $.post(siteUrl + '/scripts/ajax/savedisplaystyle.php', {style_id: id}, function (data) {
        if (data.length != 0) {
            alert(data);
        } else {
            window.location = window.location.href.replace(/\-[0-9]+\//g, '/');
        }
    });
}

if ($('#right.preferences').is('*')) {
    var currentTab = window.location.search.substring(1).split('&')[0];
    $('#right.preferences #tabchooser li.tab').on('click', function () {
        switch_preferences_tab($(this).data('tabid'), true);
    });
    if ($('#' + currentTab).length == 0) {
        switch_preferences_tab($('#tabchooser li.tab').first().data('tabid'), false);
    } else {
        switch_preferences_tab(currentTab, false);
    }
}

if (localStorage.ftbox_left != undefined) {
    $("#followedthreads").css("left", localStorage.ftbox_left);
}
if (localStorage.ftbox_top != undefined) {
    $("#followedthreads").css("top", localStorage.ftbox_top);
}
if (localStorage.ftbox_pin != undefined) {
    $("#followedthreads").css("position", "fixed");
    $("#followedpin").removeClass("unpinned").addClass("pinned");
}

$('#right.purchaseform button.choose').on('click', function (e) {
    e.preventDefault();
    $('#quantity-input').hide();
    $('button.choose').show();

    $('#right.purchaseform .product').removeClass('selected');
    $('#product_id').val($(this).parent('.product').data('product_id'));
    $(this).parent('.product').addClass('selected');

    $('#quantity-input').appendTo('#right.purchaseform .product.selected');
    $('#quantity-input').css('display', 'inline-block');
    $(this).hide();
});

function $$(id) {
    return $('#thread_' + id);
}

function $$$(id) {
    return $('#no' + id);
}

// Add share buttons if browser supports
if (typeof navigator.share !== 'undefined') {
    document.querySelectorAll('.op_post .messageoptions').forEach(function (elm) {
        var shareBtn = document.createElement('a');
        shareBtn.classList.add('icon-share2');
        shareBtn.setAttribute('title', 'Share');
        shareBtn.style.cursor = 'pointer';
        shareBtn.onclick = function(event) {
            var opPost = event.target.closest(".op_post");
            var subjectElm = opPost.querySelector(".postsubject");
            var url = subjectElm.getAttribute("href");
            var subject = decodeEntities(subjectElm.querySelector(".subject").innerHTML);
            navigator.share({
                title: subject,
                text: subject,
                url: url
            });
            if (typeof window.ga === 'function') {
                ga('send', 'event', 'Share', opPost.dataset.board +'/'+ opPost.dataset.msgid);
            }
        };
        elm.parentNode.insertBefore(shareBtn, elm);
    });
}

function decodeEntities(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}