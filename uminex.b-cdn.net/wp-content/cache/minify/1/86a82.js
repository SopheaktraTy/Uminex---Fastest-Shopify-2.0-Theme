!(function (r) {
  var o = (this.SelectBox = function (e, t) {
    if (e instanceof jQuery) {
      if (!(0 < e.length)) return;
      e = e[0];
    }
    return (
      (this.typeTimer = null),
      (this.typeSearch = ""),
      (this.isMac = navigator.platform.match(/mac/i)),
      (t = "object" == typeof t ? t : {}),
      (this.selectElement = e),
      !(
        !t.mobile &&
        navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i)
      ) &&
        "select" === e.tagName.toLowerCase() &&
        void this.init(t)
    );
  });
  (o.prototype.version = "1.2.0"),
    (o.prototype.init = function (t) {
      var e = r(this.selectElement);
      if (e.data("selectBox-control")) return !1;
      var s,
        o,
        a = r('<a class="selectBox" />'),
        n = e.attr("multiple") || 1 < parseInt(e.attr("size")),
        l = t || {},
        i = parseInt(e.prop("tabindex")) || 0,
        c = this;
      a
        .width(e.outerWidth())
        .addClass(e.attr("class"))
        .attr("title", e.attr("title") || "")
        .attr("tabindex", i)
        .css("display", "inline-block")
        .bind("focus.selectBox", function () {
          this !== document.activeElement &&
            document.body !== document.activeElement &&
            r(document.activeElement).blur(),
            a.hasClass("selectBox-active") ||
              (a.addClass("selectBox-active"), e.trigger("focus"));
        })
        .bind("blur.selectBox", function () {
          a.hasClass("selectBox-active") &&
            (a.removeClass("selectBox-active"), e.trigger("blur"));
        }),
        r(window).data("selectBox-bindings") ||
          r(window)
            .data("selectBox-bindings", !0)
            .bind("scroll.selectBox", this.hideMenus)
            .bind("resize.selectBox", this.hideMenus),
        e.attr("disabled") && a.addClass("selectBox-disabled"),
        e.bind("click.selectBox", function (e) {
          a.focus(), e.preventDefault();
        }),
        n
          ? ((t = this.getOptions("inline")),
            a
              .append(t)
              .data("selectBox-options", t)
              .addClass("selectBox-inline selectBox-menuShowing")
              .bind("keydown.selectBox", function (e) {
                c.handleKeyDown(e);
              })
              .bind("keypress.selectBox", function (e) {
                c.handleKeyPress(e);
              })
              .bind("mousedown.selectBox", function (e) {
                1 === e.which &&
                  (r(e.target).is("A.selectBox-inline") && e.preventDefault(),
                  a.hasClass("selectBox-focus") || a.focus());
              })
              .insertAfter(e),
            e[0].style.height ||
              ((o = e.attr("size") ? parseInt(e.attr("size")) : 5),
              (n = a
                .clone()
                .removeAttr("id")
                .css({ position: "absolute", top: "-9999em" })
                .show()
                .appendTo("body"))
                .find(".selectBox-options")
                .html("<li><a> </a></li>"),
              (s = parseInt(
                n
                  .find(".selectBox-options A:first")
                  .html("&nbsp;")
                  .outerHeight()
              )),
              n.remove(),
              a.height(s * o)))
          : ((s = r('<span class="selectBox-label" />')),
            (o = r('<span class="selectBox-arrow" />')),
            s.attr("class", this.getLabelClass()).text(this.getLabelText()),
            (t = this.getOptions("dropdown")).appendTo("BODY"),
            a
              .data("selectBox-options", t)
              .addClass("selectBox-dropdown")
              .append(s)
              .append(o)
              .bind("mousedown.selectBox", function (e) {
                1 === e.which &&
                  (a.hasClass("selectBox-menuShowing")
                    ? c.hideMenus()
                    : (e.stopPropagation(),
                      t
                        .data("selectBox-down-at-x", e.screenX)
                        .data("selectBox-down-at-y", e.screenY),
                      c.showMenu()));
              })
              .bind("keydown.selectBox", function (e) {
                c.handleKeyDown(e);
              })
              .bind("keypress.selectBox", function (e) {
                c.handleKeyPress(e);
              })
              .bind("open.selectBox", function (e, t) {
                (t && !0 === t._selectBox) || c.showMenu();
              })
              .bind("close.selectBox", function (e, t) {
                (t && !0 === t._selectBox) || c.hideMenus();
              })
              .insertAfter(e),
            (o =
              a.width() - o.outerWidth() - parseInt(s.css("paddingLeft")) ||
              0 - parseInt(s.css("paddingRight")) ||
              0),
            s.width(o)),
        this.disableSelection(a),
        e
          .addClass("selectBox")
          .data("selectBox-control", a)
          .data("selectBox-settings", l)
          .hide();
    }),
    (o.prototype.getOptions = function (e) {
      var t,
        s = r(this.selectElement),
        o = this,
        a = function (e, t) {
          return (
            e.children("OPTION, OPTGROUP").each(function () {
              var e;
              r(this).is("OPTION")
                ? 0 < r(this).length
                  ? o.generateOptions(r(this), t)
                  : t.append("<li> </li>")
                : ((e = r('<li class="selectBox-optgroup" />')).text(
                    r(this).attr("label")
                  ),
                  t.append(e),
                  (t = a(r(this), t)));
            }),
            t
          );
        };
      switch (e) {
        case "inline":
          return (
            (t = r('<ul class="selectBox-options" />')),
            (t = a(s, t))
              .find("A")
              .bind("mouseover.selectBox", function (e) {
                o.addHover(r(this).parent());
              })
              .bind("mouseout.selectBox", function (e) {
                o.removeHover(r(this).parent());
              })
              .bind("mousedown.selectBox", function (e) {
                1 === e.which &&
                  (e.preventDefault(),
                  s.selectBox("control").hasClass("selectBox-active") ||
                    s.selectBox("control").focus());
              })
              .bind("mouseup.selectBox", function (e) {
                1 === e.which &&
                  (o.hideMenus(), o.selectOption(r(this).parent(), e));
              }),
            this.disableSelection(t),
            t
          );
        case "dropdown":
          (t = r('<ul class="selectBox-dropdown-menu selectBox-options" />')),
            (t = a(s, t))
              .data("selectBox-select", s)
              .css("display", "none")
              .appendTo("BODY")
              .find("A")
              .bind("mousedown.selectBox", function (e) {
                1 === e.which &&
                  (e.preventDefault(),
                  e.screenX === t.data("selectBox-down-at-x") &&
                    e.screenY === t.data("selectBox-down-at-y") &&
                    (t
                      .removeData("selectBox-down-at-x")
                      .removeData("selectBox-down-at-y"),
                    o.hideMenus()));
              })
              .bind("mouseup.selectBox", function (e) {
                1 === e.which &&
                  ((e.screenX === t.data("selectBox-down-at-x") &&
                    e.screenY === t.data("selectBox-down-at-y")) ||
                    (t
                      .removeData("selectBox-down-at-x")
                      .removeData("selectBox-down-at-y"),
                    o.selectOption(r(this).parent()),
                    o.hideMenus()));
              })
              .bind("mouseover.selectBox", function (e) {
                o.addHover(r(this).parent());
              })
              .bind("mouseout.selectBox", function (e) {
                o.removeHover(r(this).parent());
              });
          var n = s.attr("class") || "";
          if ("" !== n)
            for (var l in (n = n.split(" ")))
              t.addClass(n[l] + "-selectBox-dropdown-menu");
          return this.disableSelection(t), t;
      }
    }),
    (o.prototype.getLabelClass = function () {
      return (
        "selectBox-label " +
        (r(this.selectElement).find("OPTION:selected").attr("class") || "")
      ).replace(/\s+$/, "");
    }),
    (o.prototype.getLabelText = function () {
      return r(this.selectElement).find("OPTION:selected").text() || " ";
    }),
    (o.prototype.setLabel = function () {
      var e = r(this.selectElement).data("selectBox-control");
      e &&
        e
          .find(".selectBox-label")
          .attr("class", this.getLabelClass())
          .text(this.getLabelText());
    }),
    (o.prototype.destroy = function () {
      var e = r(this.selectElement),
        t = e.data("selectBox-control");
      t &&
        (t.data("selectBox-options").remove(),
        t.remove(),
        e
          .removeClass("selectBox")
          .removeData("selectBox-control")
          .data("selectBox-control", null)
          .removeData("selectBox-settings")
          .data("selectBox-settings", null)
          .show());
    }),
    (o.prototype.refresh = function () {
      var e = r(this.selectElement),
        t = e.data("selectBox-control"),
        s = t.hasClass("selectBox-dropdown"),
        t = t.hasClass("selectBox-menuShowing");
      e.selectBox("options", e.html()), s && t && this.showMenu();
    }),
    (o.prototype.showMenu = function () {
      var t = this,
        e = r(this.selectElement),
        s = e.data("selectBox-control"),
        o = e.data("selectBox-settings"),
        a = s.data("selectBox-options");
      if (s.hasClass("selectBox-disabled")) return !1;
      this.hideMenus();
      var n = parseInt(s.css("borderBottomWidth")) || 0;
      if (
        (a
          .width(s.innerWidth())
          .css({
            top: s.offset().top + s.outerHeight() - n,
            left: s.offset().left,
          }),
        e.triggerHandler("beforeopen"))
      )
        return !1;
      var l = function () {
        e.triggerHandler("open", { _selectBox: !0 });
      };
      switch (o.menuTransition) {
        case "fade":
          a.fadeIn(o.menuSpeed, l);
          break;
        case "slide":
          a.slideDown(o.menuSpeed, l);
          break;
        default:
          a.show(o.menuSpeed, l);
      }
      o.menuSpeed || l();
      n = a.find(".selectBox-selected:first");
      this.keepOptionInView(n, !0),
        this.addHover(n),
        s.addClass("selectBox-menuShowing"),
        r(document).bind("mousedown.selectBox", function (e) {
          1 === e.which &&
            (r(e.target).parents().andSelf().hasClass("selectBox-options") ||
              t.hideMenus());
        });
    }),
    (o.prototype.hideMenus = function () {
      0 !== r(".selectBox-dropdown-menu:visible").length &&
        (r(document).unbind("mousedown.selectBox"),
        r(".selectBox-dropdown-menu").each(function () {
          var e = r(this),
            t = e.data("selectBox-select"),
            s = t.data("selectBox-control"),
            o = t.data("selectBox-settings");
          if (t.triggerHandler("beforeclose")) return !1;
          var a = function () {
            t.triggerHandler("close", { _selectBox: !0 });
          };
          if (o) {
            switch (o.menuTransition) {
              case "fade":
                e.fadeOut(o.menuSpeed, a);
                break;
              case "slide":
                e.slideUp(o.menuSpeed, a);
                break;
              default:
                e.hide(o.menuSpeed, a);
            }
            o.menuSpeed || a(), s.removeClass("selectBox-menuShowing");
          } else r(this).hide(), r(this).triggerHandler("close", { _selectBox: !0 }), r(this).removeClass("selectBox-menuShowing");
        }));
    }),
    (o.prototype.selectOption = function (e, t) {
      var s = r(this.selectElement);
      e = r(e);
      var o,
        a = s.data("selectBox-control");
      s.data("selectBox-settings");
      if (a.hasClass("selectBox-disabled")) return !1;
      if (0 === e.length || e.hasClass("selectBox-disabled")) return !1;
      s.attr("multiple")
        ? t.shiftKey && a.data("selectBox-last-selected")
          ? (e.toggleClass("selectBox-selected"),
            (o = (o =
              e.index() > a.data("selectBox-last-selected").index()
                ? e
                    .siblings()
                    .slice(a.data("selectBox-last-selected").index(), e.index())
                : e
                    .siblings()
                    .slice(
                      e.index(),
                      a.data("selectBox-last-selected").index()
                    )).not(".selectBox-optgroup, .selectBox-disabled")),
            e.hasClass("selectBox-selected")
              ? o.addClass("selectBox-selected")
              : o.removeClass("selectBox-selected"))
          : (this.isMac && t.metaKey) || (!this.isMac && t.ctrlKey)
          ? e.toggleClass("selectBox-selected")
          : (e.siblings().removeClass("selectBox-selected"),
            e.addClass("selectBox-selected"))
        : (e.siblings().removeClass("selectBox-selected"),
          e.addClass("selectBox-selected")),
        a.hasClass("selectBox-dropdown") &&
          a.find(".selectBox-label").text(e.text());
      var n = 0,
        l = [];
      return (
        s.attr("multiple")
          ? a.find(".selectBox-selected A").each(function () {
              l[n++] = r(this).attr("rel");
            })
          : (l = e.find("A").attr("rel")),
        a.data("selectBox-last-selected", e),
        s.val() !== l && (s.val(l), this.setLabel(), s.trigger("change")),
        !0
      );
    }),
    (o.prototype.addHover = function (e) {
      (e = r(e)),
        r(this.selectElement)
          .data("selectBox-control")
          .data("selectBox-options")
          .find(".selectBox-hover")
          .removeClass("selectBox-hover"),
        e.addClass("selectBox-hover");
    }),
    (o.prototype.getSelectElement = function () {
      return this.selectElement;
    }),
    (o.prototype.removeHover = function (e) {
      (e = r(e)),
        r(this.selectElement)
          .data("selectBox-control")
          .data("selectBox-options")
          .find(".selectBox-hover")
          .removeClass("selectBox-hover");
    }),
    (o.prototype.keepOptionInView = function (e, t) {
      var s, o, a;
      e &&
        0 !== e.length &&
        ((a = (o = r(this.selectElement).data("selectBox-control")).data(
          "selectBox-options"
        )),
        (s = o.hasClass("selectBox-dropdown") ? a : a.parent()),
        (o = parseInt(e.offset().top - s.position().top)),
        (a = parseInt(o + e.outerHeight())),
        t
          ? s.scrollTop(
              e.offset().top - s.offset().top + s.scrollTop() - s.height() / 2
            )
          : (o < 0 &&
              s.scrollTop(e.offset().top - s.offset().top + s.scrollTop()),
            a > s.height() &&
              s.scrollTop(
                e.offset().top +
                  e.outerHeight() -
                  s.offset().top +
                  s.scrollTop() -
                  s.height()
              )));
    }),
    (o.prototype.handleKeyDown = function (e) {
      var t = r(this.selectElement),
        s = t.data("selectBox-control"),
        o = s.data("selectBox-options"),
        a = t.data("selectBox-settings"),
        n = 0,
        l = 0;
      if (!s.hasClass("selectBox-disabled"))
        switch (e.keyCode) {
          case 8:
            e.preventDefault(), (this.typeSearch = "");
            break;
          case 9:
          case 27:
            this.hideMenus(), this.removeHover();
            break;
          case 13:
            s.hasClass("selectBox-menuShowing")
              ? (this.selectOption(o.find("LI.selectBox-hover:first"), e),
                s.hasClass("selectBox-dropdown") && this.hideMenus())
              : this.showMenu();
            break;
          case 38:
          case 37:
            if ((e.preventDefault(), s.hasClass("selectBox-menuShowing"))) {
              for (
                var i = o.find(".selectBox-hover").prev("LI"),
                  n = o.find("LI:not(.selectBox-optgroup)").length,
                  l = 0;
                (0 === i.length ||
                  i.hasClass("selectBox-disabled") ||
                  i.hasClass("selectBox-optgroup")) &&
                (0 === (i = i.prev("LI")).length &&
                  (i = a.loopOptions ? o.find("LI:last") : o.find("LI:first")),
                !(++l >= n));

              );
              this.addHover(i),
                this.selectOption(i, e),
                this.keepOptionInView(i);
            } else this.showMenu();
            break;
          case 40:
          case 39:
            if ((e.preventDefault(), s.hasClass("selectBox-menuShowing"))) {
              var c = o.find(".selectBox-hover").next("LI");
              for (
                n = o.find("LI:not(.selectBox-optgroup)").length, l = 0;
                (0 === c.length ||
                  c.hasClass("selectBox-disabled") ||
                  c.hasClass("selectBox-optgroup")) &&
                (0 === (c = c.next("LI")).length &&
                  (c = a.loopOptions ? o.find("LI:first") : o.find("LI:last")),
                !(++l >= n));

              );
              this.addHover(c),
                this.selectOption(c, e),
                this.keepOptionInView(c);
            } else this.showMenu();
        }
    }),
    (o.prototype.handleKeyPress = function (e) {
      var t = r(this.selectElement).data("selectBox-control"),
        s = t.data("selectBox-options");
      if (!t.hasClass("selectBox-disabled"))
        switch (e.keyCode) {
          case 9:
          case 27:
          case 13:
          case 38:
          case 37:
          case 40:
          case 39:
            break;
          default:
            t.hasClass("selectBox-menuShowing") || this.showMenu(),
              e.preventDefault(),
              clearTimeout(this.typeTimer),
              (this.typeSearch += String.fromCharCode(e.charCode || e.keyCode)),
              s.find("A").each(function () {
                if (
                  r(this)
                    .text()
                    .substr(0, this.typeSearch.length)
                    .toLowerCase() === this.typeSearch.toLowerCase()
                )
                  return (
                    this.addHover(r(this).parent()),
                    this.selectOption(r(this).parent(), e),
                    this.keepOptionInView(r(this).parent()),
                    !1
                  );
              }),
              (this.typeTimer = setTimeout(function () {
                this.typeSearch = "";
              }, 1e3));
        }
    }),
    (o.prototype.enable = function () {
      var e = r(this.selectElement);
      e.prop("disabled", !1);
      e = e.data("selectBox-control");
      e && e.removeClass("selectBox-disabled");
    }),
    (o.prototype.disable = function () {
      var e = r(this.selectElement);
      e.prop("disabled", !0);
      e = e.data("selectBox-control");
      e && e.addClass("selectBox-disabled");
    }),
    (o.prototype.setValue = function (t) {
      var e = r(this.selectElement);
      e.val(t),
        null === (t = e.val()) && ((t = e.children().first().val()), e.val(t));
      var s,
        o = e.data("selectBox-control");
      o &&
        ((s = e.data("selectBox-settings")),
        (o = o.data("selectBox-options")),
        this.setLabel(),
        o.find(".selectBox-selected").removeClass("selectBox-selected"),
        o.find("A").each(function () {
          if ("object" == typeof t)
            for (var e = 0; e < t.length; e++)
              r(this).attr("rel") == t[e] &&
                r(this).parent().addClass("selectBox-selected");
          else
            r(this).attr("rel") == t &&
              r(this).parent().addClass("selectBox-selected");
        }),
        s.change && s.change.call(e));
    }),
    (o.prototype.setOptions = function (e) {
      var t,
        s = r(this.selectElement),
        o = s.data("selectBox-control");
      s.data("selectBox-settings");
      switch (typeof e) {
        case "string":
          s.html(e);
          break;
        case "object":
          for (var a in (s.html(""), e))
            if (null !== e[a])
              if ("object" == typeof e[a]) {
                var n,
                  l = r('<optgroup label="' + a + '" />');
                for (n in e[a])
                  l.append(
                    '<option value="' + n + '">' + e[a][n] + "</option>"
                  );
                s.append(l);
              } else {
                var i = r('<option value="' + a + '">' + e[a] + "</option>");
                s.append(i);
              }
      }
      if (o)
        switch (
          (o.data("selectBox-options").remove(),
          (t = o.hasClass("selectBox-dropdown") ? "dropdown" : "inline"),
          (e = this.getOptions(t)),
          o.data("selectBox-options", e),
          t)
        ) {
          case "inline":
            o.append(e);
            break;
          case "dropdown":
            this.setLabel(), r("BODY").append(e);
        }
    }),
    (o.prototype.disableSelection = function (e) {
      r(e)
        .css("MozUserSelect", "none")
        .bind("selectstart", function (e) {
          e.preventDefault();
        });
    }),
    (o.prototype.generateOptions = function (e, t) {
      var s = r("<li />"),
        o = r("<a />");
      s.addClass(e.attr("class")),
        s.data(e.data()),
        o.attr("rel", e.val()).text(e.text()),
        s.append(o),
        e.attr("disabled") && s.addClass("selectBox-disabled"),
        e.attr("selected") && s.addClass("selectBox-selected"),
        t.append(s);
    }),
    r.extend(r.fn, {
      selectBox: function (s, e) {
        var t;
        switch (s) {
          case "control":
            return r(this).data("selectBox-control");
          case "settings":
            if (!e) return r(this).data("selectBox-settings");
            r(this).each(function () {
              r(this).data(
                "selectBox-settings",
                r.extend(!0, r(this).data("selectBox-settings"), e)
              );
            });
            break;
          case "options":
            if (undefined === e)
              return r(this)
                .data("selectBox-control")
                .data("selectBox-options");
            r(this).each(function () {
              (t = r(this).data("selectBox")) && t.setOptions(e);
            });
            break;
          case "value":
            if (undefined === e) return r(this).val();
            r(this).each(function () {
              (t = r(this).data("selectBox")) && t.setValue(e);
            });
            break;
          case "refresh":
            r(this).each(function () {
              (t = r(this).data("selectBox")) && t.refresh();
            });
            break;
          case "enable":
            r(this).each(function () {
              (t = r(this).data("selectBox")) && t.enable(this);
            });
            break;
          case "disable":
            r(this).each(function () {
              (t = r(this).data("selectBox")) && t.disable();
            });
            break;
          case "destroy":
            r(this).each(function () {
              (t = r(this).data("selectBox")) &&
                (t.destroy(), r(this).data("selectBox", null));
            });
            break;
          case "instance":
            return r(this).data("selectBox");
          default:
            r(this).each(function (e, t) {
              r(t).data("selectBox") || r(t).data("selectBox", new o(t, s));
            });
        }
        return r(this);
      },
    });
})(jQuery);
!(function (t) {
  function e() {
    var t = location.href;
    return (
      (hashtag =
        -1 !== t.indexOf("#prettyPhoto") &&
        decodeURI(t.substring(t.indexOf("#prettyPhoto") + 1, t.length))),
      hashtag && (hashtag = hashtag.replace(/<|>/g, "")),
      hashtag
    );
  }
  function i(t, e) {
    t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var i = new RegExp("[\\?&]" + t + "=([^&#]*)").exec(e);
    return null == i ? "" : i[1];
  }
  (t.prettyPhoto = { version: "3.1.6" }),
    (t.fn.prettyPhoto = function (o) {
      o = jQuery.extend(
        {
          hook: "rel",
          animation_speed: "fast",
          ajaxcallback: function () {},
          slideshow: 5e3,
          autoplay_slideshow: !1,
          opacity: 0.8,
          show_title: !0,
          allow_resize: !0,
          allow_expand: !0,
          default_width: 500,
          default_height: 344,
          counter_separator_label: "/",
          theme: "pp_default",
          horizontal_padding: 20,
          hideflash: !1,
          wmode: "opaque",
          autoplay: !0,
          modal: !1,
          deeplinking: !0,
          overlay_gallery: !0,
          overlay_gallery_max: 30,
          keyboard_shortcuts: !0,
          changepicturecallback: function () {},
          callback: function () {},
          ie6_fallback: !0,
          markup:
            '<div class="pp_pic_holder"> \t\t\t\t\t\t<div class="ppt">&nbsp;</div> \t\t\t\t\t\t<div class="pp_top"> \t\t\t\t\t\t\t<div class="pp_left"></div> \t\t\t\t\t\t\t<div class="pp_middle"></div> \t\t\t\t\t\t\t<div class="pp_right"></div> \t\t\t\t\t\t</div> \t\t\t\t\t\t<div class="pp_content_container"> \t\t\t\t\t\t\t<div class="pp_left"> \t\t\t\t\t\t\t<div class="pp_right"> \t\t\t\t\t\t\t\t<div class="pp_content"> \t\t\t\t\t\t\t\t\t<div class="pp_loaderIcon"></div> \t\t\t\t\t\t\t\t\t<div class="pp_fade"> \t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_expand" title="Expand the image">Expand</a> \t\t\t\t\t\t\t\t\t\t<div class="pp_hoverContainer"> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_next" href="#">next</a> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_previous" href="#">previous</a> \t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t\t<div id="pp_full_res"></div> \t\t\t\t\t\t\t\t\t\t<div class="pp_details"> \t\t\t\t\t\t\t\t\t\t\t<div class="pp_nav"> \t\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_previous">Previous</a> \t\t\t\t\t\t\t\t\t\t\t\t<p class="currentTextHolder">0/0</p> \t\t\t\t\t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_next">Next</a> \t\t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t\t\t<p class="pp_description"></p> \t\t\t\t\t\t\t\t\t\t\t<div class="pp_social">{pp_social}</div> \t\t\t\t\t\t\t\t\t\t\t<a class="pp_close" href="#">Close</a> \t\t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t</div> \t\t\t\t\t\t<div class="pp_bottom"> \t\t\t\t\t\t\t<div class="pp_left"></div> \t\t\t\t\t\t\t<div class="pp_middle"></div> \t\t\t\t\t\t\t<div class="pp_right"></div> \t\t\t\t\t\t</div> \t\t\t\t\t</div> \t\t\t\t\t<div class="pp_overlay"></div>',
          gallery_markup:
            '<div class="pp_gallery"> \t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_previous">Previous</a> \t\t\t\t\t\t\t\t<div> \t\t\t\t\t\t\t\t\t<ul> \t\t\t\t\t\t\t\t\t\t{gallery} \t\t\t\t\t\t\t\t\t</ul> \t\t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t\t<a href="#" class="pp_arrow_next">Next</a> \t\t\t\t\t\t\t</div>',
          image_markup: '<img id="fullResImage" src="{path}" />',
          flash_markup:
            '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
          quicktime_markup:
            '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="https://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="https://www.apple.com/quicktime/download/"></embed></object>',
          iframe_markup:
            '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
          inline_markup: '<div class="pp_inline">{content}</div>',
          custom_markup: "",
          social_tools:
            '<div class="twitter"><a href="//twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>',
        },
        o
      );
      var p,
        a,
        s,
        n,
        l,
        r,
        d,
        h = this,
        c = !1,
        _ = t(window).height(),
        g = t(window).width();
      function m() {
        t(".pp_loaderIcon").hide(),
          (projectedTop =
            scroll_pos.scrollTop + (_ / 2 - p.containerHeight / 2)),
          projectedTop < 0 && (projectedTop = 0),
          $ppt.fadeTo(settings.animation_speed, 1),
          $pp_pic_holder
            .find(".pp_content")
            .animate(
              { height: p.contentHeight, width: p.contentWidth },
              settings.animation_speed
            ),
          $pp_pic_holder.animate(
            {
              top: projectedTop,
              left:
                g / 2 - p.containerWidth / 2 < 0
                  ? 0
                  : g / 2 - p.containerWidth / 2,
              width: p.containerWidth,
            },
            settings.animation_speed,
            function () {
              $pp_pic_holder
                .find(".pp_hoverContainer,#fullResImage")
                .height(p.height)
                .width(p.width),
                $pp_pic_holder
                  .find(".pp_fade")
                  .fadeIn(settings.animation_speed),
                isSet && "image" == y(pp_images[set_position])
                  ? $pp_pic_holder.find(".pp_hoverContainer").show()
                  : $pp_pic_holder.find(".pp_hoverContainer").hide(),
                settings.allow_expand &&
                  (p.resized
                    ? t("a.pp_expand,a.pp_contract").show()
                    : t("a.pp_expand").hide()),
                !settings.autoplay_slideshow ||
                  d ||
                  a ||
                  t.prettyPhoto.startSlideshow(),
                settings.changepicturecallback(),
                (a = !0);
            }
          ),
          isSet &&
          settings.overlay_gallery &&
          "image" == y(pp_images[set_position])
            ? ((itemWidth = 57),
              (navWidth =
                "facebook" == settings.theme || "pp_default" == settings.theme
                  ? 50
                  : 30),
              (itemsPerPage = Math.floor(
                (p.containerWidth - 100 - navWidth) / itemWidth
              )),
              (itemsPerPage =
                itemsPerPage < pp_images.length
                  ? itemsPerPage
                  : pp_images.length),
              (totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1),
              0 == totalPage
                ? ((navWidth = 0),
                  $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").hide())
                : $pp_gallery.find(".pp_arrow_next,.pp_arrow_previous").show(),
              (galleryWidth = itemsPerPage * itemWidth),
              (fullGalleryWidth = pp_images.length * itemWidth),
              $pp_gallery
                .css("margin-left", -(galleryWidth / 2 + navWidth / 2))
                .find("div:first")
                .width(galleryWidth + 5)
                .find("ul")
                .width(fullGalleryWidth)
                .find("li.selected")
                .removeClass("selected"),
              (goToPage =
                Math.floor(set_position / itemsPerPage) < totalPage
                  ? Math.floor(set_position / itemsPerPage)
                  : totalPage),
              t.prettyPhoto.changeGalleryPage(goToPage),
              $pp_gallery_li
                .filter(":eq(" + set_position + ")")
                .addClass("selected"))
            : $pp_pic_holder.find(".pp_content").off("mouseenter mouseleave"),
          o.ajaxcallback();
      }
      function f(e) {
        $pp_pic_holder
          .find("#pp_full_res object,#pp_full_res embed")
          .css("visibility", "hidden"),
          $pp_pic_holder
            .find(".pp_fade")
            .fadeOut(settings.animation_speed, function () {
              t(".pp_loaderIcon").show(), e();
            });
      }
      function u(t, e) {
        if (
          ((resized = !1),
          v(t, e),
          (imageWidth = t),
          (imageHeight = e),
          (r > g || l > _) && doresize && settings.allow_resize && !c)
        ) {
          for (resized = !0, fitting = !1; !fitting; )
            r > g
              ? ((imageWidth = g - 200), (imageHeight = (e / t) * imageWidth))
              : l > _
              ? ((imageHeight = _ - 200), (imageWidth = (t / e) * imageHeight))
              : (fitting = !0),
              (l = imageHeight),
              (r = imageWidth);
          (r > g || l > _) && u(r, l), v(imageWidth, imageHeight);
        }
        return {
          width: Math.floor(imageWidth),
          height: Math.floor(imageHeight),
          containerHeight: Math.floor(l),
          containerWidth: Math.floor(r) + 2 * settings.horizontal_padding,
          contentHeight: Math.floor(s),
          contentWidth: Math.floor(n),
          resized: resized,
        };
      }
      function v(e, i) {
        (e = parseFloat(e)),
          (i = parseFloat(i)),
          ($pp_details = $pp_pic_holder.find(".pp_details")),
          $pp_details.width(e),
          (detailsHeight =
            parseFloat($pp_details.css("marginTop")) +
            parseFloat($pp_details.css("marginBottom"))),
          ($pp_details = $pp_details
            .clone()
            .addClass(settings.theme)
            .width(e)
            .appendTo(t("body"))
            .css({ position: "absolute", top: -1e4 })),
          (detailsHeight += $pp_details.height()),
          (detailsHeight = detailsHeight <= 34 ? 36 : detailsHeight),
          $pp_details.remove(),
          ($pp_title = $pp_pic_holder.find(".ppt")),
          $pp_title.width(e),
          (titleHeight =
            parseFloat($pp_title.css("marginTop")) +
            parseFloat($pp_title.css("marginBottom"))),
          ($pp_title = $pp_title
            .clone()
            .appendTo(t("body"))
            .css({ position: "absolute", top: -1e4 })),
          (titleHeight += $pp_title.height()),
          $pp_title.remove(),
          (s = i + detailsHeight),
          (n = e),
          (l =
            s +
            titleHeight +
            $pp_pic_holder.find(".pp_top").height() +
            $pp_pic_holder.find(".pp_bottom").height()),
          (r = e);
      }
      function y(t) {
        return t.match(/youtube\.com\/watch/i) || t.match(/youtu\.be/i)
          ? "youtube"
          : t.match(/vimeo\.com/i)
          ? "vimeo"
          : t.match(/\b.mov\b/i)
          ? "quicktime"
          : t.match(/\b.swf\b/i)
          ? "flash"
          : t.match(/\biframe=true\b/i)
          ? "iframe"
          : t.match(/\bajax=true\b/i)
          ? "ajax"
          : t.match(/\bcustom=true\b/i)
          ? "custom"
          : "#" == t.substr(0, 1)
          ? "inline"
          : "image";
      }
      function w() {
        if (doresize && "undefined" != typeof $pp_pic_holder) {
          if (
            ((scroll_pos = b()),
            (contentHeight = $pp_pic_holder.height()),
            (contentwidth = $pp_pic_holder.width()),
            (projectedTop = _ / 2 + scroll_pos.scrollTop - contentHeight / 2),
            projectedTop < 0 && (projectedTop = 0),
            contentHeight > _)
          )
            return;
          $pp_pic_holder.css({
            top: projectedTop,
            left: g / 2 + scroll_pos.scrollLeft - contentwidth / 2,
          });
        }
      }
      function b() {
        return self.pageYOffset
          ? { scrollTop: self.pageYOffset, scrollLeft: self.pageXOffset }
          : document.documentElement && document.documentElement.scrollTop
          ? {
              scrollTop: document.documentElement.scrollTop,
              scrollLeft: document.documentElement.scrollLeft,
            }
          : document.body
          ? {
              scrollTop: document.body.scrollTop,
              scrollLeft: document.body.scrollLeft,
            }
          : void 0;
      }
      function k(e) {
        if (
          (settings.social_tools &&
            (facebook_like_link = settings.social_tools.replace(
              "{location_href}",
              encodeURIComponent(location.href)
            )),
          (settings.markup = settings.markup.replace("{pp_social}", "")),
          t("body").append(settings.markup),
          ($pp_pic_holder = t(".pp_pic_holder")),
          ($ppt = t(".ppt")),
          ($pp_overlay = t("div.pp_overlay")),
          isSet && settings.overlay_gallery)
        ) {
          (currentGalleryPage = 0), (toInject = "");
          for (var i = 0; i < pp_images.length; i++)
            pp_images[i].match(/\b(jpg|jpeg|png|gif)\b/gi)
              ? ((classname = ""), (img_src = pp_images[i]))
              : ((classname = "default"), (img_src = "")),
              (toInject +=
                "<li class='" +
                classname +
                "'><a href='#'><img src='" +
                img_src +
                "' width='50' alt='' /></a></li>");
          (toInject = settings.gallery_markup.replace(/{gallery}/g, toInject)),
            $pp_pic_holder.find("#pp_full_res").after(toInject),
            ($pp_gallery = t(".pp_pic_holder .pp_gallery")),
            ($pp_gallery_li = $pp_gallery.find("li")),
            $pp_gallery.find(".pp_arrow_next").on("click", function () {
              return (
                t.prettyPhoto.changeGalleryPage("next"),
                t.prettyPhoto.stopSlideshow(),
                !1
              );
            }),
            $pp_gallery.find(".pp_arrow_previous").on("click", function () {
              return (
                t.prettyPhoto.changeGalleryPage("previous"),
                t.prettyPhoto.stopSlideshow(),
                !1
              );
            }),
            $pp_pic_holder
              .find(".pp_content")
              .on("mouseenter", function () {
                $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeIn();
              })
              .on("mouseleave", function () {
                $pp_pic_holder.find(".pp_gallery:not(.disabled)").fadeOut();
              }),
            (itemWidth = 57),
            $pp_gallery_li.each(function (e) {
              t(this)
                .find("a")
                .on("click", function () {
                  return (
                    t.prettyPhoto.changePage(e),
                    t.prettyPhoto.stopSlideshow(),
                    !1
                  );
                });
            });
        }
        settings.slideshow &&
          ($pp_pic_holder
            .find(".pp_nav")
            .prepend('<a href="#" class="pp_play">Play</a>'),
          $pp_pic_holder.find(".pp_nav .pp_play").on("click", function () {
            return t.prettyPhoto.startSlideshow(), !1;
          })),
          $pp_pic_holder.attr("class", "pp_pic_holder " + settings.theme),
          $pp_overlay
            .css({
              opacity: 0,
              height: t(document).height(),
              width: t(window).width(),
            })
            .on("click", function () {
              settings.modal || t.prettyPhoto.close();
            }),
          t("a.pp_close").on("click", function () {
            return t.prettyPhoto.close(), !1;
          }),
          settings.allow_expand &&
            t("a.pp_expand").on("click", function (e) {
              return (
                t(this).hasClass("pp_expand")
                  ? (t(this).removeClass("pp_expand").addClass("pp_contract"),
                    (doresize = !1))
                  : (t(this).removeClass("pp_contract").addClass("pp_expand"),
                    (doresize = !0)),
                f(function () {
                  t.prettyPhoto.open();
                }),
                !1
              );
            }),
          $pp_pic_holder
            .find(".pp_previous, .pp_nav .pp_arrow_previous")
            .on("click", function () {
              return (
                t.prettyPhoto.changePage("previous"),
                t.prettyPhoto.stopSlideshow(),
                !1
              );
            }),
          $pp_pic_holder
            .find(".pp_next, .pp_nav .pp_arrow_next")
            .on("click", function () {
              return (
                t.prettyPhoto.changePage("next"),
                t.prettyPhoto.stopSlideshow(),
                !1
              );
            }),
          w();
      }
      return (
        (doresize = !0),
        (scroll_pos = b()),
        t(window)
          .off("resize.prettyphoto")
          .on("resize.prettyphoto", function () {
            w(),
              (_ = t(window).height()),
              (g = t(window).width()),
              "undefined" != typeof $pp_overlay &&
                $pp_overlay.height(t(document).height()).width(g);
          }),
        o.keyboard_shortcuts &&
          t(document)
            .off("keydown.prettyphoto")
            .on("keydown.prettyphoto", function (e) {
              if (
                "undefined" != typeof $pp_pic_holder &&
                $pp_pic_holder.is(":visible")
              )
                switch (e.keyCode) {
                  case 37:
                    t.prettyPhoto.changePage("previous"), e.preventDefault();
                    break;
                  case 39:
                    t.prettyPhoto.changePage("next"), e.preventDefault();
                    break;
                  case 27:
                    settings.modal || t.prettyPhoto.close(), e.preventDefault();
                }
            }),
        (t.prettyPhoto.initialize = function () {
          return (
            (settings = o),
            "pp_default" == settings.theme &&
              (settings.horizontal_padding = 16),
            (theRel = t(this).attr(settings.hook)),
            (galleryRegExp = /\[(?:.*)\]/),
            (isSet = !!galleryRegExp.exec(theRel)),
            (pp_images = isSet
              ? jQuery.map(h, function (e, i) {
                  if (-1 != t(e).attr(settings.hook).indexOf(theRel))
                    return t(e).attr("href");
                })
              : t.makeArray(t(this).attr("href"))),
            (pp_titles = isSet
              ? jQuery.map(h, function (e, i) {
                  if (-1 != t(e).attr(settings.hook).indexOf(theRel))
                    return t(e).find("img").attr("alt")
                      ? t(e).find("img").attr("alt")
                      : "";
                })
              : t.makeArray(t(this).find("img").attr("alt"))),
            (pp_descriptions = isSet
              ? jQuery.map(h, function (e, i) {
                  if (-1 != t(e).attr(settings.hook).indexOf(theRel))
                    return t(e).attr("title") ? t(e).attr("title") : "";
                })
              : t.makeArray(t(this).attr("title"))),
            pp_images.length > settings.overlay_gallery_max &&
              (settings.overlay_gallery = !1),
            (set_position = jQuery.inArray(t(this).attr("href"), pp_images)),
            (rel_index = isSet
              ? set_position
              : t("a[" + settings.hook + "^='" + theRel + "']").index(t(this))),
            k(this),
            settings.allow_resize &&
              t(window).on("scroll.prettyphoto", function () {
                w();
              }),
            t.prettyPhoto.open(),
            !1
          );
        }),
        (t.prettyPhoto.open = function (e) {
          return (
            "undefined" == typeof settings &&
              ((settings = o),
              (pp_images = t.makeArray(arguments[0])),
              (pp_titles = arguments[1]
                ? t.makeArray(arguments[1])
                : t.makeArray("")),
              (pp_descriptions = arguments[2]
                ? t.makeArray(arguments[2])
                : t.makeArray("")),
              (isSet = pp_images.length > 1),
              (set_position = arguments[3] ? arguments[3] : 0),
              k(e.target)),
            settings.hideflash &&
              t("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css(
                "visibility",
                "hidden"
              ),
            t(pp_images).length > 1 ? t(".pp_nav").show() : t(".pp_nav").hide(),
            t(".pp_loaderIcon").show(),
            settings.deeplinking &&
              (function () {
                if ("undefined" == typeof theRel) return;
                location.hash = theRel + "/" + rel_index + "/";
              })(),
            settings.social_tools &&
              ((facebook_like_link = settings.social_tools.replace(
                "{location_href}",
                encodeURIComponent(location.href)
              )),
              $pp_pic_holder.find(".pp_social").html(facebook_like_link)),
            $ppt.is(":hidden") && $ppt.css("opacity", 0).show(),
            $pp_overlay
              .show()
              .fadeTo(settings.animation_speed, settings.opacity),
            $pp_pic_holder
              .find(".currentTextHolder")
              .text(
                set_position +
                  1 +
                  settings.counter_separator_label +
                  t(pp_images).length
              ),
            "undefined" != typeof pp_descriptions[set_position] &&
            "" != pp_descriptions[set_position]
              ? $pp_pic_holder
                  .find(".pp_description")
                  .show()
                  .html(unescape(pp_descriptions[set_position]))
              : $pp_pic_holder.find(".pp_description").hide(),
            (movie_width = parseFloat(i("width", pp_images[set_position]))
              ? i("width", pp_images[set_position])
              : settings.default_width.toString()),
            (movie_height = parseFloat(i("height", pp_images[set_position]))
              ? i("height", pp_images[set_position])
              : settings.default_height.toString()),
            (c = !1),
            -1 != movie_height.indexOf("%") &&
              ((movie_height = parseFloat(
                (t(window).height() * parseFloat(movie_height)) / 100 - 150
              )),
              (c = !0)),
            -1 != movie_width.indexOf("%") &&
              ((movie_width = parseFloat(
                (t(window).width() * parseFloat(movie_width)) / 100 - 150
              )),
              (c = !0)),
            $pp_pic_holder.fadeIn(function () {
              switch (
                (settings.show_title &&
                "" != pp_titles[set_position] &&
                "undefined" != typeof pp_titles[set_position]
                  ? $ppt.html(unescape(pp_titles[set_position]))
                  : $ppt.html("&nbsp;"),
                (imgPreloader = ""),
                (skipInjection = !1),
                y(pp_images[set_position]))
              ) {
                case "image":
                  (imgPreloader = new Image()),
                    (nextImage = new Image()),
                    isSet &&
                      set_position < t(pp_images).length - 1 &&
                      (nextImage.src = pp_images[set_position + 1]),
                    (prevImage = new Image()),
                    isSet &&
                      pp_images[set_position - 1] &&
                      (prevImage.src = pp_images[set_position - 1]),
                    ($pp_pic_holder.find("#pp_full_res")[0].innerHTML =
                      settings.image_markup.replace(
                        /{path}/g,
                        pp_images[set_position]
                      )),
                    (imgPreloader.onload = function () {
                      (p = u(imgPreloader.width, imgPreloader.height)), m();
                    }),
                    (imgPreloader.onerror = function () {
                      alert(
                        "Image cannot be loaded. Make sure the path is correct and image exist."
                      ),
                        t.prettyPhoto.close();
                    }),
                    (imgPreloader.src = pp_images[set_position]);
                  break;
                case "youtube":
                  (p = u(movie_width, movie_height)),
                    (movie_id = i("v", pp_images[set_position])),
                    "" == movie_id &&
                      ((movie_id = pp_images[set_position].split("youtu.be/")),
                      (movie_id = movie_id[1]),
                      movie_id.indexOf("?") > 0 &&
                        (movie_id = movie_id.substr(0, movie_id.indexOf("?"))),
                      movie_id.indexOf("&") > 0 &&
                        (movie_id = movie_id.substr(0, movie_id.indexOf("&")))),
                    (movie = "//www.youtube.com/embed/" + movie_id),
                    i("rel", pp_images[set_position])
                      ? (movie += "?rel=" + i("rel", pp_images[set_position]))
                      : (movie += "?rel=1"),
                    settings.autoplay && (movie += "&autoplay=1"),
                    (toInject = settings.iframe_markup
                      .replace(/{width}/g, p.width)
                      .replace(/{height}/g, p.height)
                      .replace(/{wmode}/g, settings.wmode)
                      .replace(/{path}/g, movie));
                  break;
                case "vimeo":
                  (p = u(movie_width, movie_height)),
                    (movie_id = pp_images[set_position]);
                  var e = movie_id.match(
                    /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/
                  );
                  (movie =
                    "//player.vimeo.com/video/" +
                    e[3] +
                    "?title=0&amp;byline=0&amp;portrait=0"),
                    settings.autoplay && (movie += "&autoplay=1;"),
                    (vimeo_width = p.width + "/embed/?moog_width=" + p.width),
                    (toInject = settings.iframe_markup
                      .replace(/{width}/g, vimeo_width)
                      .replace(/{height}/g, p.height)
                      .replace(/{path}/g, movie));
                  break;
                case "quicktime":
                  ((p = u(movie_width, movie_height)).height += 15),
                    (p.contentHeight += 15),
                    (p.containerHeight += 15),
                    (toInject = settings.quicktime_markup
                      .replace(/{width}/g, p.width)
                      .replace(/{height}/g, p.height)
                      .replace(/{wmode}/g, settings.wmode)
                      .replace(/{path}/g, pp_images[set_position])
                      .replace(/{autoplay}/g, settings.autoplay));
                  break;
                case "flash":
                  (p = u(movie_width, movie_height)),
                    (flash_vars = pp_images[set_position]),
                    (flash_vars = flash_vars.substring(
                      pp_images[set_position].indexOf("flashvars") + 10,
                      pp_images[set_position].length
                    )),
                    (filename = pp_images[set_position]),
                    (filename = filename.substring(0, filename.indexOf("?"))),
                    (toInject = settings.flash_markup
                      .replace(/{width}/g, p.width)
                      .replace(/{height}/g, p.height)
                      .replace(/{wmode}/g, settings.wmode)
                      .replace(/{path}/g, filename + "?" + flash_vars));
                  break;
                case "iframe":
                  (p = u(movie_width, movie_height)),
                    (frame_url = pp_images[set_position]),
                    (frame_url = frame_url.substr(
                      0,
                      frame_url.indexOf("iframe") - 1
                    )),
                    (toInject = settings.iframe_markup
                      .replace(/{width}/g, p.width)
                      .replace(/{height}/g, p.height)
                      .replace(/{path}/g, frame_url));
                  break;
                case "ajax":
                  (doresize = !1),
                    (p = u(movie_width, movie_height)),
                    (doresize = !0),
                    (skipInjection = !0),
                    t.get(pp_images[set_position], function (t) {
                      (toInject = settings.inline_markup.replace(
                        /{content}/g,
                        t
                      )),
                        ($pp_pic_holder.find("#pp_full_res")[0].innerHTML =
                          toInject),
                        m();
                    });
                  break;
                case "custom":
                  (p = u(movie_width, movie_height)),
                    (toInject = settings.custom_markup);
                  break;
                case "inline":
                  (myClone = t(pp_images[set_position])
                    .clone()
                    .append('<br clear="all" />')
                    .css({ width: settings.default_width })
                    .wrapInner(
                      '<div id="pp_full_res"><div class="pp_inline"></div></div>'
                    )
                    .appendTo(t("body"))
                    .show()),
                    (doresize = !1),
                    (p = u(t(myClone).width(), t(myClone).height())),
                    (doresize = !0),
                    t(myClone).remove(),
                    (toInject = settings.inline_markup.replace(
                      /{content}/g,
                      t(pp_images[set_position]).html()
                    ));
              }
              imgPreloader ||
                skipInjection ||
                (($pp_pic_holder.find("#pp_full_res")[0].innerHTML = toInject),
                m());
            }),
            !1
          );
        }),
        (t.prettyPhoto.changePage = function (e) {
          (currentGalleryPage = 0),
            "previous" == e
              ? (set_position--,
                set_position < 0 && (set_position = t(pp_images).length - 1))
              : "next" == e
              ? (set_position++,
                set_position > t(pp_images).length - 1 && (set_position = 0))
              : (set_position = e),
            (rel_index = set_position),
            doresize || (doresize = !0),
            settings.allow_expand &&
              t(".pp_contract")
                .removeClass("pp_contract")
                .addClass("pp_expand"),
            f(function () {
              t.prettyPhoto.open();
            });
        }),
        (t.prettyPhoto.changeGalleryPage = function (t) {
          "next" == t
            ? (currentGalleryPage++,
              currentGalleryPage > totalPage && (currentGalleryPage = 0))
            : "previous" == t
            ? (currentGalleryPage--,
              currentGalleryPage < 0 && (currentGalleryPage = totalPage))
            : (currentGalleryPage = t),
            (slide_speed =
              "next" == t || "previous" == t ? settings.animation_speed : 0),
            (slide_to = currentGalleryPage * (itemsPerPage * itemWidth)),
            $pp_gallery.find("ul").animate({ left: -slide_to }, slide_speed);
        }),
        (t.prettyPhoto.startSlideshow = function () {
          void 0 === d
            ? ($pp_pic_holder
                .find(".pp_play")
                .off("click")
                .removeClass("pp_play")
                .addClass("pp_pause")
                .on("click", function () {
                  return t.prettyPhoto.stopSlideshow(), !1;
                }),
              (d = setInterval(
                t.prettyPhoto.startSlideshow,
                settings.slideshow
              )))
            : t.prettyPhoto.changePage("next");
        }),
        (t.prettyPhoto.stopSlideshow = function () {
          $pp_pic_holder
            .find(".pp_pause")
            .off("click")
            .removeClass("pp_pause")
            .addClass("pp_play")
            .on("click", function () {
              return t.prettyPhoto.startSlideshow(), !1;
            }),
            clearInterval(d),
            (d = undefined);
        }),
        (t.prettyPhoto.close = function () {
          $pp_overlay.is(":animated") ||
            (t.prettyPhoto.stopSlideshow(),
            $pp_pic_holder
              .stop()
              .find("object,embed")
              .css("visibility", "hidden"),
            t("div.pp_pic_holder,div.ppt,.pp_fade").fadeOut(
              settings.animation_speed,
              function () {
                t(this).remove();
              }
            ),
            $pp_overlay.fadeOut(settings.animation_speed, function () {
              settings.hideflash &&
                t("object,embed,iframe[src*=youtube],iframe[src*=vimeo]").css(
                  "visibility",
                  "visible"
                ),
                t(this).remove(),
                t(window).off("scroll.prettyphoto"),
                -1 !== location.href.indexOf("#prettyPhoto") &&
                  (location.hash = "prettyPhoto"),
                settings.callback(),
                (doresize = !0),
                (a = !1),
                delete settings;
            }));
        }),
        !pp_alreadyInitialized &&
          e() &&
          ((pp_alreadyInitialized = !0),
          (hashIndex = e()),
          (hashRel = hashIndex),
          (hashIndex = hashIndex.substring(
            hashIndex.indexOf("/") + 1,
            hashIndex.length - 1
          )),
          (hashRel = hashRel.substring(0, hashRel.indexOf("/"))),
          setTimeout(function () {
            t(
              "a[" + o.hook + "^='" + hashRel + "']:eq(" + hashIndex + ")"
            ).trigger("click");
          }, 50)),
        this.off("click.prettyphoto").on(
          "click.prettyphoto",
          t.prettyPhoto.initialize
        )
      );
    });
})(jQuery);
var pp_alreadyInitialized = !1;
