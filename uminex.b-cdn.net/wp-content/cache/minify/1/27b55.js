jQuery(document).ready(function (o) {
  "use strict";
  var c, t, a, i, d, r, u, e, n, l;
  "undefined" != typeof yith_qv &&
    ((c = o(document).find("#yith-quick-view-modal")),
    (t = c.find(".yith-quick-view-overlay")),
    (a = c.find("#yith-quick-view-content")),
    (i = c.find("#yith-quick-view-close")),
    (d = c.find(".yith-wcqv-wrapper")),
    (r = d.width()),
    (u = d.height()),
    (e = function () {
      var t = o(window).width(),
        i = o(window).height(),
        e = r < t - 60 ? r : t - 60,
        n = u < i - 120 ? u : i - 120;
      d.css({
        left: t / 2 - e / 2,
        top: i / 2 - n / 2,
        width: e + "px",
        height: n + "px",
      });
    }),
    (o.fn.yith_quick_view = function () {
      o(document)
        .off("click", ".yith-wcqv-button")
        .on("click", ".yith-wcqv-button", function (t) {
          t.preventDefault();
          var t = o(this),
            i = t.data("product_id"),
            e = !1;
          "undefined" != typeof yith_qv.loader &&
            ((e = !0),
            t.block({
              message: null,
              overlayCSS: {
                background: "#fff url(" + yith_qv.loader + ") no-repeat center",
                opacity: 0.5,
                cursor: "none",
              },
            }),
            c.hasClass("loading") || c.addClass("loading"),
            o(document).trigger("qv_loading")),
            n(t, i, e);
        });
    }),
    (n = function (e, t, n) {
      o.ajax({
        url: yith_qv.ajaxurl,
        data: {
          action: "yith_load_product_quick_view",
          product_id: t,
          lang: yith_qv.lang,
          context: "frontend",
        },
        dataType: "json",
        type: "POST",
        success: function (t) {
          a.html(t.html);
          var i = a.find(".variations_form");
          i.each(function () {
            o(this).wc_variation_form(),
              "undefined" != typeof o.fn.yith_wccl
                ? o(this).yith_wccl()
                : "undefined" != typeof o.yith_wccl &&
                  t.prod_attr &&
                  o.yith_wccl(t.prod_attr);
          }),
            i.trigger("check_variations"),
            i.trigger("reset_image"),
            "undefined" != typeof o.fn.wc_product_gallery &&
              a.find(".woocommerce-product-gallery").each(function () {
                o(this).wc_product_gallery();
              }),
            c.hasClass("open") ||
              (c.removeClass("loading").addClass("open"), n && e.unblock()),
            o(document).trigger("qv_loader_stop");
        },
      });
    }),
    t.on("click", function (t) {
      l();
    }),
    o(document).keyup(function (t) {
      27 === t.keyCode && l();
    }),
    i.on("click", function (t) {
      t.preventDefault(), l();
    }),
    (l = function () {
      c.removeClass("open").removeClass("loading"),
        setTimeout(function () {
          a.html("");
        }, 1e3);
    }),
    e(),
    o(window).on("resize", e),
    o.fn.yith_quick_view(),
    o(document).on(
      "yith_infs_adding_elem yith-wcan-ajax-filtered",
      function () {
        o.fn.yith_quick_view();
      }
    ));
});
