"use strict";
! function (e) {
    e.fn.CreateFileUploadWidget = function (r) {
        var a = {
            SiteURL: _spPageContextInfo.webAbsoluteUrl,
            UploadLibrary: "Upload Library",
            DivID: "#fileuploaddiv",
            UploadBtn: "default",
            MaxFileSize: 52428800,
            isFileSizeValidation: !1,
            isSpecailCharacterNotAllowed: !0,
            isreportGenerate: !1
        },
            t = e.extend(a, r),
            l = t.isSpecailCharacterNotAllowed,
            i = t.isFileSizeValidation,
            o = t.isreportGenerate,
            n = t.MaxFileSize,
            s = [],
            p = [],
            d = [],
            c = "error_" + parseInt(1e6 * Math.random()),
            f = e("<div/>", {
                class: "row"
            }).append(e("<div/>", {
                id: c,
                style: "color:red;"
            })),
            v = e("<div/>", {
                class: "tabbable tabs-left"
            }),
            u = e("<div/>", {
                class: "inline-form-control"
            });
        v.append(u);
        var m = function (e, r) {
            for (var a = !1, t = 0; t < r.length; t++)
                if (e.filename == r[t].filename && e.filesize == r[t].filesize && e.filetype == r[t].filetype && 1 == e.IsValid && 0 == e.IsUploaded) {
                    a = !0;
                    break
                }
            return a
        },
            g = function (r, a) {
                var t = e("<div/>", {
                    class: "inline-form-control",
                    id: "div_" + a
                }),
                    l = e("<span/>", {
                        class: "inline-form-control",
                        id: "span_" + a,
                        style: "font-size: 13px;font-family: cursive;font-style: normal;",
                        text: r
                    });
                t.append(l);
                var i = e("<a/>", {
                    class: "inline-form-control",
                    id: "rem_" + a,
                    href: "javascript:void(0)",
                    style: "margin-left:2%;"
                });
                i.html("X"), i.on("click", h), t.append(i);
                var o = e("<div/>", {
                    id: "div_prg_" + a,
                    class: "progress",
                    style: "display:block;text-align: left; position:relative; border:1px solid #ddd;padding:1px; border-radius:3px;width:23%;height:40px;"
                });
                t.append(o);
                var n = e("<span/>", {
                    id: "prg_text" + a,
                    text: "0% completed",
                    style: "display:block"
                });
                o.append(n);
                var s = e("<div/>", {
                    id: "prg_" + a,
                    class: "progress-bar",
                    style: "height:18px;display:block",
                    role: "progressbar"
                });
                o.append(s), u.append(t)
            },
            h = function () {
                var r = e(this).attr("id").split("_")[1],
                    a = _(s, r);
                a.IsValid = !1;
                var t = p.map(function (e) {
                    return e.name
                }).indexOf(a.name);
                ~t && p.splice(t, 1), ~(t = s.map(function (e) {
                    return e.ID
                }).indexOf(parseInt(r))) && s.splice(t, 1), e(this).parent().remove(), D.val(""), e("#" + c).text("")
            },
            y = function (e, r, a) {
                var t = document.createElement("a"),
                    l = new Blob([e], {
                        type: a
                    });
                t.href = URL.createObjectURL(l), t.download = r, t.click()
            },
            b = function (e) {
                var r = e.name;
                return !new RegExp(/[~#&%\*\\;,/{}|\\":<>\?]/).test(r)
            },
            x = function () {
                try {
                    if (0 == s.length) {
                        var r = {
                            errorName: "Please select a file to upload",
                            filename: "No file chosen",
                            errorID: parseInt(1e6 * Math.random())
                        };
                        throw d.push(r), d
                    }
                    for (var a = 0; a < s.length; a++) void 0, void 0, void 0, void 0, void 0, i = s[l = a].filename, n = s[l].bufferArray, p = s[l].IsValid, f = s[l].ID, v = s[l].IsUploaded, p && (v || I(t.UploadLibrary, i, n, f))
                } catch (r) {
                    e("#" + c).text(JSON.stringify(r)), d = [], o && y(JSON.stringify(r), "error.txt", "text/plain")
                }
                var l, i, n, p, f, v
            },
            I = function (r, a, t, l) {
                try {
                    var i = {
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + r + "')/RootFolder/Files/add(url='" + a + "',overwrite='true')?@TargetLibrary='" + r + "'&@TargetFileName='" + a + "'",
                        type: "POST",
                        data: t,
                        processData: !1,
                        headers: {
                            accept: "application/json;odata=verbose",
                            "X-RequestDigest": e("#__REQUESTDIGEST").val()
                        },
                        success: function (r) {
                            var a = e("#span_" + l).text();
                            console.log("upload complete." + a);
                            var t = e("<a/>", {
                                id: "anc_" + l,
                                class: "inline-form-control",
                                href: r.d.ServerRelativeUrl,
                                target: "_blank"
                            });
                            t.html(a);
                            var i = e("<a/>", {
                                id: "delanc_" + l,
                                class: "inline-form-control",
                                href: "javascript:void(0)",
                                style: "margin-left:2%;"
                            });
                            i.attr("fileURL", r.d.ServerRelativeUrl), i.html("X"), i.on("click", w), e("#span_" + l).html(""), e("#span_" + l).append(t), e("#span_" + l).append(i)
                        },
                        error: function (e) {
                            console.log("failed"), console.log(e)
                        },
                        xhr: function () {
                            var r = new window.XMLHttpRequest;
                            return r.upload.addEventListener("progress", function (r) {
                                if (r.lengthComputable) {
                                    e("#rem_" + l).remove();
                                    var a = r.loaded / r.total;
                                    if (a = parseInt(100 * a), e("#prg_" + l).width(a + "%"), e("#prg_" + l).css("background-color", "green"), e("#prg_text" + l).html(a + "% complete"), 100 === a) e("#prg_text" + l).html(a + "% completed"), e("#prg_" + l).width(a + "%"), _(s, l).IsUploaded = !0
                                }
                            }, !1), r
                        },
                        complete: function () {
                            D.val("")
                        }
                    };
                    e.ajax(i)
                } catch (e) {
                    console.log(e)
                }
            },
            _ = function (e, r) {
                for (var a, t = 0; t < e.length; t++) e[t].ID == r && (a = e[t]);
                return a
            },
            w = function () {
                var r = e(this).attr("fileURL"),
                    a = e(this).attr("id").split("_")[1];
                console.log(r);
                var l = r.split("/")[2];
                if (confirm("Are you sure to delete " + l + " from server?")) {
                    var i = {
                        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/getfilebyserverrelativeurl('" + r + "')/ListItemAllFields",
                        type: "GET",
                        headers: {
                            accept: "application/json;odata=verbose"
                        },
                        success: function (r) {
                            console.log(r);
                            var i = r.d.Id,
                                o = {
                                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + t.UploadLibrary + "')/items(" + i + ")",
                                    type: "DELETE",
                                    headers: {
                                        accept: "application/json;odata=verbose",
                                        "X-RequestDigest": e("#__REQUESTDIGEST").val(),
                                        "IF-MATCH": "*"
                                    },
                                    success: function (r) {
                                        console.log("file Deleted from server"), alert("file Deleted from server"), e("#div_" + a).remove(), _(s, a).IsUploaded = !1, g(l, a)
                                    },
                                    error: function (e, r, a) {
                                        console.log("error"), console.log(a), console.log(r), console.log(e)
                                    }
                                };
                            jQuery.ajax(o)
                        },
                        error: function (e) {
                            console.log(e)
                        }
                    };
                    jQuery.ajax(i)
                }
            },
            U = function (e) {
                for (var r = "", a = new Uint8Array(e), t = a.byteLength, l = 0; l < t; l++) r += String.fromCharCode(a[l]);
                return window.btoa(r)
            },
            D = e("<input/>", {
                type: "file",
                class: "inline-form-control",
                multiple: "multiple"
            });
        D.on("change", function (r) {
            try {
                var a = r.target.files;
                e("#" + c).text("");
                for (var t = 0; t < a.length; t++) {
                    var f = {
                        filename: a[t].name,
                        filsesize: a[t].size,
                        filetype: a[t].type,
                        IsValid: !0,
                        IsUploaded: !1
                    };
                    if (m(f, p)) {
                        var v = {
                            errorName: "File with same name and type is not allowed",
                            filename: f.filename,
                            errorID: parseInt(1e6 * Math.random())
                        };
                        d.push(v)
                    } else p.push(f)
                }
                for (var u = 0; u < a.length; u++) ! function (e) {
                    var r = a[u],
                        t = r.name.split(".")[1],
                        o = r.size;
                    if (i && r.size > n) {
                        var p = {
                            errorName: "Max file limit exceeded . Max file size allowed is 50MB",
                            filename: r.name,
                            errorID: parseInt(1e6 * Math.random())
                        };
                        d.push(p)
                    }
                    if (l && !b(r) && (p = {
                        errorName: "Not a valid character in a filename",
                        filename: r.name,
                        errorID: parseInt(1e6 * Math.random())
                    }, d.push(p)), d.length > 0) throw d;
                    if (r) {
                        var c = new FileReader;
                        c.onloadend = function (e) {
                            var a = e.target.result,
                                l = U(a),
                                i = parseInt(1e6 * Math.random()),
                                n = {
                                    filename: r.name,
                                    filetype: t,
                                    base64str: l,
                                    IsValid: !0,
                                    bufferArray: a,
                                    ID: i,
                                    IsUploaded: !1,
                                    filesize: o
                                };
                            s.push(n), g(r.name, i), D.val("")
                        }, c.readAsArrayBuffer(r)
                    }
                }()
            } catch (r) {
                console.log(r), e("#" + c).text(JSON.stringify(r)), D.val(""), d = [], o && y(JSON.stringify(r), "error.txt", "text/plain")
            }
        }), v.append(D), v.append("<br/>");
        var S = e("<input/>", {
            type: "button",
            class: "btn btn-primary",
            value: "Upload File"
        });
        S.on("click", x), "default" == t.UploadBtn ? v.append(S) : e(t.UploadBtn).on("click", x), f.append(v), e(t.DivID).append(f)
    }
}(jQuery);
$(document).ready(function () {
    var newSetting = {
        SiteURL: _spPageContextInfo.webAbsoluteUrl,
        UploadLibrary: "Upload Library",
        DivID: "#fileuploaddiv",
        MaxFileSize: 52428800,
        UploadBtn: "#Upload",
        isFileSizeValidation: true,
        isSpecailCharacterNotAllowed: true,
        isreportGenerate: false
    }
    $.fn.CreateFileUploadWidget(newSetting);
});
