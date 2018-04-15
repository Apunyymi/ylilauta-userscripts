function pageReload() {
    location.href.indexOf("#") > -1 ? location.assign(location.href.replace(/\/?#[a-z0-9_=-]*/, "")) : document.location = document.location
}

function unTruncatePost(t, e) {
    $$$(t).children(".post").removeClass("truncated"), undefined !== e && e.remove()
}

function updateQuotes() {
    if (!/^\/([a-z\_0-9]+)(-)?([0-9]+)?\/?(!?[0-9]+)?$/.test(window.location.pathname)) return false;
    var t = [],
        e = {};
    $(".replies").remove(), $("a.reflink").each(function() {
        var s = $(this).data("postid"),
            i = $(this).data("threadid"),
            o = $(this).data("msgid");
        if (undefined !== s && undefined !== i && 0 != i) {
            var a = !(o in e);
            if ("-1" != t.indexOf(o + "-" + s)) return true;
            $(this).attr("href", siteUrl + "/scripts/redirect.php?id=" + o), a && (e[o] = ["<span>" + txt_49 + ":</span>"]), e[o] += ' <a data-msgid="' + s + '" href="' + siteUrl + "/scripts/redirect.php?id=" + s + '" class="reflink backlink">&gt;&gt;' + s, e[o] += "</a>", t.push(o + "-" + s)
        }
    });
    for (var s in e) $$$(s).append('<div class="replies">' + e[s] + "</div>");
    updateQuoteSuffixes()
}

function updateQuoteSuffixes() {
    $("a.reflink").each(function(t) {
        var e = $(this),
            s = e.data("msgid"),
            i = $$$(s);
        if (")" == e.html().substr(-1)) return true;
        i.hasClass("op_post") ? e.html(e.html() + " (" + messages.op + ")") : i.hasClass("own_post") && e.html(e.html() + " (" + messages.you + ")")
    })
}

function positionTooltip(t, e) {
    var s = e.pageY + 10,
        i = e.pageX + 10;
    s + t.outerHeight() > $(document).scrollTop() + window.innerHeight && e.pageY - $(document).scrollTop() > $(document).scrollTop() + window.innerHeight - e.pageY && (s = e.pageY - 10 - t.outerHeight()), i + t.outerWidth() > $(document).scrollLeft() + window.innerWidth && (i = 0), t.css("top", s + "px").css("left", i + "px")
}

function hidePost(t, e) {
    var s = document.getElementById("no" + t);
    s && (s.classList.add("hidden"), e && hiddenPosts.indexOf(t) === -1 && (hiddenPosts.push(t), localStorage.setItem("hiddenPosts", JSON.stringify(hiddenPosts))))
}

function restorePost(t) {
    var e = document.getElementById("no" + t);
    if (e) {
        e.classList.remove("hidden");
        var s = hiddenPosts.indexOf(t);
        s >= 0 && (hiddenPosts.splice(s, 1), localStorage.setItem("hiddenPosts", JSON.stringify(hiddenPosts)))
    }
}

function hidePostFromAll(t) {
    var e = document.getElementById("no" + t);
    e && (e.classList.add("hidden"), $.post(siteUrl + "/scripts/ajax/op_hide.php", {
        add: "true",
        id: t
    }, function(e) {
        "" !== e && (restorePostFromAll(t), alert(e))
    }))
}

function restorePostFromAll(t) {
    var e = document.getElementById("no" + t);
    e && (e.classList.remove("hidden"), $.post(siteUrl + "/scripts/ajax/op_hide.php", {
        add: "false",
        id: t
    }))
}

function hideThread(t, e) {
    var s = $$(t),
        i = '        <p class="hidden" id="hidden_' + t + '">        <a onclick="restoreThread(' + t + ')" class="icon-plus" title="' + messages.restoreThread + '"></a>        <span class="hiddensubject">' + s.find(".postsubject").html() + '</span>        <span class="posttime">' + s.find(".posttime").html() + "</span>        " + s.find(".postnumber").html() + "        </p>";
    s.after(i), s.hide(), $.post(siteUrl + "/scripts/ajax/hide_ping.php", {
        add: "true",
        id: t
    })
}

function restoreThread(t) {
    $$(t).show(), $("#hidden_" + t).remove(), $.post(siteUrl + "/scripts/ajax/hide_ping.php", {
        add: "false",
        id: t
    })
}

function editMessage(t) {
    if (0 == $("#edit_" + t).length) {
        var e = $$$(t).data("board"),
            s = "";
        if (0 != $$$(t).find(".postsubject .subject").length) {
            var i = $$$(t).find(".postsubject .subject").html();
            s = '<input type="text" name="subject" maxlength="50" placeholder="' + txt_56 + '" id="editsubject_' + t + '" value="' + i + '" />'
        }
        $("body").append('<div class="dialog" id="edit_' + t + '"><h3>' + txt_37 + '</h3><form action="" class="editform" method="post" onsubmit="editSave(' + t + '); return false;">' + s + '<textarea id="editmessage_' + t + '" placeholder="' + txt_57 + '">' + txt_1 + "</textarea><button onclick=\"if(confirm(txt_20 + '?')) { closeDialog('#edit_" + t + "'); } return false;\">" + txt_20 + '</button><input type="submit" value="' + txt_18 + '" /></form></div>');
        var o = siteUrl + "/scripts/ajax/message.php?msgonly=true&id=" + t + "&boardurl=" + e + "&nohtml=true";
        $.get(o, function(e) {
            $("#editmessage_" + t).text(e).focus()
        })
    }
}

function editSave(t) {
    var e = $("#editmessage_" + t).val(),
        s = "";
    0 != $$$(t).find(".postsubject .subject").length && 0 != $("#editsubject_" + t).length && (s = $("#editsubject_" + t).val());
    var i = $$$(t).data("board");
    $$$(t).find(".post .postcontent").html('<p><img src="' + staticUrl + '/img/loading.gif" alt="' + txt_19 + '" /></p>'), $.post(siteUrl + "/scripts/ajax/savemessage.php", {
        msgid: t,
        subject: s,
        msg: e
    }, function(e) {
        var o = siteUrl + "/scripts/ajax/message.php?msgonly=true&id=" + t + "&boardurl=" + i;
        $.get(o, function(e) {
            $$$(t).find(".post .postcontent").html("<p>" + e + "</p>"), 0 != $$$(t).find(".postsubject .subject").length && $$$(t).find(".postsubject .subject").html(s.replace("<", "&lt;")), closeDialog("#edit_" + t)
        }), "" != e && alert(e)
    })
}

function showEdits(t) {
    $$$(t).find(".post").append('<p class="loading"><img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '" /></p>'), $.get(siteUrl + "/scripts/ajax/getedits.php", {
        msgid: t
    }, function(e) {
        $(".loading").remove(), $("#edits_" + t) && $("#edits_" + t).remove(), $$$(t).find(".post").append(e)
    })
}

function closeDialog(t) {
    $(t).remove()
}

function reportMessage(t) {
    0 == $("#report_" + t).length && ($("body").append('<div class="dialog" id="report_' + t + '"><h3>' + txt_35 + "</h3><p>" + txt_36 + '</p><form class="reportform" action="' + siteUrl + '/scripts/delete.php" method="post"><input type="hidden" name="msgid" value="' + t + '" /><select id="reportmessage_' + t + '" name="reason"><option value="0">Valitse</option></select><label for="reasonadd_' + t + '">Valinnainen lisÃ¤peruste</label><input type="text" id="reasonadd_' + t + '" name="reasonadd" /><input type="submit" value="' + txt_35 + '" name="report" /><button onclick="closeDialog(\'#report_' + t + "'); return false;\">" + txt_20 + "</button></form></div>"), $.each(ruleOptions, function(e, s) {
        "object" == typeof s ? ($("#reportmessage_" + t).append('<optgroup label="' + e + '"></optgroup>'), $.each(s, function(e, s) {
            "boards" != e && $("#reportmessage_" + t + " optgroup:last").append("<option>" + s + "</option>")
        })) : $("#reportmessage_" + t).append("<option>" + s + "</option>")
    }), $("#reportmessage_" + t).focus())
}

function deleteMessage(t, e) {
    if (undefined === e && (e = false), 0 == $("#delete_" + t).length || e)
        if (e) {
            var s = setTimeout("$('#delete_" + t + "').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);
            $.post(siteUrl + "/scripts/ajax/delete.php", {
                msgid: t
            }, function(e) {
                clearTimeout(s), closeDialog("#delete_" + t), "" == e ? ($$(t).remove(), $$$(t).remove()) : alert(e)
            })
        } else $("body").append('<div class="dialog" id="delete_' + t + '"><h3>' + txt_38 + "</h3><p>" + txt_39 + '</p><button onclick="deleteMessage(' + t + ', true)">' + txt_38 + '</button><button class="right" onclick="closeDialog(\'#delete_' + t + "'); return false;\">" + txt_6 + "</button></div>"), $("#delete_" + t).css({
            "background-color": $("body").css("background-color")
        })
}

function expandImage(t, e) {
    var s = t.find(".imagefile"),
        i = t.closest(".filecontainer");
    i.parent().parent().find(".untruncatelink").click(), i.hasClass("thumbnail") ? (i.removeClass("thumbnail"), s.data("t-src", s.attr("src")), changeSrc(s, t.data("imagefile"), false)) : (i.addClass("thumbnail"), changeSrc(s, s.data("t-src"), true))
}

function changeSrc(t, e, s) {
    var i = setTimeout(function() {
        t.after('<img class="overlay center loading" src="' + staticUrl + '/img/loading.gif" alt="">')
    }, 200);
    t.attr("src", e).on("load", function() {
        if (clearTimeout(i), t.parent().find(".loading").remove(), s) {
            var e = t.closest(".filecontainer").offset().top;
            $(document).scrollTop() > e && $(document).scrollTop(e)
        }
    })
}

function expandAllImages(t, e, s) {
    if (!expandInProgress) {
        var i = ".imagefile";
        if (s && ($(s).hasClass("active") ? (i += ":not(.thumbnail)", $(s).removeClass("active")) : (i += ".thumbnail", $(s).addClass("active")), expandInProgress = true), t)
            if (e) var o = $$(t).find(".answers").find("a.expandlink");
            else var o = $$(t).find("a.expandlink");
        else var o = $("a.expandlink");
        var a = ".imagefile:not(.thumbnail)" == i ? 10 : 100,
            n = o.find(i);
        setTimeout(function() {
            expandInProgress = false
        }, n.length * a), n.each(function(t) {
            var e = $(this);
            setTimeout(function() {
                e.trigger("click")
            }, a * t)
        })
    }
}

function removeEmbed() {
    var t = $(".embedcontainer");
    t.find("video").trigger("pause"), t.html(""), $(".playembedlink").show(), t.closest(".filecontainer").addClass("thumbnail")
}

function ftPin() {
    undefined == localStorage.ftbox_pin ? ($("#followedthreads").css("position", "fixed"), $("#followedpin").removeClass("unpinned").addClass("pinned"), localStorage.ftbox_pin = true) : ($("#followedthreads").css("position", "absolute"), $("#followedpin").removeClass("pinned").addClass("unpinned"), localStorage.removeItem("ftbox_pin"))
}

function ftUpdate(t) {
    $("#followedupdate").removeAttr("href"), $("#followedupdate").css({
        "text-decoration": "underline"
    });
    var e = setTimeout("$('#followedupdated').show();$('#followedupdated').html('<img src=\"" + staticUrl + '/img/loading.gif" style="height: 10px" alt="' + txt_1 + "\" />');", 500),
        s = $("#followedthreads").data("boardurl");
    $.get(siteUrl + "/scripts/ajax/ftupdate.php", {
        boardurl: s
    }, function(s) {
        $("#followedcontent").html(s), clearTimeout(e), t ? $("#followedupdated").hide() : ($("#followedupdated").fadeIn(150), $("#followedupdated").html(txt_5), setTimeout("$('#followedupdated').fadeOut(150);", 2e3)), setTimeout("$('#followedupdate').attr('href','javascript:ftUpdate();');", 3e3)
    })
}

function highlightPost(t) {
    $(".highlighted").removeClass("highlighted");
    var e = $$$(t);
    e.is(":not(empty)") && (e.addClass("highlighted"), $(document).scrollTop(e.offset().top))
}

function followThread(t) {
    $.get(siteUrl + "/scripts/ajax/follow.php", {
        id: t
    }, function(e) {
        e == txt_9 ? ($$(t).find(".followlink").attr("onclick", "unfollowThread(" + t + ")").removeClass("icon-eye").addClass("icon-eye-crossed").attr("title", txt_10), ftUpdate(true)) : alert(e)
    })
}

function unfollowThread(t) {
    $.get(siteUrl + "/scripts/ajax/follow.php", {
        id: t,
        do: "remove"
    }, function(e) {
        e == txt_11 ? ($$(t).find(".followlink").attr("onclick", "followThread(" + t + ")").removeClass("icon-eye-crossed").addClass("icon-eye").attr("title", txt_12), ftUpdate(true)) : alert(e)
    })
}

function expandThread(t, e) {
    if (expandingThread) return false;
    expandingThread = true, $$(t).find(".expandcontainer").prepend('<img class="loading" src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '" />');
    var s = $$(t).find(".answer").first().data("msgid");
    $.get(siteUrl + "/scripts/ajax/expand.php", {
        id: t,
        count: e,
        start: s
    }, function(i) {
        if ($$(t).find(".loading").remove(), 0 == i.length) $$(t).find(".morereplies").hide();
        else {
            var o = $(i).find(".post").length;
            $(".separator-line").remove(), $$$(s).before('<div class="separator-line"></div>'), o < e && $$(t).find(".morereplies").hide(), $$(t).find(".expandcontainer").prepend(i), $$(t).find(".lessreplies").show(), $$(t).find(".expandcontainer .post").each(function() {
                $(this).clickableLinks()
            }), updateVisibleReplyCount(t), expandingThread = false
        }
    })
}

function contractThread(t) {
    $(".separator-line").remove(), $$(t).find(".expandcontainer").html(""), $$(t).find(".morereplies").show(), $$(t).find(".lessreplies").hide(), updateVisibleReplyCount(t)
}

function updateVisibleReplyCount(t) {
    var e = $$(t).find(".answers .answer").length;
    $$(t).find(".reply-count-visible").html(e)
}

function activateGold() {
    $("#activategold").attr("disabled", true);
    var t = setTimeout("$('#goldstatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);
    if ("" == $("#goldkey").val()) return clearTimeout(t), $("#goldstatus").html(txt_21), $("#goldstatus").addClass("error"), setTimeout("$('#goldstatus').html('');", 2e3), setTimeout("$('#goldstatus').removeClass('error');", 2e3), setTimeout("$('#activategold').attr('disabled', false);", 2200), false;
    $.post(siteUrl + "/scripts/ajax/activategold.php", {
        code: $("#goldkey").val()
    }, function(e) {
        return clearTimeout(t), "OK" != e ? ($("#goldstatus").html(e), $("#goldstatus").addClass("error"), setTimeout("$('#goldstatus').html('');", 2e3), setTimeout("$('#goldstatus').removeClass('error');", 2e3), setTimeout("$('#activategold').attr('disabled', false);", 2200), false) : ($("#goldstatus").html(txt_22), $("#goldstatus").addClass("success"), setTimeout("pageReload();", 2e3), true)
    })
}

function checkName(t) {
    var e, s;
    if (undefined === e && (e = false), !e) {
        if (e = true, "login" == t) s = $("#loginname").val();
        else {
            if ("poster" != t) return false;
            s = $("#postername").val()
        }
        $.post(siteUrl + "/scripts/ajax/checkname.php", {
            name: s,
            type: t
        }, function(e) {
            return setTimeout("checking = false;", 100), "OK" != e ? ($("#" + t + "namestatus").html(e), $("#" + t + "namestatus").addClass("error"), false) : ($("#" + t + "namestatus").html(""), $("#" + t + "namestatus").removeClass("error"), true)
        })
    }
}

function savePosterName() {
    $("#savepostername").attr("disabled", true), $("#postername").attr("disabled", true);
    var t = setTimeout("$('#posternamestatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);
    $.post(siteUrl + "/scripts/ajax/savepostername.php", {
        name: $("#postername").val()
    }, function(e) {
        return clearTimeout(t), "OK" != e ? ($("#posternamestatus").html(e), $("#posternamestatus").addClass("error"), setTimeout("$('#savepostername').attr('disabled', false);", 100), setTimeout("$('#postername').attr('disabled', false);", 100), false) : ($("#posternamestatus").html(txt_23), $("#posternamestatus").addClass("success"), setTimeout("$('#posternamestatus').html('');", 2e3), setTimeout("$('#posternamestatus').removeClass('success');", 2e3), setTimeout("$('#savepostername').attr('disabled', false);", 2200), setTimeout("$('#postername').attr('disabled', false);", 2200), true)
    })
}

function saveLoginName() {
    $("#saveloginname").attr("disabled", true), $("#loginname").attr("disabled", true);
    var t = setTimeout("$('#loginnamestatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);
    $.post(siteUrl + "/scripts/ajax/saveloginname.php", {
        name: $("#loginname").val(),
        password: $("#loginnamepassword").val()
    }, function(e) {
        return clearTimeout(t), "OK" != e ? ($("#loginnamestatus").html(e), $("#loginnamestatus").addClass("error"), setTimeout("$('#saveloginname').attr('disabled', false);", 100), setTimeout("$('#loginname').attr('disabled', false);", 100), false) : ($("#loginnamestatus").html(messages.nameChanged), $("#loginnamestatus").addClass("success"), setTimeout("$('#loginnamestatus').html('');", 2e3), setTimeout("$('#loginnamestatus').removeClass('success');", 2e3), setTimeout("$('#saveloginname').attr('disabled', false);", 2200), setTimeout("$('#loginname').attr('disabled', false);", 2200), true)
    })
}

function changePassword() {
    var t = $("#password").val(),
        e = $("#passwordconfirm").val(),
        s = $("#currentpassword").val();
    if ($("#password").attr("disabled", true), $("#passwordconfirm").attr("disabled", true), $("#currentpassword").attr("disabled", true), $("#changepassword").attr("disabled", true), "" == t) return changePasswordError(txt_26), false;
    if (t.length < 6) return changePasswordError(txt_27), false;
    if (t != e) return changePasswordError(txt_25), false;
    if ("" == s) return changePasswordError(txt_30), false;
    var i = setTimeout("$('#passwordchangestatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);
    $.post(siteUrl + "/scripts/ajax/changepassword.php", {
        password: t,
        current: s
    }, function(t) {
        return clearTimeout(i), "OK" != t ? (changePasswordError(t), false) : ($("#passwordchangestatus").html(txt_31), $("#passwordchangestatus").addClass("success"), setTimeout("pageReload();", 2e3), true)
    })
}

function changePasswordError(t) {
    $("#passwordchangestatus").addClass("error"), $("#passwordchangestatus").html(t), setTimeout("$('#passwordchangestatus').html('');", 2e3), setTimeout("$('#passwordchangestatus').removeClass('error');", 2e3), setTimeout("$('#password').attr('disabled', false);", 2200), setTimeout("$('#passwordconfirm').attr('disabled', false);", 2200), setTimeout("$('#currentpassword').attr('disabled', false);", 2200), setTimeout("$('#changepassword').attr('disabled', false);", 2200)
}

function deleteProfile() {
    if ($("#deleteprofile").attr("disabled", true), $("#confirmpassword").attr("disabled", true), $("#confirmdelete").attr("disabled", true), !$("#confirmdelete").is(":checked")) return deleteProfileError(txt_32), false;
    if (!confirm(txt_24)) return deleteProfileError(txt_32), false;
    var t = setTimeout("$('#deleteprofilestatus').html('<img src=\"'+ staticUrl +'/img/loading.gif\" alt=\"" + txt_1 + "\" />');", 250);
    $.post(siteUrl + "/scripts/ajax/deleteprofile.php", {
        confirm: "on",
        password: $("#confirmpassword").val()
    }, function(e) {
        return clearTimeout(t), "OK" != e ? (deleteProfileError(e), false) : ($("#deleteprofilestatus").html(txt_33), $("#deleteprofilestatus").addClass("success"), setTimeout("pageReload();", 2e3), true)
    })
}

function deleteProfileError(t) {
    $("#deleteprofilestatus").addClass("error"), $("#deleteprofilestatus").html(t), setTimeout("$('#deleteprofilestatus').html('');", 2e3), setTimeout("$('#deleteprofilestatus').removeClass('error');", 2e3), setTimeout("$('#deleteprofile').attr('disabled', false);", 2200), setTimeout("$('#confirmpassword').attr('disabled', false);", 2200), setTimeout("$('#confirmdelete').attr('disabled', false);", 2200)
}

function submitAsyncreply(t, e) {
    if (submitInProgress = true, "undefined" == typeof FormData) return $("form#post #async").attr("value", "false"), true;
    var s = t,
        i = $(s).find("#msg"),
        o = $(s).find("#submit"),
        a = i.val();
    e.preventDefault();
    var n = new FormData(s);
    "delete" in n && document.getElementById("file") && "" === document.getElementById("file").value && n.delete("file"), o.attr("disabled", "disabled"), i.attr("disabled", "disabled").val(txt_1), $.ajax({
        url: $(s).attr("action"),
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        data: n,
        xhr: function() {
            var t = $.ajaxSettings.xhr();
            return t.upload && t.upload.addEventListener("progress", function(t) {
                if (t.lengthComputable) {
                    var e = Math.round(t.loaded / t.total * 100);
                    100 != e ? i.val(txt_54 + " " + e + "%") : i.val(txt_55)
                }
            }, false), t
        },
        success: function(t, e, n) {
            if (0 != t.length && "OK:" != t.substr(0, 3)) return i.val(txt_51 + "\r\n" + t), void setTimeout(function() {
                o.prop("disabled", false), i.prop("disabled", false).val(a)
            }, 2e3);
            "OK:" == t.substr(0, 3) && (window.location = t.substr(3));
            var r = $(s).find('input[name="hide_poster_name"]').is(":checked");
            $(s)[0].reset(), $(s).find('input[name="hide_poster_name"]').prop("checked", r), o.prop("disabled", false), i.prop("disabled", false).val(""), forceReplyUpdate($("#thread").val()), $(s).removeClass("asyncreply"), submitInProgress = false, quickReplyActive && toggleQuickReply(quickReplyActive)
        },
        error: function(t, e, s) {
            alert(txt_51 + ": " + e + " " + s), i.val(txt_51 + "\r\n" + e + " " + s), setTimeout(function() {
                i.val(a), o.prop("disabled", false), i.prop("disabled", false)
            }, 2e3), submitInProgress = false
        }
    }).done(function() {
        setTimeout(function() {
            o.prop("disabled", false), i.prop("disabled", false)
        }, 2e3), submitInProgress = false
    })
}

function forceReplyUpdate(t) {
    clearTimeout(nextReplyUpdateTimeout), updateRetryCount = 0, nextReplyUpdateTimeout = setTimeout(function() {
        loadNewReplies(t)
    }, 1)
}

function getNewReplies(t, e) {
    var s = $(t);
    forceReplyUpdate(e), s.prop("disabled", true), setTimeout(function() {
        s.prop("disabled", false)
    }, 2e3)
}

function stopReplyUpdate() {
    clearTimeout(nextReplyUpdateTimeout), nextReplyUpdateTimeout = false
}

function loadNewReplies(t) {
    if (updateRunning) return false;
    if ($("#msg").is(":focus")) return autoupdate && (nextReplyUpdateTimeout = setTimeout(function() {
        loadNewReplies(t)
    }, 2e3)), false;
    var e = $$(t).find(".answers .answer:last");
    if (e.is("*")) var s = e.attr("id").replace("no", "");
    else var s = 1;
    if (0 == t.length || 0 == s.length) return false;
    updateRunning = true, $.get(siteUrl + "/scripts/ajax/get_new_replies.php", {
        thread: t,
        latest_reply: s
    }, function(e) {
        if (updateRunning = false, e.html) updateRetryCount = 0;
        else if ((updateRetryCount += 1) > 30) return void stopReplyUpdate();
        if (autoupdate && (nextReplyUpdateTimeout = setTimeout(function() {
                loadNewReplies(t)
            }, 2e3 * (updateRetryCount + 1))), undefined !== e.unreadCount && undefined !== e.html && 0 != e.unreadCount.length && 0 != e.html.length) {
            unreadCount += e.unreadCount, document.hasFocus() ? unreadCount = 0 : document.title = "(" + unreadCount + ") " + documentTitle;
            var i = $("form#post input, form#post textarea").is(":focus"),
                o = $(document).height() - ($(window).scrollTop() + window.innerHeight);
            $$(t).find(".answers").append(e.html.replace('class="answer', 'class="answer addlinks')), s = $(".answer:last-of-type").attr("id").replace("no", ""), updateQuotes(), $(".answer.addlinks").each(function() {
                $(this).children(".post").each(function() {
                    $(this).clickableLinks()
                }), $(this).removeClass("addlinks")
            }), i && $(window).scrollTop($(document).height() - window.innerHeight - o)
        }
    }).fail(function() {
        updateRunning = false, stopReplyUpdate()
    })
}

function switch_preferences_tab(t, e) {
    undefined === e && (e = false), $("#right.preferences #tabchooser li").removeClass("cur"), $("#right.preferences #tabchooser li[data-tabid='" + t + "']").addClass("cur"), $("#right.preferences div.tab").hide(), $("#right.preferences div.tab#" + t).show(), e && history.pushState({
        id: Date.now()
    }, "", window.location.href.split("?")[0] + "?" + t)
}

function add_this(t) {
    if (undefined !== t) {
        var e = $$$(t).find(".upvote_count");
        1 != e.data("this") && (e.data("this", 1), e.data("count", e.data("count") + 1), e.html("+" + e.data("count")), $.post(siteUrl + "/scripts/ajax/addthis.php", {
            post_id: t
        }, function(t) {
            if (0 == t.length) return true;
            alert(t), e.data("count", e.data("count") - 1), e.html("+" + e.data("count"))
        }).fail(function() {
            e.data("count", e.data("count") - 1), e.html("+" + e.data("count"))
        }))
    }
}

function gibe_gold(t) {
    closeDialog(".dialog");
    var e = '<div class="dialog"><h3>' + messages.donateGoldTitle + "</h3><p>" + messages.donateGoldTextCode + "</p><p>" + messages.donateGoldSelectedPost + ': <span class="reflink" data-msgid="' + t + '">&gt;&gt;' + t + '</span><br><br></p><div id="unused_keys_donate"><img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '"></div><br><br><button onclick="gibe_gold_terms()">' + messages.donateGoldTermsTitle + '</button> <button onclick="closeDialog(\'.dialog\')" class="close">' + txt_20 + "</button></div>";
    $("body").append(e), $.get(siteUrl + "/scripts/ajax/get_unused_gold_keys.php", function(e) {
        var s = JSON.parse(e);
        if (0 == s.length) $("#unused_keys_donate").html("<p>" + messages.donateGoldNoKeys + '<br><br><a href="/kultatili">' + messages.donateGoldGoPurchase + "</a></p>");
        else {
            var i = '<table class="donategold" style="width:100%">';
            $.each(s, function(e, s) {
                i += "<td><td>" + e + "</td><td><button onclick=\"donate_gold_key('" + e + "', " + t + ')">' + messages.donateGoldButton + "</button></td></tr>"
            }), i += "</table>", $("#unused_keys_donate").html(i)
        }
    })
}

function gibe_gold_terms() {
    closeDialog("#donateterms"), $("body").append('<div class="dialog" id="donateterms"><h3>' + messages.donateGoldTitle + '</h3><div class="data"><p>' + messages.donateGoldTermsTitle + "</p><p>" + messages.donateGoldTermsText + '</p></div><button onclick="closeDialog(\'#donateterms\')" class="close">' + txt_20 + "</button></div>")
}

function donate_gold_key(t, e) {
    undefined !== t && undefined !== e || alert(txt_51), $.post(siteUrl + "/scripts/ajax/donate_gold_key.php", {
        key: t,
        post_id: e
    }, function(t) {
        0 != t.length ? alert(t) : (closeDialog(".dialog"), alert(messages.donateGoldSuccess))
    }).fail(function() {
        closeDialog(".dialog"), alert(txt_51)
    })
}

function get_notifications() {
    $("#notifications").is("*") || ($("body").append('<div class="dialog" id="notifications"><h3>' + txt_43 + '</h3><div class="data">' + txt_1 + '</div><button onclick="closeDialog(\'#notifications\')" class="close">' + txt_20 + '</button><button onclick="mark_notifications_as_read()">' + txt_44 + "</button></div>"), $.get(siteUrl + "/scripts/notifications/get.php", function(t) {
        $("#notifications .data").html(t)
    }))
}

function mark_notifications_as_read() {
    $("#notifications").is("*") && $.get(siteUrl + "/scripts/notifications/markasread.php", function(t) {
        closeDialog("#notifications"), $(".notifications").css("font-weight", "").children(".notification_count").remove(), $(".notification_count").remove()
    })
}

function toggle_menu() {
    $("body").toggleClass("menu_opened")
}

function forceBump(t) {
    if (!confirm(messages.confirmForceBump)) return false;
    $.post(siteUrl + "/scripts/ajax/forcebump.php", {
        id: t
    }, function(t) {
        0 != t.length ? alert(t) : ($(".forcebump").attr("disabled", "disabled"), $(".forcebump").html(txt_7))
    })
}

function superSage(t) {
    if (!confirm(messages.confirmSupersage)) return false;
    $.post(siteUrl + "/scripts/ajax/supersage.php", {
        id: t
    }, function(t) {
        0 != t.length ? alert(t) : ($(".supersage").attr("disabled", "disabled"), $(".supersage").html(txt_8))
    })
}

function reviveThread(t) {
    if (!confirm(messages.confirmRevive)) return false;
    $.post(siteUrl + "/scripts/ajax/revivethread.php", {
        id: t
    }, function(t) {
        0 != t.length ? alert(t) : ($(".revivethread").attr("disabled", "disabled"), $(".revivethread").html(txt_16))
    })
}

function toggleQuickReply(t) {
    quickReplyActive && quickReplyActive != t && toggleQuickReply(quickReplyActive), quickReplyActive ? ($("form#post").appendTo($("#postform")), $("#thread").attr("value", 0), $$(t).find(".quickreply").html(txt_17), $('label[for="subject"]').show(), $("#subject").show(), quickReplyActive = false) : ($("form#post").appendTo($$(t)), $("#thread").attr("value", t), $$(t).find(".quickreply").html(txt_20), $("#display_postform button").click(), $('label[for="subject"]').hide(), $("#subject").hide(), $("#msg").focus(), quickReplyActive = t)
}

function addBbCode(t) {
    $("#msg").insertAtCaret("[" + t + "]", "[/" + t + "]")
}

function changeDisplayStyle(t) {
    $.post(siteUrl + "/scripts/ajax/savedisplaystyle.php", {
        style_id: t
    }, function(t) {
        0 != t.length ? alert(t) : window.location = window.location.href.replace(/\-[0-9]+\//g, "/")
    })
}

function $$(t) {
    return $("#thread_" + t)
}

function $$$(t) {
    return $("#no" + t)
}

function decodeEntities(t) {
    var e = document.createElement("textarea");
    return e.innerHTML = t, e.value
}

$.ajaxSetup({
    cache: false,
    headers: {
        "X-CSRFToken": csrf_token
    }
});

var hiddenPosts, lastQuoted, threadId, reflink_active = false,
    expandInProgress = false,
    submitInProgress = false,
    updateRunning = false,
    updateRetryCount = 0,
    unreadCount = 0,
    nextReplyUpdateTimeout = false,
    documentTitle = document.title,
    window_height = $(window).height();

Array.prototype.last || (Array.prototype.last = function() {
        return this[this.length - 1]
    }),

    function(t, e, s) {
        if ("standalone" in e && e.standalone) {
            var i, o = t.location,
                a = /^(a|html)$/i;
            t.addEventListener("click", function(t) {
                for (i = t.target; !a.test(i.nodeName);) i = i.parentNode;
                "href" in i && (chref = i.href).replace(o.href, "").indexOf("#") && (!/^[a-z\+\.\-]+:/i.test(chref) || 0 === chref.indexOf(o.protocol + "//" + o.host)) && (t.preventDefault(), o.href = i.href)
            }, false)
        }
    }(document, window.navigator, "standalone"), 

    "https:" == document.location.protocol && (siteUrl = siteUrl.replace("http:", "https:")), 

    $.fn.extend({
        clickableLinks: function() {
            if (0 != this.length) {
                var t = this.html();
                if (t.indexOf("http://") != -1 || t.indexOf("https://") != -1) {
                    var e = t.replace(/(^|\s|\n|>)(https?:\/\/[^\s<]+)/gi, function(t, e, s) {
                        return e + '<a href="' + s + '" target="_blank" rel="noopener noreferrer nofollow">' + s + "</a>"
                    });
                    this.html(e)
                }
            }
        },

        insertAtCaret: function(t, e, s) {
            return undefined === e && (e = ""), undefined === s && (s = ""), this.each(function() {
                if (document.selection) {
                    var i = document.selection.createRange();
                    i.text = t + i.text + e, s.metaKey || s.ctrlKey || this.focus()
                } else if (this.selectionStart || "0" == this.selectionStart) {
                    var o = this.value.substr(this.selectionStart, this.selectionEnd - this.selectionStart),
                        a = this.selectionStart,
                        n = this.selectionEnd,
                        r = this.scrollTop;
                    this.value = this.value.substring(0, a) + t + o + e + this.value.substring(n, this.value.length), s.metaKey || s.ctrlKey || this.focus(), 0 == o.length ? (this.selectionStart = a + t.length, this.selectionEnd = a + t.length) : (this.selectionStart = this.value.length, this.selectionEnd = this.value.length), this.scrollTop = r
                } else this.value += t + e, s.metaKey || s.ctrlKey || this.focus()
            })
        },

        drags: function(t) {
            return this.each(function() {
                var t, e, s = $(this);
                s.on({
                    mousedown: function(i) {
                        i.preventDefault();
                        var o = s.offset();
                        t = i.pageX - o.left, e = i.pageY - o.top, $(document).on("mousemove.drag", function(i) {
                            s.offset({
                                top: i.pageY - e,
                                left: i.pageX - t
                            })
                        })
                    },

                    mouseup: function(t) {
                        "followedthreads" == s.attr("id") && ($("#followedthreads").css("top").replace("px", "") < 0 && $("#followedthreads").css("top", 0), $("#followedthreads").css("left").replace("px", "") < 0 && $("#followedthreads").css("left", 0), localStorage.ftbox_top = $("#followedthreads").css("top"), localStorage.ftbox_left = $("#followedthreads").css("left")), $(document).off("mousemove.drag")
                    }
                })
            })
        }
    }), 

    $(document).ready(function() {
        updateQuoteSuffixes(), 

        $("form#post").attr("onsubmit", "submitAsyncreply(this, event)"), 

        $("form#post #async").attr("value", "true"), 

        $(window).on("beforeunload", function(t) {
            if (!submitInProgress && $("#msg").is("*") && 0 != $("#msg").val().length) return messages.confirmPageLeave
        }), 

        $(".post").each(function() {
            $(this).clickableLinks()
        }), 

        $(document.body).on("click", ".messageoptions_mobile", function() {
            $(this).closest(".answer, .op_post").find(".messageoptions").toggle()
        }), 

        $("#followedthreads").drags(), 

        $(document.body).on("click", "span.postedbyop", function() {
            $(".highlighted").removeClass("highlighted"), 

            $(this).parents("div.thread").find("div.answer").each(function() {
                $(this).find("span.postedbyop").length > 0 && $(this).addClass("highlighted")
            })
        }), 

        $(document.body).on("click", ".replies span", function() {
            $(".highlighted").removeClass("highlighted");

            var t = $(this).parent().children("a").map(function() {
                return "no" + $(this).data("msgid")
            });

            $("div.answer").each(function() {
                $.inArray($(this).attr("id"), t) >= 0 && $(this).addClass("highlighted")
            })
        }), 

        $(document.body).on("click", "span.postuid.ip", function() {
            var t = $(this).text();
            $(".highlighted").removeClass("highlighted"), 

            $(".answer").each(function() {
                $(this).find(".postuid.ip").text() == t && $(this).addClass("highlighted")
            })
        }), 

        $(document.body).on("click", "span.postuid.id", function() {
            var t = $(this).text();
            $(".highlighted").removeClass("highlighted"), 

            $(".answer").each(function() {
                $(this).find(".postuid.id").text() == t && $(this).addClass("highlighted")
            })
        }), 

        $(".threads.style-box").on("click", ".expandlink, .playembedlink", function(t) {
            t.preventDefault();
            var e = $(this).closest(".thread").find(".postsubject").attr("href");
            if (!e) return true;
            window.location = e
        }), 

        $(".threads.style-replies").on("click", ".expandlink", function(t) {
            t.preventDefault(), expandImage($(this), t)
        }), 

        $(".threads.style-replies").on("click", ".playembedlink", function(t) {
            t.preventDefault(), 
            $(this).closest(".post").parent().find(".untruncatelink").click(), 
            $(this).closest(".filecontainer").removeClass("thumbnail"), 
            $(".playembedlink").show(), $(".embedcontainer").html(""), 

            $(this).hide();

            var e = $(this).data("fileid"),
                s = setTimeout(function() {
                    $$$(e).find(".embedcontainer").show(), 
                    $$$(e).find(".embedcontainer").html('<img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '" />')
                }, 500);

            return $.get(siteUrl + "/scripts/ajax/embedhtml.php", {
                id: $(this).data("embedcode"),
                type: $(this).data("embedsource")
            }, function(t) {
                clearTimeout(s), 
                $$$(e).find(".embedcontainer").html(t + '<button class="embed-hidelink" onclick="removeEmbed()">' + txt_15 + "</button>")
            }), false
        }), 

        $(document.body).on("click", ".postnumber", function(t) {
            var e = $(this).attr("href").substr(0, $(this).attr("href").indexOf("#")),
                s = new RegExp(e, "i");

            if (document.location.href.match(s) || quickReplyActive) 
                return lastQuoted = $(this).data("quoteid"), 
                    $("#msg").insertAtCaret(">>" + lastQuoted + "\r\n", "", t), 
                    $("#qrinfo").html('<button onclick="highlightPost(' + lastQuoted + '); return false;">' + txt_28 + "</button>"), 
                    false;

            document.location = $(this).attr("href")
        }), 

        hiddenPosts = JSON.parse(localStorage.getItem("hiddenPosts")), 

        if (hiddenPosts) {
            hiddenPosts.forEach(function(t) {
                hidePost(t, false)
            }); 
        } else {
            hiddenPosts = [];
        }

        $(".spoiler").hover(function() {}), 

        $(document.body).on("click", ".reflink", function(t) {
            $$$(e).is(":visible") && ($(this).closest("div").hasClass("notification") || (t.preventDefault(), highlightPost(e)))
        }), 

        $(document.body).on("mouseenter", ".reflink", function(t) {
            setTimeout("reflink_active = true;", 50);
            var e = "tooltip-" + $(this).data("msgid"),
                s = $("#" + e);

            if (s.is("*")) {
                positionTooltip(s, t), 
                s.show();
            } else {
                $("body").append('<div id="' + e + '" class="tooltip"><img src="' + staticUrl + '/img/loading.gif" alt="' + txt_1 + '" /></div>'), 
                s = $("#" + e);

                var i = $$$($(this).data("msgid"));
                if (i.is("*")) {
                    s.html(i.html().replace("autoplay=1", "").replace("autoplay", "")), 
                    positionTooltip(s, t);
                } else {
                    $.get(
                        siteUrl + "/scripts/ajax/message.php?id=" + $(this).data("msgid"), 
                        function(e) {
                            s.html(e), 
                            positionTooltip(s, t)
                    });
                }

                s.show();
            }
        }), 

        $(document.body).on("mousemove", ".reflink", function(t) {
            positionTooltip($("#tooltip-" + $(this).data("msgid")), t)
        }), 

        $(document.body).on("mouseleave", ".reflink", function() {
            $(".tooltip").remove(), reflink_active = false
        })
    }), 
    
    $(window).on("load", function() {
        if ($("#banner_ad_bottom").is(":visible") || ($('<p class="infobar" id="blocking-notification"><b>' + txt_40 + "</b><br />" + txt_41 + "<br /><br />" + txt_42 + "</p>").insertAfter("#post"), $.post(siteUrl + "/scripts/ajax/ping.php")), "#no" == window.location.hash.substr(0, 3)) {
            highlightPost(window.location.hash.substr(3).replace(/\D/g, ""))
        }
    }).on("focus", function() {
        unreadCount = 0, document.title != documentTitle && (document.title = documentTitle)
    }).on("scroll", function() {
        if (undefined === (threadId = $("body").data("threadid"))) return null;
        var t = $(document).scrollTop() + window_height,
            e = $(".threads .thread"),
            s = e.offset().top + e.outerHeight(true) - 100;
        autoupdate && !nextReplyUpdateTimeout && t > s ? forceReplyUpdate(threadId) : nextReplyUpdateTimeout && t < s && stopReplyUpdate()
    }).on("resize", function() {
        window_height = $(window).height()
    }), $(document).keydown(function(t) {
        return 116 != t.which || t.ctrlKey ? 82 == t.which && t.ctrlKey && !t.shiftKey ? (pageReload(), false) : 77 == t.which && t.ctrlKey && t.shiftKey ? (window.location = siteUrl + "/mod/", false) : undefined : (pageReload(), false)
    });
var expandingThread = false;
$("body").on("click", "#left", function(t) {
    return (undefined === t.offsetX ? t.originalEvent.layerX : t.offsetX) <= $(this).innerWidth() || (!$("body").hasClass("menu_opened") || (toggle_menu(), false))
}), $(".messageoptions_mobile").on("click", function() {
    $(".messageoptions a").click(function() {
        $(this).parent().hide()
    })
});
var quickReplyActive = false;
if ($("#right.preferences").is("*")) {
    var currentTab = window.location.search.substring(1).split("&")[0];
    $("#right.preferences #tabchooser li.tab").on("click", function() {
        switch_preferences_tab($(this).data("tabid"), true)
    }), 0 == $("#" + currentTab).length ? switch_preferences_tab($("#tabchooser li.tab").first().data("tabid"), false) : switch_preferences_tab(currentTab, false)
}
undefined != localStorage.ftbox_left && $("#followedthreads").css("left", localStorage.ftbox_left), 
undefined != localStorage.ftbox_top && $("#followedthreads").css("top", localStorage.ftbox_top), 
undefined != localStorage.ftbox_pin && ($("#followedthreads").css("position", "fixed"), 
    $("#followedpin").removeClass("unpinned").addClass("pinned")), 

$("#right.purchaseform button.choose").on("click", function(t) {
    t.preventDefault(), 
    $("#quantity-input").hide(), 
    $("button.choose").show(), 
    $("#right.purchaseform .product").removeClass("selected"), 
    $("#product_id").val($(this).parent(".product").data("product_id")), 
    $(this).parent(".product").addClass("selected"), 
    $("#quantity-input").appendTo("#right.purchaseform .product.selected"), 
    $("#quantity-input").css("display", "inline-block"), 
    $(this).hide()
}), 

undefined !== navigator.share && document.querySelectorAll(".op_post .messageoptions").forEach(function(t) {
    var e = document.createElement("a");
    e.classList.add("icon-share2"), 
    e.setAttribute("title", "Share"), 
    e.style.cursor = "pointer", 

    e.onclick = function(t) {
        var e = t.target.closest(".op_post"),
            s = e.querySelector(".postsubject"),
            i = s.getAttribute("href"),
            o = decodeEntities(s.querySelector(".subject").innerHTML);
        navigator.share({
            title: o,
            text: o,
            url: i
        }), "function" == typeof window.ga && ga("send", "event", "Share", e.dataset.board + "/" + e.dataset.msgid)
    }, t.parentNode.insertBefore(e, t)
});