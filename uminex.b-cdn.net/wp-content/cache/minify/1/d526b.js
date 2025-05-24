!(function (t) {
  "use strict";
  if (
    ("undefined" != typeof ovic_core_params.growl_notice &&
      ((t.fn.ovic_add_notify = function (o) {
        var e = [],
          n = "",
          a = "",
          i = t(this),
          r = i.closest(".product-item").find("img.wp-post-image"),
          c = i.attr("aria-label"),
          d = wp.template("ovic-notice-popup");
        if (
          ((e.duration = ovic_core_params.growl_notice.growl_duration),
          (e.title = ovic_core_params.growl_notice.growl_notice_text),
          i.removeClass("loading"),
          i.closest(".mini_cart_item").length &&
            ((r = i.closest(".mini_cart_item").find("a > img")),
            (c = i
              .closest(".mini_cart_item")
              .find("a:not(.remove)")
              .clone()
              .children()
              .remove()
              .end()
              .text())),
          !r.length &&
            i.closest(".wishlist_table").length &&
            ((r = i.closest("tr").find(".product-thumbnail img")),
            (c = i.closest("tr").find(".product-name a").text())),
          !r.length &&
            i.closest(".ovic-pin").length &&
            (r = i.closest(".ovic-pin").find(".ovic-product-thumbnail img")),
          !r.length &&
            i.closest(".single-product").length &&
            (r = i
              .closest(".single-product")
              .find(
                ".product .woocommerce-product-gallery__wrapper img.wp-post-image"
              )),
          !r.length &&
            i.closest(".product").length &&
            (r = i.closest(".product").find("img")),
          ("undefined" == typeof c || "" === c) &&
            (c = i.closest(".product").find(".summary .product_title").text()),
          setTimeout(
            function () {
              i.removeClass("added").removeClass("recent-added"),
                i.next(".added_to_cart").remove();
            },
            3e3,
            i
          ),
          ("undefined" == typeof c || "" === c) &&
            (c = i
              .closest(".product-item")
              .find(".product-title:first a")
              .text()
              .trim()),
          "undefined" != typeof c && "" !== c)
        ) {
          var s = c.indexOf("“") + 1,
            l = c.indexOf("”");
          c = s > 1 ? c.slice(s, l) : c;
        } else c = "";
        r.length && (n = r.attr("src")),
          (a = d({ img_url: n, content: o, title: c })),
          (a = a.replace("/*<![CDATA[*/", "")),
          (a = a.replace("/*]]>*/", "")),
          (e.message = a),
          t.growl.notice(e);
      }),
      t(document).on("removed_from_cart", function (t, o, e, n) {
        n.ovic_add_notify(ovic_core_params.growl_notice.removed_cart_text);
      }),
      t(document).on("added_to_cart", function (t, o, e, n) {
        n.ovic_add_notify(
          ovic_core_params.growl_notice.added_to_cart_text +
            '</br><a href="' +
            ovic_core_params.cart_url +
            '">' +
            ovic_core_params.growl_notice.view_cart +
            "</a>"
        );
      }),
      t(document).on(
        "added_to_wishlist removed_from_wishlist",
        function (o, e, n) {
          var a = "",
            i = e.data("product-id"),
            r = void 0 !== i ? t(".add-to-wishlist-" + i).first() : e,
            c = e.hasClass("delete_item") || e.hasClass("remove") ? !0 : !1,
            d = ovic_core_params.growl_notice.added_to_wishlist_text;
          c === !0 &&
            (d = ovic_core_params.growl_notice.removed_from_wishlist_text),
            (a += d + "</br>"),
            (a +=
              '<a href="' + ovic_core_params.growl_notice.wishlist_url + '">'),
            c === !1 &&
              (a += ovic_core_params.growl_notice.browse_wishlist_text),
            (a += "</a>"),
            r.ovic_add_notify(a),
            e.removeClass("loading");
        }
      ),
      t(document).on("click", function (o) {
        var e = t(o.target).closest("#growls-default");
        t("#growls-default");
        e.length || t(".growl-close").trigger("click");
      })),
    ovic_core_params.ajax_single_add_to_cart &&
      "no" === ovic_core_params.cart_redirect_after_add)
  ) {
    t(document).on(
      "click",
      ".product:not(.product-type-external) form.cart button.single_add_to_cart_button:not(.disabled)",
      function (o) {
        o.preventDefault();
        const e = t(this),
          n = e.closest("form"),
          a = new FormData(n[0]);
        e.addClass("loading"),
          e.val() && a.append("add-to-cart", e.val()),
          t.ajax({
            url: n.attr("action"),
            type: n.attr("method"),
            data: a,
            processData: !1,
            contentType: !1,
            complete: function () {
              return e.hasClass("buy-now")
                ? void (window.location = ovic_core_params.cart_url)
                : (e.removeClass("loading"),
                  t(document.body).trigger("wc_fragment_refresh"),
                  void t(document.body).trigger("added_to_cart", [
                    null,
                    null,
                    e,
                  ]));
            },
          });
      }
    );
  }
  t(document).on("click", "form.cart .product-buy-now", function (o) {
    var e = t(this),
      n = e.closest("form"),
      a = n.find('[name="buy-now-redirect"]');
    ovic_core_params.ajax_single_add_to_cart
      ? t(document).on("added_to_cart", function (t, o, e) {
          window.location = ovic_core_params.cart_url;
        })
      : a.val(1).trigger("change"),
      n.find('[type="submit"]').trigger("click"),
      o.preventDefault();
  }),
    (t.fn.ovic_load_post = function () {
      var o = !1,
        e = 0,
        n = function (e, n, a, i) {
          var r = i.find(".button-loadmore").data("total");
          i.addClass("loading"),
            t.ajax({
              type: "GET",
              url: n,
              data: { ovic_raw_content: 1 },
              success: function (n) {
                if (n) {
                  var c = t.parseHTML(n, document, !0),
                    d = t(".pagination-nav", c).length
                      ? t(".pagination-nav", c)[0].innerHTML
                      : "",
                    s = t(e.data("response"), c).length
                      ? t(e.data("response"), c)[0]
                      : "",
                    l = t(".pagination-nav", c)
                      .find(".button-loadmore")
                      .data("current"),
                    _ = t(s).children();
                  "" !== s
                    ? ("" !== e.data("animate")
                        ? _.each(function (o) {
                            var n = t(this),
                              i = n.attr("style"),
                              r = 100 * o;
                            (i = void 0 === i ? "" : i),
                              n
                                .attr(
                                  "style",
                                  i +
                                    ";-webkit-animation-delay:" +
                                    r +
                                    "ms;-moz-animation-delay:" +
                                    r +
                                    "ms;-o-animation-delay:" +
                                    r +
                                    "ms;animation-delay:" +
                                    r +
                                    "ms;"
                                )
                                .addClass(e.data("animate") + " animated")
                                .one(
                                  "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
                                  function () {
                                    n.removeClass(
                                      e.data("animate") + " animated"
                                    ),
                                      n.attr("style", i);
                                  }
                                ),
                              a.append(n);
                          })
                        : a.append(s.innerHTML),
                      (o = !1),
                      a.trigger("ovic_success_load_more_post", [s, c]))
                    : (o = !0),
                    l >= r
                      ? i.closest(".pagination-nav").remove()
                      : (i.html(d), i.removeClass("loading"));
                }
              },
              complete: function () {
                a.trigger("ovic_complete_load_more_post");
              },
            });
        };
      t(document).on(
        "click",
        ".pagination-nav.type-load_more .button-loadmore",
        function (o) {
          o.preventDefault();
          var e = t(this),
            a = e.data("url"),
            i = e.closest(e.data("wrapper")),
            r = i.find(e.data("response")),
            c = e.closest(".pagination-nav");
          n(e, a, r, c);
        }
      ),
        t(".pagination-nav.type-infinite .button-loadmore").length &&
          t(document).on("scroll", function () {
            var a = t(".pagination-nav.type-infinite .button-loadmore"),
              i = a.data("url"),
              r = a.closest(a.data("wrapper")),
              c = r.find(a.data("response")),
              d = a.closest(".pagination-nav"),
              s = t(this).scrollTop();
            s > e &&
              d.length &&
              t(window).scrollTop() + t(window).height() >= d.offset().top &&
              (o === !1 && n(a, i, c, d), (o = !0)),
              (e = s);
          });
    }),
    window.addEventListener(
      "load",
      function o() {
        window.removeEventListener("load", o, !1),
          t(".pagination-nav .button-loadmore").length &&
            t(".pagination-nav .button-loadmore").ovic_load_post(),
          t(window).on("elementor/frontend/init", function () {
            elementorFrontend.hooks.addAction(
              "frontend/element_ready/section",
              function (t, o) {
                o.fn.slick &&
                  t.hasClass("elementor-section-stretched") &&
                  t.find(".owl-slick").length > 0 &&
                  t.find(".owl-slick").slick("resize");
              }
            );
          });
      },
      !1
    );
})(window.jQuery);
