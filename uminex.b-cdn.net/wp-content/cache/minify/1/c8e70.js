!(function (e) {
  "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery);
})(function (e) {
  (e.fn.addBack = e.fn.addBack || e.fn.andSelf),
    e.fn.extend({
      actual: function (n, t) {
        if (!this[n])
          throw (
            '$.actual => The jQuery method "' +
            n +
            '" you called does not exist'
          );
        var a,
          i,
          o = { absolute: !1, clone: !1, includeMargin: !1, display: "block" },
          c = e.extend(o, t),
          r = this.eq(0);
        if (c.clone === !0)
          (a = function () {
            var e = "position: absolute !important; top: -1000 !important; ";
            r = r.clone().attr("style", e).appendTo("body");
          }),
            (i = function () {
              r.remove();
            });
        else {
          var l,
            u = [],
            s = "";
          (a = function () {
            (l = r.parents().addBack().filter(":hidden")),
              (s +=
                "visibility: hidden !important; display: " +
                c.display +
                " !important; "),
              c.absolute === !0 && (s += "position: absolute !important; "),
              l.each(function () {
                var n = e(this),
                  t = n.attr("style");
                u.push(t), n.attr("style", t ? t + ";" + s : s);
              });
          }),
            (i = function () {
              l.each(function (n) {
                var t = e(this),
                  a = u[n];
                void 0 === a ? t.removeAttr("style") : t.attr("style", a);
              });
            });
        }
        a();
        var d = /(outer)/.test(n) ? r[n](c.includeMargin) : r[n]();
        return i(), d;
      },
    });
}),
  (function (e) {
    "use strict";
    function n() {
      var e = jQuery('<div style="width: 100%; height:200px;">test</div>'),
        n = jQuery(
          '<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>'
        ).append(e),
        t = e[0],
        a = n[0];
      jQuery("body").append(a);
      var i = t.offsetWidth;
      n.css("overflow", "scroll");
      var o = a.clientWidth;
      return n.remove(), i - o;
    }
    function t(e, n) {
      if ("undefined" !== e) {
        var t = 0,
          a = 0,
          i = e.offset();
        "undefined" != typeof i &&
          ((a = e.innerWidth()),
          setTimeout(function () {
            n.children(".megamenu").css({ "max-width": a + "px" });
            var e = n.children(".megamenu").outerWidth(),
              o = n.outerWidth();
            n.children(".megamenu").css({ left: "-" + (e / 2 - o / 2) + "px" });
            var c = i.left,
              r = c + a,
              l = n.offset().left,
              u = e / 2 > l - c,
              s = e / 2 + l > r;
            u &&
              ((t = l - c), n.children(".megamenu").css({ left: -t + "px" })),
              s &&
                !u &&
                ((t = l - c),
                (t -= a - e),
                n.children(".megamenu").css({ left: -t + "px" }));
          }, 100));
      }
    }
    function a(n) {
      n.hasClass("loaded") ||
        e.ajax({
          type: "POST",
          url: ovic_ajax_megamenu.ajaxurl,
          data: {
            action: "ovic_load_mobile_menu",
            security: ovic_ajax_megamenu.security,
            locations: n.data("locations"),
            default: n.data("default"),
          },
          success: function (e) {
            1 == e.success && n.children(".ovic-menu-panels").html(e.data);
          },
          complete: function (e) {
            n.children(".loader-mobile").remove(), n.addClass("loaded");
          },
        });
    }
    var i = {
      Mobile: function () {
        return navigator.userAgent.match(
          /(iPhone|iPod|Android|Phone|DROID|ZuneWP7|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/
        );
      },
      Tablet: function () {
        return navigator.userAgent.match(
          /(Tablet|iPad|Kindle|Playbook|Nexus|Xoom|SM-N900T|GT-N7100|SAMSUNG-SGH-I717|SM-T330NU)/
        );
      },
      any: function () {
        return i.Mobile() || i.Tablet();
      },
    };
    (e.fn.ovic_resize_megamenu = function () {
      var a = e(this);
      a
        .on("ovic_resize_megamenu", function () {
          var a = jQuery("body").innerWidth();
          (a += n()),
            e(this).length > 0 &&
              a > 991 &&
              e(this).each(function () {
                var n = e(this).children(".megamenu").data("responsive"),
                  a = e(this).closest(".ovic-menu-wapper");
                "" !== n &&
                  e(this).closest(n).length &&
                  (a = e(this).closest(n)),
                  t(a, e(this));
              });
        })
        .trigger("ovic_resize_megamenu"),
        e(window).on("resize", function () {
          a.trigger("ovic_resize_megamenu");
        });
    }),
      (e.fn.ovic_vertical_megamenu = function () {
        var n = e(this);
        n
          .on("ovic_vertical_megamenu", function () {
            e(this).each(function () {
              var n = e(this),
                t = n.offset().left > 0 ? n.offset().left : 0,
                a = parseInt(n.actual("width")),
                i = t + a;
              n.find(".megamenu").each(function () {
                var n = e(this),
                  o = n.data("responsive"),
                  c = n.closest(".container");
                if (("" !== o && (c = n.closest(o)), c.length > 0)) {
                  var r = parseInt(c.innerWidth()) - 30,
                    l = c.offset(),
                    u = l.left + r,
                    s = r - a;
                  (t > u || i < l.left) && (s = r),
                    i > u && (s = r - (a - (i - u)) - 30),
                    s > 0 && e(this).css("max-width", s + "px");
                }
              });
            });
          })
          .trigger("ovic_vertical_megamenu"),
          e(window).on("resize", function () {
            n.trigger("ovic_vertical_megamenu");
          });
      }),
      1 == ovic_ajax_megamenu.load_megamenu &&
        e(".ovic-menu-wapper .menu-item.item-megamenu").hover(function () {
          var n = e(this),
            t =
              (n.children("a").data("megamenu"),
              n.children(".sub-menu.megamenu"));
          return (
            n.hasClass("loaded") ||
              (n.addClass("loaded"),
              e.ajax({
                type: "POST",
                url: ovic_ajax_megamenu.ajaxurl,
                data: {
                  action: "ovic_load_mega_menu",
                  security: ovic_ajax_megamenu.security,
                  megamenu_id: n.children("a").data("megamenu"),
                },
                success: function (e) {
                  1 == e.success && t.html(e.data);
                },
              })),
            !1
          );
        }),
      e(document).on("click", ".menu-toggle", function () {
        var n = e(this),
          t = n.data("index"),
          i = e(".ovic-menu-clone-wrap");
        return (
          void 0 != t &&
            e("#ovic-menu-mobile-" + t).length &&
            (i = e("#ovic-menu-mobile-" + t)),
          e("body").addClass("ovic-open-mobile-menu"),
          i.addClass("open"),
          "click" == ovic_ajax_megamenu.load_menu && a(i),
          !1
        );
      }),
      e(document).on(
        "click",
        ".ovic-menu-clone-wrap .ovic-menu-close-panels",
        function () {
          return (
            e("body").removeClass("ovic-open-mobile-menu"),
            e(".ovic-menu-clone-wrap").removeClass("open"),
            !1
          );
        }
      ),
      e(document).on("click", function (n) {
        var t = e(".ovic-menu-clone-wrap");
        e("body").hasClass("rtl")
          ? n.offsetX < 0 &&
            (t.removeClass("open"),
            e("body").removeClass("ovic-open-mobile-menu"))
          : n.offsetX > t.width() &&
            (t.removeClass("open"),
            e("body").removeClass("ovic-open-mobile-menu"));
      }),
      e(document).on("click", ".ovic-menu-next-panel", function (n) {
        var t = e(this),
          a = t.attr("href"),
          i = t.closest(".menu-item"),
          o = t.closest(".ovic-menu-panel"),
          c = t.closest(".ovic-menu-clone-wrap"),
          r = c.find(".ovic-menu-current-panel-title"),
          l = c.find(".ovic-menu-panels-actions-wrap"),
          u = c.find(a);
        if (u.length) {
          var s = i.children(".menu-link").html(),
            d = e('<a class="ovic-menu-prev-panel"></a>'),
            m = "";
          o.addClass("ovic-menu-sub-opened"),
            u
              .removeClass("ovic-menu-hidden")
              .addClass("ovic-menu-panel-opened")
              .attr("data-parent-title", s)
              .attr("data-parent-panel", o.attr("id")),
            r.length > 0 && (m = r.clone()),
            "undefined" != typeof s && typeof s !== !1
              ? (r.length ||
                  l.prepend(
                    '<span class="ovic-menu-current-panel-title"></span>'
                  ),
                r.html(s))
              : r.remove(),
            d.attr("data-current-panel", a),
            d.attr("href", "#" + o.attr("id")),
            l.find(".ovic-menu-prev-panel").remove(),
            l.prepend(d);
        }
        n.preventDefault();
      }),
      e(document).on("click", ".ovic-menu-prev-panel", function (n) {
        var t = e(this),
          a = t.closest(".ovic-menu-clone-wrap"),
          i = t.attr("data-current-panel"),
          o = t.attr("href"),
          c = a.find(".ovic-menu-panels-actions-wrap"),
          r = a.find(".ovic-menu-current-panel-title"),
          l = a.find(o),
          u = r.attr("data-main-title");
        a
          .find(i)
          .removeClass("ovic-menu-panel-opened")
          .addClass("ovic-menu-hidden"),
          l
            .addClass("ovic-menu-panel-opened")
            .removeClass("ovic-menu-sub-opened");
        var s = l.attr("data-parent-title"),
          d = l.attr("data-parent-panel");
        "undefined" == typeof d || typeof d === !1
          ? (t.remove(), r.html(u))
          : (t.attr("href", "#" + d).attr("data-current-panel", o),
            "undefined" != typeof s && typeof s !== !1
              ? (r.length ||
                  c.prepend(
                    '<span class="ovic-menu-current-panel-title"></span>'
                  ),
                r.html(s))
              : r.remove()),
          n.preventDefault();
      }),
      e(document).on(
        "click",
        ".ovic-menu-clone-wrap .menu-item.disable-link > .menu-link",
        function (n) {
          e(this).prev(".ovic-menu-next-panel").trigger("click"),
            n.preventDefault();
        }
      ),
      e(document).ready(function () {
        var n = !0;
        if (
          ("mobile" == ovic_ajax_megamenu.resize && i.Mobile() && (n = !1),
          "tablet" == ovic_ajax_megamenu.resize && i.any() && (n = !1),
          n)
        ) {
          var t = e(".ovic-menu-wapper.horizontal"),
            a = e(".ovic-menu-wapper.vertical");
          t.length &&
            t.each(function () {
              e(this).find(".item-megamenu").length &&
                e(this).find(".item-megamenu").ovic_resize_megamenu();
            }),
            a.length && a.ovic_vertical_megamenu();
        }
      }),
      "last" == ovic_ajax_megamenu.load_menu &&
        window.addEventListener(
          "load",
          function o() {
            window.removeEventListener("load", o, !1),
              setTimeout(function () {
                e(".ovic-menu-clone-wrap").each(function () {
                  a(e(this));
                });
              }, ovic_ajax_megamenu.delay);
          },
          !1
        );
  })(jQuery);
