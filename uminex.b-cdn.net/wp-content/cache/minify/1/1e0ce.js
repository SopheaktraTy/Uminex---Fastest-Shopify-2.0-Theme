function _typeof(t) {
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    _typeof(t)
  );
}
!(function (t) {
  "use strict";
  (window.rtWpvsVariationsFromInitialize = function () {
    t(".variations_form").each(function () {
      t(this).wc_variation_form();
    });
  }),
    (t.fn.rtWpvsVariationSwatchesForm = function () {
      return (
        (this._variation_form = t(this)),
        (this.product_variations =
          this._variation_form.data("product_variations")),
        (this._attributeTerms =
          this._variation_form.find(".variations select")),
        (this._is_ajax = !!this.product_variations),
        (this._is_archive =
          this._variation_form.hasClass("rtwpvs-product-loop-variation") ||
          this._variation_form.hasClass("rtwpvs-archive-variation-wrapper")),
        (this._out_of_stock = {}),
        (this._is_mobile = t("body").hasClass("rtwpvs-is-mobile")),
        (this.start = function () {
          var a = this;
          this._variation_form.find(".rtwpvs-terms-wrapper").each(function () {
            var r = t(this),
              i = r.parent().find("select.rtwpvs-wc-select");
            r.on(
              "touchstart click",
              ".rtwpvs-term:not(.rtwpvs-radio-term)",
              function (r) {
                r.preventDefault(), r.stopPropagation();
                var e = t(this),
                  o = e.hasClass("selected"),
                  s = e.data("term");
                o && rtwpvs_params.reselect_clear && (s = ""),
                  i
                    .val(s)
                    .trigger("change")
                    .trigger("click")
                    .trigger("focusin"),
                  a._is_mobile && i.trigger("touchstart"),
                  e.trigger("focus"),
                  o
                    ? e.trigger("rtwpvs-unselected-term", [
                        s,
                        i,
                        this._variation_form,
                      ])
                    : e.trigger("rtwpvs-selected-term", [
                        s,
                        i,
                        this._variation_form,
                      ]);
              }
            ),
              r.on(
                "change",
                "input.rtwpvs-radio-button-term:radio",
                function (r) {
                  r.preventDefault(), r.stopPropagation();
                  var e = t(this),
                    o = e.val(),
                    s = e.parent(".rtwpvs-term.rtwpvs-radio-term"),
                    n = s.hasClass("selected");
                  n && rtwpvs_params.reselect_clear && (o = ""),
                    i
                      .val(o)
                      .trigger("change")
                      .trigger("click")
                      .trigger("focusin"),
                    a._is_mobile && i.trigger("touchstart"),
                    rtwpvs_params.reselect_clear
                      ? n
                        ? _.delay(function () {
                            e.prop("checked", !1),
                              s.trigger("rtwpvs-unselected-term", [
                                o,
                                i,
                                this._variation_form,
                              ]);
                          }, 1)
                        : s.trigger("rtwpvs-selected-term", [
                            o,
                            i,
                            this._variation_form,
                          ])
                      : rtwpvs_params.reselect_clear ||
                        e
                          .parent(".rtwpvs-term.rtwpvs-radio-term")
                          .removeClass("selected disabled")
                          .addClass("selected")
                          .trigger("rtwpvs-selected-term", [
                            o,
                            i,
                            this._variation_form,
                          ]);
                }
              ),
              rtwpvs_params.reselect_clear &&
                r.on(
                  "touchstart click",
                  "input.rtwpvs-radio-button-term:radio",
                  function (a) {
                    a.preventDefault(),
                      a.stopPropagation(),
                      t(this).trigger("change");
                  }
                );
          }),
            setTimeout(function () {
              a._variation_form.trigger("reload_product_variations"),
                a._variation_form.trigger("rtwpvs_loaded", [a]);
            }, 1),
            this.initVariationURL();
        }),
        (this.update_trigger = function () {
          this._variation_form.on(
            "rtwpvs_loaded",
            { that: this },
            this.loaded_triggered
          ),
            this._variation_form.on(
              "woocommerce_update_variation_values",
              this.update_variation_triggered
            ),
            this._variation_form.on(
              "reset_data",
              { that: this },
              this.reset_triggered
            ),
            this._variation_form.on(
              "woocommerce_variation_has_changed",
              { that: this },
              this.variation_has_changed_triggered
            );
        }),
        (this.update_variation_triggered = function (a) {
          t(this)
            .find(".rtwpvs-terms-wrapper")
            .each(function () {
              var a = t(this),
                r = a.parent().find("select.rtwpvs-wc-select"),
                i = r.find("option:selected").val() || "",
                e = r.find("option:selected"),
                o = r.find("option").eq(1),
                s = [];
              r.find("option").each(function () {
                "" !== t(this).val() &&
                  (s.push(t(this).val()), (i = e ? e.val() : o.val()));
              }),
                setTimeout(function () {
                  a.find(".rtwpvs-term").each(function () {
                    var a = t(this),
                      r = a.attr("data-term");
                    a.removeClass("selected disabled").addClass("disabled"),
                      -1 !== s.indexOf(r)
                        ? (a
                            .removeClass("disabled")
                            .find("input.rtwpvs-radio-button-term:radio")
                            .prop("disabled", !1),
                          r === i &&
                            a
                              .addClass("selected")
                              .find("input.rtwpvs-radio-button-term:radio")
                              .prop("checked", !0))
                        : a
                            .find("input.rtwpvs-radio-button-term:radio")
                            .prop("disabled", !0)
                            .prop("checked", !1),
                      r === i &&
                        a
                          .addClass("selected")
                          .find("input.rtwpvs-radio-button-term:radio")
                          .prop("disabled", !1)
                          .prop("checked", !0);
                  }),
                    a.trigger("rtwpvs-terms-updated");
                }, 1);
            });
        }),
        (this.variation_has_changed_triggered = function (a) {
          a.data.that._is_ajax ||
            t(this)
              .find(".rtwpvs-terms-wrapper")
              .each(function () {
                var a = t(this),
                  r = a.parent().find("select.rtwpvs-wc-select"),
                  i = r.find("option:selected").val() || "",
                  e = r.find("option:selected"),
                  o = r.find("option").eq(1),
                  s = [];
                r.find("option").each(function () {
                  "" !== t(this).val() &&
                    (s.push(t(this).val()), (i = e ? e.val() : o.val()));
                }),
                  setTimeout(function () {
                    a.find(".rtwpvs-term").each(function () {
                      var a = t(this),
                        r = a.attr("data-term");
                      a.removeClass("selected disabled"),
                        r === i &&
                          a
                            .addClass("selected")
                            .find("input.rtwpvs-radio-button-term:radio")
                            .prop("disabled", !1)
                            .prop("checked", !0);
                    }),
                      a.trigger("rtwpvs-terms-updated");
                  }, 1);
              });
        }),
        (this.reset_triggered = function (a) {
          a.data.that._is_ajax &&
            t(this)
              .find(".rtwpvs-terms-wrapper")
              .each(function () {
                t(this)
                  .find(".rtwpvs-term")
                  .removeClass("selected disabled")
                  .find("input.rtwpvs-radio-button-term:radio")
                  .prop("disabled", !1)
                  .prop("checked", !1);
              });
        }),
        (this.loaded_triggered = function (a) {
          var r = a.data.that;
          if (r._is_ajax) {
            var i = {};
            ("object" === _typeof(r.product_variations)
              ? r.product_variations
              : JSON.parse(r.product_variations)
            ).map(function (t) {
              t.attributes
                ? Object.keys(t.attributes).map(function (a) {
                    i[a] || (i[a] = []),
                      t.attributes[a] &&
                        -1 === i[a].indexOf(t.attributes[a]) &&
                        i[a].push(t.attributes[a]);
                  })
                : console.log(
                    "variation.attributes Type ",
                    _typeof(t.attributes)
                  );
            }),
              t(a.target)
                .find(".rtwpvs-terms-wrapper")
                .each(function () {
                  var a = t(this).data("attribute_name");
                  t(this)
                    .find(".rtwpvs-term")
                    .each(function () {
                      var r = t(this),
                        e = r.attr("data-term");
                      t.isEmptyObject(i) ||
                        -1 !== i[a].indexOf(e) ||
                        r
                          .removeClass("selected")
                          .addClass("disabled")
                          .find("input.rtwpvs-radio-button-term:radio")
                          .prop("disabled", !0)
                          .prop("checked", !1);
                    });
                });
          }
        }),
        (this.initVariationURL = function () {
          var a = this,
            r = window.location.toString(),
            i = a.closest(".rtwpvs-product");
          if (
            (this._is_archive &&
              (r = i
                .find("a.woocommerce-LoopProduct-link")
                .first()
                .attr("href")),
            r)
          ) {
            var e = new URL(r),
              o = e.searchParams.toString(),
              s = e.origin + e.pathname;
            this._variation_form.on(
              "check_variations.wc-variation-form",
              function (n) {
                var _ = void 0;
                rtwpvs_params.has_wc_bundles
                  ? ((e = new URL(r)),
                    (o = e.searchParams.toString()),
                    (_ = a.getChosenAttributesBundleSupport()))
                  : (_ = a.getChosenAttributes());
                var c = Object.keys(_).reduce(function (t, a) {
                    return _[a] && (t[a] = _[a]), t;
                  }, {}),
                  d = a.urlParamsToObj(o),
                  v = Object.assign({}, d, c),
                  p = t.param(v);
                !a._is_archive &&
                  rtwpvs_params.enable_variation_url &&
                  window.history.pushState({}, "", a.setUrlParams(s, p)),
                  a._is_archive &&
                    rtwpvs_params.enable_archive_variation_url &&
                    i
                      .find("a:not(.rtwpvs_add_to_cart)")
                      .attr("href", a.setUrlParams(s, p));
              }
            );
          }
        }),
        (this.getChosenAttributesBundleSupport = function () {
          var a = {};
          return (
            this._attributeTerms.each(function () {
              var r = t(this).attr("name");
              a[r] = t(this).val() || "";
            }),
            a
          );
        }),
        (this.getChosenAttributes = function () {
          var a = {};
          return (
            this._attributeTerms.each(function () {
              var r = t(this).data("attribute_name") || t(this).attr("name");
              a[r] = t(this).val() || "";
            }),
            a
          );
        }),
        (this.urlParamsToObj = function (t) {
          for (
            var a = Array.from(new URLSearchParams(t).keys()), r = {}, i = 0;
            i < a.length;
            i++
          ) {
            var e = a[i];
            r[e] = new URLSearchParams(t).get(e);
          }
          return r;
        }),
        (this.setUrlParams = function (t, a) {
          if (a) {
            a = (a = a
              .trim()
              .replace(/^(\?|#|&)/, "")
              .replace(/(\?|#|&)$/, ""))
              ? "?" + a
              : a;
            var r = t.split(/[\?\#]/)[0];
            a && /\:\/\/[^\/]*$/.test(r) && (r += "/");
            var i = t.match(/(\#.*)$/);
            (t = r + a), i && (t += i[0]);
          }
          return t;
        }),
        this.start(),
        this.update_trigger(),
        this
      );
    }),
    (t.fn.wc_set_variation_attr = function (t, a) {
      void 0 === this.attr("data-o_" + t) &&
        this.attr("data-o_" + t, this.attr(t) ? this.attr(t) : ""),
        !1 === a ? this.removeAttr(t) : this.attr(t, a);
    }),
    (t.fn.wc_reset_variation_attr = function (t) {
      void 0 !== this.attr("data-o_" + t) &&
        this.attr(t, this.attr("data-o_" + t));
    }),
    (t.fn.rtWpvsVariationSwatchesArchiveForm = function () {
      (this._variation_form = t(this)),
        (this._is_archive =
          this._variation_form.hasClass("rtwpvs-product-loop-variation") ||
          this._variation_form.hasClass("rtwpvs-archive-variation-wrapper")),
        (this.product_variations =
          this._variation_form.data("product_variations")),
        (this._attributeTerms =
          this._variation_form.find(".variations select")),
        (this._is_ajax = !!this.product_variations),
        (this._wrapper = this._variation_form.closest(
          rtwpvs_params.archive_product_wrapper
        )),
        (this._is_mobile = t("body").hasClass("rtwpvs-is-mobile")),
        (this._image = this._wrapper.find(
          rtwpvs_params.archive_image_selector
        )),
        (this._cart_button = this._wrapper.find(
          rtwpvs_params.archive_add_to_cart_button_selector
        )),
        (this._cart_button_ajax = this._wrapper.find(
          ".rtwpvs_ajax_add_to_cart"
        )),
        (this._cart_button_html = this._cart_button.clone().html()),
        (this._price = this._wrapper.find(
          rtwpvs_params.archive_product_price_selector
        )),
        (this._price_html = this._price.clone().html()),
        (this._product_id = this._cart_button.data("product_id")),
        (this.attributeData = {}),
        (this.selectedData = {}),
        t.trim(rtwpvs_params.archive_add_to_cart_button_selector) &&
          ((this._cart_button = this._wrapper.find(
            rtwpvs_params.archive_add_to_cart_button_selector
          )),
          (this._cart_button_ajax = this._wrapper.find(
            rtwpvs_params.archive_add_to_cart_button_selector
          ))),
        (this.resetArchiveVariation = function () {
          var t = this._wrapper.find(".price"),
            a = this._wrapper.find(".added_to_cart"),
            r = this._wrapper.find(".added_to_cart_button");
          t.html(this._price_html),
            this._cart_button.data("variation_id", ""),
            this._cart_button.data("variation", ""),
            rtwpvs_params.archive_swatches_enable_single_attribute ||
              (rtwpvs_params.archive_add_to_cart_select_options
                ? this._cart_button.html(
                    rtwpvs_params.archive_add_to_cart_select_options
                  )
                : wc_add_to_cart_variation_params.i18n_select_options.trim() &&
                  this._cart_button.text(
                    wc_add_to_cart_variation_params.i18n_select_options
                  ),
              "no" ===
                wc_add_to_cart_variation_params.enable_ajax_add_to_cart &&
                this._cart_button.prop(
                  "href",
                  this._cart_button.data("product_permalink")
                )),
            this._cart_button.removeClass("added"),
            a.length > 0 && a.remove(),
            r.length > 0 && r.remove();
        }),
        (this.init_trigger = function () {
          if (this._is_archive) {
            var a = this;
            this._variation_form.on(
              "found_variation.rtwpvs-archive-variation",
              { variationForm: this._variation_form },
              function (r, i) {
                r.stopPropagation(), a.variationsImageUpdate(i);
                var e = "",
                  o = a._wrapper.find(".added_to_cart"),
                  s = a._wrapper.find(".added_to_cart_button"),
                  n = a._wrapper.find(".price");
                if (
                  ((e = (e = (e = (
                    i.variation_is_visible
                      ? wp.template("rtwpvs-variation-template")
                      : wp.template("unavailable-variation-template")
                  )({
                    variation: i,
                    price_html:
                      t(i.price_html).unwrap().html() || a._price_html,
                  })).replace("/*<![CDATA[*/", "")).replace("/*]]>*/", "")),
                  n.html(e),
                  a._cart_button.data("variation_id", i.variation_id),
                  a._cart_button.data("variation", a.getChosenAttributes()),
                  !rtwpvs_params.archive_swatches_enable_single_attribute &&
                    (rtwpvs_params.archive_add_to_cart_text
                      ? a._cart_button.html(
                          rtwpvs_params.archive_add_to_cart_text
                        )
                      : wc_add_to_cart_variation_params.i18n_add_to_cart.trim() &&
                        a._cart_button.text(
                          wc_add_to_cart_variation_params.i18n_add_to_cart
                        ),
                    "no" ===
                      wc_add_to_cart_variation_params.enable_ajax_add_to_cart))
                ) {
                  var _ = t.param(
                    Object.assign(
                      {},
                      {
                        "add-to-cart": a._product_id,
                        variation_id: i.variation_id,
                      }
                    )
                  );
                  a._cart_button.prop(
                    "href",
                    a.setUrlParams(a._cart_button.data("add_to_cart_url"), _)
                  );
                }
                a._cart_button.removeClass("added"),
                  o.length > 0 && o.remove(),
                  s.length > 0 && s.remove();
              }
            ),
              this._variation_form.on(
                "reset_image.rtwpvs-archive-variation",
                { variationForm: this._variation_form },
                function (t) {
                  a.variationsImageUpdate(!1);
                }
              ),
              this._variation_form.on(
                "reset_data.rtwpvs-archive-variation",
                { variationForm: this._variation_form },
                function (t) {
                  a.resetArchiveVariation();
                }
              );
          }
          this._cart_button_ajax.off("click.rtwpvs-archive-add-to-cart"),
            this._cart_button_ajax.on(
              "click.rtwpvs-archive-add-to-cart",
              function (a) {
                var r = t(this);
                if (rtwpvs_params.archive_swatches_enable_single_attribute)
                  return !0;
                if (!r.data("variation_id")) return !0;
                a.preventDefault(),
                  a.stopPropagation(),
                  r.removeClass("added").addClass("loading");
                var i = { action: "rtwpvs_add_variation_to_cart" };
                t.each(r.data(), function (t, a) {
                  i[t] = a;
                }),
                  t(document.body).trigger("adding_to_cart", [r, i]),
                  t.post(
                    wc_add_to_cart_variation_params.ajax_url.toString(),
                    i,
                    function (a) {
                      a &&
                        (a.error && a.product_url
                          ? (window.location = a.product_url)
                          : "yes" !==
                            wc_add_to_cart_params.cart_redirect_after_add
                          ? t(document.body).trigger("added_to_cart", [
                              a.fragments,
                              a.cart_hash,
                              r,
                            ])
                          : (window.location = wc_add_to_cart_params.cart_url));
                    }
                  );
              }
            );
        }),
        (this.setUrlParams = function (t, a) {
          if (a) {
            a = (a = a
              .trim()
              .replace(/^(\?|#|&)/, "")
              .replace(/(\?|#|&)$/, ""))
              ? "?" + a
              : a;
            var r = t.split(/[\?\#]/)[0];
            a && /\:\/\/[^\/]*$/.test(r) && (r += "/");
            var i = t.match(/(\#.*)$/);
            (t = r + a), i && (t += i[0]);
          }
          return t;
        }),
        (this.urlParamsToObj = function (t) {
          for (
            var a = Array.from(new URLSearchParams(t).keys()), r = {}, i = 0;
            i < a.length;
            i++
          ) {
            var e = a[i];
            r[e] = new URLSearchParams(t).get(e);
          }
          return r;
        }),
        (this.init = function () {
          this.init_trigger();
          var a = this;
          _.delay(function () {
            a.setDefaultImages(),
              a._variation_form.trigger("rtwpvs_archive_init", [
                a,
                a.product_variations,
              ]),
              t(document).trigger("rtwpvs_archive_init_loaded", [
                a._variation_form,
                a.product_variations,
              ]);
          }, 2);
        }),
        (this.setDefaultImages = function () {
          var a = this;
          _.delay(function () {
            a._variation_form
              .find(".rtwpvs-terms-wrapper > .rtwpvs-term:not(.disabled)")
              .each(function (r, i) {
                t(this).off("rtwpvs-selected-item.archive-image-hover"),
                  t(this).off("rtwpvs-selected-item.archive-image-click"),
                  t(this).off("mouseenter.archive-image-hover"),
                  t(this).off("mouseleave.archive-image-hover"),
                  "hover" === rtwpvs_params.archive_swatches_display_event &&
                    t(this).on("mouseenter.archive-image-hover", function (r) {
                      r.stopPropagation(),
                        t(this).trigger("click").trigger("focusin"),
                        a._is_mobile && t(this).trigger("touchstart");
                    });
              });
          }, 2);
        }),
        (this.variationsImageUpdate = function (a) {
          var r = this._wrapper.find(rtwpvs_params.archive_image_selector);
          r
            .addClass("rtwpvs-image-load")
            .one(
              "webkitAnimationEnd oanimationend msAnimationEnd animationend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
              function () {
                t(this).removeClass("rtwpvs-image-load");
              }
            ),
            a && a.image && a.image.thumb_src && a.image.thumb_src.length > 1
              ? (r.wc_set_variation_attr("src", a.image.thumb_src),
                r.wc_set_variation_attr("height", a.image.thumb_src_h),
                r.wc_set_variation_attr("width", a.image.thumb_src_w),
                r.wc_set_variation_attr("srcset", a.image.thumb_srcset),
                r.wc_set_variation_attr("sizes", a.image.thumb_sizes),
                r.wc_set_variation_attr("title", a.image.title),
                r.wc_set_variation_attr("alt", a.image.alt))
              : (r.wc_reset_variation_attr("src"),
                r.wc_reset_variation_attr("width"),
                r.wc_reset_variation_attr("height"),
                r.wc_reset_variation_attr("srcset"),
                r.wc_reset_variation_attr("sizes"),
                r.wc_reset_variation_attr("title"),
                r.wc_reset_variation_attr("alt"));
        }),
        (this.isMatch = function (t, a) {
          var r = !0;
          for (var i in t)
            if (t.hasOwnProperty(i)) {
              var e = t[i],
                o = a[i];
              void 0 !== e &&
                void 0 !== o &&
                0 !== e.length &&
                0 !== o.length &&
                e !== o &&
                (r = !1);
            }
          return r;
        }),
        (this.findMatchingVariations = function (t, a) {
          for (var r = [], i = 0; i < t.length; i++) {
            var e = t[i];
            this.isMatch(e.attributes, a) && r.push(e);
          }
          return r;
        }),
        (this.getChosenAttributes = function () {
          var a = {};
          return (
            this._attributeTerms.each(function () {
              var r = t(this).data("attribute_name") || t(this).attr("name");
              a[r] = t(this).val() || "";
            }),
            a
          );
        }),
        this.init(),
        t(document).trigger("rtwpvs_archive", [this._variation_form]);
    }),
    (window.rtWpvsLoadArchiveVariations = function () {
      if (rtwpvs_params.enable_ajax_archive_variation)
        for (
          var a = document.querySelectorAll(
              ".rtwpvs-archive-variation-wrapper:not(.rtwpvs_av_loaded):not(.rtwpvs_av_loading)"
            ),
            r = 0;
          r < a.length;
          r++
        ) {
          new IntersectionObserver(i, {
            root: null,
            rootMargin: "0px",
            threshold: 0,
          }).observe(a[r]);
        }
      function i(a, r) {
        a.forEach(function (a) {
          if (a.isIntersecting) {
            var i = a.target,
              e = t(i);
            if (
              !i.classList.contains("rtwpvs_av_loading") ||
              !i.classList.contains("rtwpvs_av_loaded")
            ) {
              var o = parseInt(i.getAttribute("data-product_id"), 10),
                s = JSON.parse(i.getAttribute("data-product_variations"));
              rtwpvs_params.enable_ajax_archive_variation &&
                !1 === s &&
                o &&
                t.ajax({
                  type: "POST",
                  url: rtwpvs_params.ajax_url,
                  data: {
                    action: "rtwpvs_load_product_variation",
                    rtwpvs_nonce: rtwpvs_params.nonce,
                    product_id: o,
                  },
                  beforeSend: function () {
                    i.classList.add("rtwpvs_av_loading");
                  },
                  success: function (a) {
                    a.success &&
                      (i.classList.add("rtwpvs_av_loaded"),
                      t(i).data("product_variations", a.data),
                      setTimeout(function () {
                        e.on("wc_variation_form", function () {
                          t(this).rtWpvsVariationSwatchesForm(),
                            t(this).rtWpvsVariationSwatchesArchiveForm();
                        }).wc_variation_form();
                      }, 100));
                  },
                  error: function () {
                    console.error("Error Loading Data...");
                  },
                  complete: function () {
                    e.removeClass("rtwpvs_av_loading");
                  },
                });
            }
            r.unobserve(i);
          }
        });
      }
    }),
    (window.rtWpvsWithoutAjaxVariations = function () {
      if (!rtwpvs_params.enable_ajax_archive_variation) {
        var a = t(".variations_form").hasClass("rtwpvs-product-loop-variation")
          ? ".variations_form.rtwpvs-product-loop-variation"
          : ".variations_form.rtwpvs-archive-variation-wrapper";
        t(document).on("wc_variation_form", a, function () {
          t(this).rtWpvsVariationSwatchesForm(),
            t(this).rtWpvsVariationSwatchesArchiveForm();
        }),
          t(document).on(
            "yith_infs_added_elem yith-wcan-ajax-filtered post-load quick-view-displayed wood-images-loaded astraInfinitePaginationLoaded berocket_ajax_products_loaded facetwp-loaded",
            function () {
              rtWpvsVariationsFromInitialize();
            }
          ),
          t(".shop-container .products").on(
            "append.infiniteScroll",
            function (t, a, r) {
              rtWpvsVariationsFromInitialize();
            }
          ),
          t("body").on("aln_reloaded", function () {
            _.delay(function () {
              rtWpvsVariationsFromInitialize();
            }, 100);
          }),
          t(document.body).on("konte_products_loaded", function () {
            rtWpvsVariationsFromInitialize();
          });
      }
    }),
    (window.rtWpvsWithAjaxVariations = function () {
      rtwpvs_params.enable_ajax_archive_variation &&
        (t(document).on(
          "yith_infs_added_elem yith-wcan-ajax-filtered post-load quick-view-displayed wood-images-loaded astraInfinitePaginationLoaded berocket_ajax_products_loaded facetwp-loaded",
          function () {
            rtWpvsLoadArchiveVariations();
          }
        ),
        t(".shop-container .products").on(
          "append.infiniteScroll",
          function (t, a, r) {
            rtWpvsLoadArchiveVariations();
          }
        ),
        t("body").on("aln_reloaded", function () {
          _.delay(function () {
            rtWpvsLoadArchiveVariations();
          }, 100);
        }),
        t(document.body).on("konte_products_loaded", function () {
          rtWpvsLoadArchiveVariations();
        }));
    }),
    rtWpvsWithoutAjaxVariations(),
    rtWpvsWithAjaxVariations(),
    t(document).ready(function () {
      rtWpvsLoadArchiveVariations();
    }),
    t(document).on("wc_variation_form", ".variations_form.cart", function () {
      t(this).rtWpvsVariationSwatchesForm();
    }),
    t("body").on("click", ".rtwpvs-details-term-more", function () {
      var a = t(this);
      a.parents(".rtwpvs-terms-wrapper").removeClass("has-more-variation"),
        a.remove();
    });
})(
  jQuery
); /* Chosen v1.8.7 | (c) 2011-2018 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */

(function () {
  var t,
    e,
    s,
    i,
    n = function (t, e) {
      return function () {
        return t.apply(e, arguments);
      };
    },
    r = function (t, e) {
      function s() {
        this.constructor = t;
      }
      for (var i in e) o.call(e, i) && (t[i] = e[i]);
      return (
        (s.prototype = e.prototype),
        (t.prototype = new s()),
        (t.__super__ = e.prototype),
        t
      );
    },
    o = {}.hasOwnProperty;
  ((i = (function () {
    function t() {
      (this.options_index = 0), (this.parsed = []);
    }
    return (
      (t.prototype.add_node = function (t) {
        return "OPTGROUP" === t.nodeName.toUpperCase()
          ? this.add_group(t)
          : this.add_option(t);
      }),
      (t.prototype.add_group = function (t) {
        var e, s, i, n, r, o;
        for (
          e = this.parsed.length,
            this.parsed.push({
              array_index: e,
              group: !0,
              label: t.label,
              title: t.title ? t.title : void 0,
              children: 0,
              disabled: t.disabled,
              classes: t.className,
            }),
            o = [],
            s = 0,
            i = (r = t.childNodes).length;
          s < i;
          s++
        )
          (n = r[s]), o.push(this.add_option(n, e, t.disabled));
        return o;
      }),
      (t.prototype.add_option = function (t, e, s) {
        if ("OPTION" === t.nodeName.toUpperCase())
          return (
            "" !== t.text
              ? (null != e && (this.parsed[e].children += 1),
                this.parsed.push({
                  array_index: this.parsed.length,
                  options_index: this.options_index,
                  value: t.value,
                  text: t.text,
                  html: t.innerHTML,
                  title: t.title ? t.title : void 0,
                  selected: t.selected,
                  disabled: !0 === s ? s : t.disabled,
                  group_array_index: e,
                  group_label: null != e ? this.parsed[e].label : null,
                  classes: t.className,
                  style: t.style.cssText,
                }))
              : this.parsed.push({
                  array_index: this.parsed.length,
                  options_index: this.options_index,
                  empty: !0,
                }),
            (this.options_index += 1)
          );
      }),
      t
    );
  })()).select_to_array = function (t) {
    var e, s, n, r, o;
    for (r = new i(), s = 0, n = (o = t.childNodes).length; s < n; s++)
      (e = o[s]), r.add_node(e);
    return r.parsed;
  }),
    (e = (function () {
      function t(e, s) {
        (this.form_field = e),
          (this.options = null != s ? s : {}),
          (this.label_click_handler = n(this.label_click_handler, this)),
          t.browser_is_supported() &&
            ((this.is_multiple = this.form_field.multiple),
            this.set_default_text(),
            this.set_default_values(),
            this.setup(),
            this.set_up_html(),
            this.register_observers(),
            this.on_ready());
      }
      return (
        (t.prototype.set_default_values = function () {
          return (
            (this.click_test_action = (function (t) {
              return function (e) {
                return t.test_active_click(e);
              };
            })(this)),
            (this.activate_action = (function (t) {
              return function (e) {
                return t.activate_field(e);
              };
            })(this)),
            (this.active_field = !1),
            (this.mouse_on_container = !1),
            (this.results_showing = !1),
            (this.result_highlighted = null),
            (this.is_rtl =
              this.options.rtl ||
              /\bchosen-rtl\b/.test(this.form_field.className)),
            (this.allow_single_deselect =
              null != this.options.allow_single_deselect &&
              null != this.form_field.options[0] &&
              "" === this.form_field.options[0].text &&
              this.options.allow_single_deselect),
            (this.disable_search_threshold =
              this.options.disable_search_threshold || 0),
            (this.disable_search = this.options.disable_search || !1),
            (this.enable_split_word_search =
              null == this.options.enable_split_word_search ||
              this.options.enable_split_word_search),
            (this.group_search =
              null == this.options.group_search || this.options.group_search),
            (this.search_contains = this.options.search_contains || !1),
            (this.single_backstroke_delete =
              null == this.options.single_backstroke_delete ||
              this.options.single_backstroke_delete),
            (this.max_selected_options =
              this.options.max_selected_options || Infinity),
            (this.inherit_select_classes =
              this.options.inherit_select_classes || !1),
            (this.display_selected_options =
              null == this.options.display_selected_options ||
              this.options.display_selected_options),
            (this.display_disabled_options =
              null == this.options.display_disabled_options ||
              this.options.display_disabled_options),
            (this.include_group_label_in_selected =
              this.options.include_group_label_in_selected || !1),
            (this.max_shown_results =
              this.options.max_shown_results || Number.POSITIVE_INFINITY),
            (this.case_sensitive_search =
              this.options.case_sensitive_search || !1),
            (this.hide_results_on_select =
              null == this.options.hide_results_on_select ||
              this.options.hide_results_on_select)
          );
        }),
        (t.prototype.set_default_text = function () {
          return (
            this.form_field.getAttribute("data-placeholder")
              ? (this.default_text =
                  this.form_field.getAttribute("data-placeholder"))
              : this.is_multiple
              ? (this.default_text =
                  this.options.placeholder_text_multiple ||
                  this.options.placeholder_text ||
                  t.default_multiple_text)
              : (this.default_text =
                  this.options.placeholder_text_single ||
                  this.options.placeholder_text ||
                  t.default_single_text),
            (this.default_text = this.escape_html(this.default_text)),
            (this.results_none_found =
              this.form_field.getAttribute("data-no_results_text") ||
              this.options.no_results_text ||
              t.default_no_result_text)
          );
        }),
        (t.prototype.choice_label = function (t) {
          return this.include_group_label_in_selected && null != t.group_label
            ? "<b class='group-name'>" +
                this.escape_html(t.group_label) +
                "</b>" +
                t.html
            : t.html;
        }),
        (t.prototype.mouse_enter = function () {
          return (this.mouse_on_container = !0);
        }),
        (t.prototype.mouse_leave = function () {
          return (this.mouse_on_container = !1);
        }),
        (t.prototype.input_focus = function (t) {
          if (this.is_multiple) {
            if (!this.active_field)
              return setTimeout(
                (function (t) {
                  return function () {
                    return t.container_mousedown();
                  };
                })(this),
                50
              );
          } else if (!this.active_field) return this.activate_field();
        }),
        (t.prototype.input_blur = function (t) {
          if (!this.mouse_on_container)
            return (
              (this.active_field = !1),
              setTimeout(
                (function (t) {
                  return function () {
                    return t.blur_test();
                  };
                })(this),
                100
              )
            );
        }),
        (t.prototype.label_click_handler = function (t) {
          return this.is_multiple
            ? this.container_mousedown(t)
            : this.activate_field();
        }),
        (t.prototype.results_option_build = function (t) {
          var e, s, i, n, r, o, h;
          for (
            e = "", h = 0, n = 0, r = (o = this.results_data).length;
            n < r &&
            ((s = o[n]),
            (i = ""),
            "" !==
              (i = s.group
                ? this.result_add_group(s)
                : this.result_add_option(s)) && (h++, (e += i)),
            (null != t ? t.first : void 0) &&
              (s.selected && this.is_multiple
                ? this.choice_build(s)
                : s.selected &&
                  !this.is_multiple &&
                  this.single_set_selected_text(this.choice_label(s))),
            !(h >= this.max_shown_results));
            n++
          );
          return e;
        }),
        (t.prototype.result_add_option = function (t) {
          var e, s;
          return t.search_match && this.include_option_in_results(t)
            ? ((e = []),
              t.disabled ||
                (t.selected && this.is_multiple) ||
                e.push("active-result"),
              !t.disabled ||
                (t.selected && this.is_multiple) ||
                e.push("disabled-result"),
              t.selected && e.push("result-selected"),
              null != t.group_array_index && e.push("group-option"),
              "" !== t.classes && e.push(t.classes),
              (s = document.createElement("li")),
              (s.className = e.join(" ")),
              t.style && (s.style.cssText = t.style),
              s.setAttribute("data-option-array-index", t.array_index),
              (s.innerHTML = t.highlighted_html || t.html),
              t.title && (s.title = t.title),
              this.outerHTML(s))
            : "";
        }),
        (t.prototype.result_add_group = function (t) {
          var e, s;
          return (t.search_match || t.group_match) && t.active_options > 0
            ? ((e = []).push("group-result"),
              t.classes && e.push(t.classes),
              (s = document.createElement("li")),
              (s.className = e.join(" ")),
              (s.innerHTML = t.highlighted_html || this.escape_html(t.label)),
              t.title && (s.title = t.title),
              this.outerHTML(s))
            : "";
        }),
        (t.prototype.results_update_field = function () {
          if (
            (this.set_default_text(),
            this.is_multiple || this.results_reset_cleanup(),
            this.result_clear_highlight(),
            this.results_build(),
            this.results_showing)
          )
            return this.winnow_results();
        }),
        (t.prototype.reset_single_select_options = function () {
          var t, e, s, i, n;
          for (n = [], t = 0, e = (s = this.results_data).length; t < e; t++)
            (i = s[t]).selected ? n.push((i.selected = !1)) : n.push(void 0);
          return n;
        }),
        (t.prototype.results_toggle = function () {
          return this.results_showing
            ? this.results_hide()
            : this.results_show();
        }),
        (t.prototype.results_search = function (t) {
          return this.results_showing
            ? this.winnow_results()
            : this.results_show();
        }),
        (t.prototype.winnow_results = function (t) {
          var e, s, i, n, r, o, h, l, c, _, a, u, d, p, f;
          for (
            this.no_results_clear(),
              _ = 0,
              e = (h = this.get_search_text()).replace(
                /[-[\]{}()*+?.,\\^$|#\s]/g,
                "\\$&"
              ),
              c = this.get_search_regex(e),
              i = 0,
              n = (l = this.results_data).length;
            i < n;
            i++
          )
            ((r = l[i]).search_match = !1),
              (a = null),
              (u = null),
              (r.highlighted_html = ""),
              this.include_option_in_results(r) &&
                (r.group && ((r.group_match = !1), (r.active_options = 0)),
                null != r.group_array_index &&
                  this.results_data[r.group_array_index] &&
                  (0 ===
                    (a = this.results_data[r.group_array_index])
                      .active_options &&
                    a.search_match &&
                    (_ += 1),
                  (a.active_options += 1)),
                (f = r.group ? r.label : r.text),
                (r.group && !this.group_search) ||
                  ((u = this.search_string_match(f, c)),
                  (r.search_match = null != u),
                  r.search_match && !r.group && (_ += 1),
                  r.search_match
                    ? (h.length &&
                        ((d = u.index),
                        (o = f.slice(0, d)),
                        (s = f.slice(d, d + h.length)),
                        (p = f.slice(d + h.length)),
                        (r.highlighted_html =
                          this.escape_html(o) +
                          "<em>" +
                          this.escape_html(s) +
                          "</em>" +
                          this.escape_html(p))),
                      null != a && (a.group_match = !0))
                    : null != r.group_array_index &&
                      this.results_data[r.group_array_index].search_match &&
                      (r.search_match = !0)));
          return (
            this.result_clear_highlight(),
            _ < 1 && h.length
              ? (this.update_results_content(""), this.no_results(h))
              : (this.update_results_content(this.results_option_build()),
                (null != t ? t.skip_highlight : void 0)
                  ? void 0
                  : this.winnow_results_set_highlight())
          );
        }),
        (t.prototype.get_search_regex = function (t) {
          var e, s;
          return (
            (s = this.search_contains ? t : "(^|\\s|\\b)" + t + "[^\\s]*"),
            this.enable_split_word_search ||
              this.search_contains ||
              (s = "^" + s),
            (e = this.case_sensitive_search ? "" : "i"),
            new RegExp(s, e)
          );
        }),
        (t.prototype.search_string_match = function (t, e) {
          var s;
          return (
            (s = e.exec(t)),
            !this.search_contains &&
              (null != s ? s[1] : void 0) &&
              (s.index += 1),
            s
          );
        }),
        (t.prototype.choices_count = function () {
          var t, e, s;
          if (null != this.selected_option_count)
            return this.selected_option_count;
          for (
            this.selected_option_count = 0,
              t = 0,
              e = (s = this.form_field.options).length;
            t < e;
            t++
          )
            s[t].selected && (this.selected_option_count += 1);
          return this.selected_option_count;
        }),
        (t.prototype.choices_click = function (t) {
          if (
            (t.preventDefault(),
            this.activate_field(),
            !this.results_showing && !this.is_disabled)
          )
            return this.results_show();
        }),
        (t.prototype.keydown_checker = function (t) {
          var e, s;
          switch (
            ((s = null != (e = t.which) ? e : t.keyCode),
            this.search_field_scale(),
            8 !== s && this.pending_backstroke && this.clear_backstroke(),
            s)
          ) {
            case 8:
              this.backstroke_length = this.get_search_field_value().length;
              break;
            case 9:
              this.results_showing &&
                !this.is_multiple &&
                this.result_select(t),
                (this.mouse_on_container = !1);
              break;
            case 13:
            case 27:
              this.results_showing && t.preventDefault();
              break;
            case 32:
              this.disable_search && t.preventDefault();
              break;
            case 38:
              t.preventDefault(), this.keyup_arrow();
              break;
            case 40:
              t.preventDefault(), this.keydown_arrow();
          }
        }),
        (t.prototype.keyup_checker = function (t) {
          var e, s;
          switch (
            ((s = null != (e = t.which) ? e : t.keyCode),
            this.search_field_scale(),
            s)
          ) {
            case 8:
              this.is_multiple &&
              this.backstroke_length < 1 &&
              this.choices_count() > 0
                ? this.keydown_backstroke()
                : this.pending_backstroke ||
                  (this.result_clear_highlight(), this.results_search());
              break;
            case 13:
              t.preventDefault(), this.results_showing && this.result_select(t);
              break;
            case 27:
              this.results_showing && this.results_hide();
              break;
            case 9:
            case 16:
            case 17:
            case 18:
            case 38:
            case 40:
            case 91:
              break;
            default:
              this.results_search();
          }
        }),
        (t.prototype.clipboard_event_checker = function (t) {
          if (!this.is_disabled)
            return setTimeout(
              (function (t) {
                return function () {
                  return t.results_search();
                };
              })(this),
              50
            );
        }),
        (t.prototype.container_width = function () {
          return null != this.options.width
            ? this.options.width
            : this.form_field.offsetWidth + "px";
        }),
        (t.prototype.include_option_in_results = function (t) {
          return (
            !(
              this.is_multiple &&
              !this.display_selected_options &&
              t.selected
            ) &&
            !(!this.display_disabled_options && t.disabled) &&
            !t.empty
          );
        }),
        (t.prototype.search_results_touchstart = function (t) {
          return (this.touch_started = !0), this.search_results_mouseover(t);
        }),
        (t.prototype.search_results_touchmove = function (t) {
          return (this.touch_started = !1), this.search_results_mouseout(t);
        }),
        (t.prototype.search_results_touchend = function (t) {
          if (this.touch_started) return this.search_results_mouseup(t);
        }),
        (t.prototype.outerHTML = function (t) {
          var e;
          return t.outerHTML
            ? t.outerHTML
            : ((e = document.createElement("div")).appendChild(t), e.innerHTML);
        }),
        (t.prototype.get_single_html = function () {
          return (
            '<a class="chosen-single chosen-default">\n  <span>' +
            this.default_text +
            '</span>\n  <div><b></b></div>\n</a>\n<div class="chosen-drop">\n  <div class="chosen-search">\n    <input class="chosen-search-input" type="text" autocomplete="off" />\n  </div>\n  <ul class="chosen-results"></ul>\n</div>'
          );
        }),
        (t.prototype.get_multi_html = function () {
          return (
            '<ul class="chosen-choices">\n  <li class="search-field">\n    <input class="chosen-search-input" type="text" autocomplete="off" value="' +
            this.default_text +
            '" />\n  </li>\n</ul>\n<div class="chosen-drop">\n  <ul class="chosen-results"></ul>\n</div>'
          );
        }),
        (t.prototype.get_no_results_html = function (t) {
          return (
            '<li class="no-results">\n  ' +
            this.results_none_found +
            " <span>" +
            this.escape_html(t) +
            "</span>\n</li>"
          );
        }),
        (t.browser_is_supported = function () {
          return "Microsoft Internet Explorer" === window.navigator.appName
            ? document.documentMode >= 8
            : !(
                /iP(od|hone)/i.test(window.navigator.userAgent) ||
                /IEMobile/i.test(window.navigator.userAgent) ||
                /Windows Phone/i.test(window.navigator.userAgent) ||
                /BlackBerry/i.test(window.navigator.userAgent) ||
                /BB10/i.test(window.navigator.userAgent) ||
                /Android.*Mobile/i.test(window.navigator.userAgent)
              );
        }),
        (t.default_multiple_text = "Select Some Options"),
        (t.default_single_text = "Select an Option"),
        (t.default_no_result_text = "No results match"),
        t
      );
    })()),
    (t = jQuery).fn.extend({
      chosen: function (i) {
        return e.browser_is_supported()
          ? this.each(function (e) {
              var n, r;
              (r = (n = t(this)).data("chosen")),
                "destroy" !== i
                  ? r instanceof s || n.data("chosen", new s(this, i))
                  : r instanceof s && r.destroy();
            })
          : this;
      },
    }),
    (s = (function (s) {
      function n() {
        return n.__super__.constructor.apply(this, arguments);
      }
      return (
        r(n, e),
        (n.prototype.setup = function () {
          return (
            (this.form_field_jq = t(this.form_field)),
            (this.current_selectedIndex = this.form_field.selectedIndex)
          );
        }),
        (n.prototype.set_up_html = function () {
          var e, s;
          return (
            (e = ["chosen-container"]).push(
              "chosen-container-" + (this.is_multiple ? "multi" : "single")
            ),
            this.inherit_select_classes &&
              this.form_field.className &&
              e.push(this.form_field.className),
            this.is_rtl && e.push("chosen-rtl"),
            (s = { class: e.join(" "), title: this.form_field.title }),
            this.form_field.id.length &&
              (s.id = this.form_field.id.replace(/[^\w]/g, "_") + "_chosen"),
            (this.container = t("<div />", s)),
            this.container.width(this.container_width()),
            this.is_multiple
              ? this.container.html(this.get_multi_html())
              : this.container.html(this.get_single_html()),
            this.form_field_jq.hide().after(this.container),
            (this.dropdown = this.container.find("div.chosen-drop").first()),
            (this.search_field = this.container.find("input").first()),
            (this.search_results = this.container
              .find("ul.chosen-results")
              .first()),
            this.search_field_scale(),
            (this.search_no_results = this.container
              .find("li.no-results")
              .first()),
            this.is_multiple
              ? ((this.search_choices = this.container
                  .find("ul.chosen-choices")
                  .first()),
                (this.search_container = this.container
                  .find("li.search-field")
                  .first()))
              : ((this.search_container = this.container
                  .find("div.chosen-search")
                  .first()),
                (this.selected_item = this.container
                  .find(".chosen-single")
                  .first())),
            this.results_build(),
            this.set_tab_index(),
            this.set_label_behavior()
          );
        }),
        (n.prototype.on_ready = function () {
          return this.form_field_jq.trigger("chosen:ready", { chosen: this });
        }),
        (n.prototype.register_observers = function () {
          return (
            this.container.on(
              "touchstart.chosen",
              (function (t) {
                return function (e) {
                  t.container_mousedown(e);
                };
              })(this)
            ),
            this.container.on(
              "touchend.chosen",
              (function (t) {
                return function (e) {
                  t.container_mouseup(e);
                };
              })(this)
            ),
            this.container.on(
              "mousedown.chosen",
              (function (t) {
                return function (e) {
                  t.container_mousedown(e);
                };
              })(this)
            ),
            this.container.on(
              "mouseup.chosen",
              (function (t) {
                return function (e) {
                  t.container_mouseup(e);
                };
              })(this)
            ),
            this.container.on(
              "mouseenter.chosen",
              (function (t) {
                return function (e) {
                  t.mouse_enter(e);
                };
              })(this)
            ),
            this.container.on(
              "mouseleave.chosen",
              (function (t) {
                return function (e) {
                  t.mouse_leave(e);
                };
              })(this)
            ),
            this.search_results.on(
              "mouseup.chosen",
              (function (t) {
                return function (e) {
                  t.search_results_mouseup(e);
                };
              })(this)
            ),
            this.search_results.on(
              "mouseover.chosen",
              (function (t) {
                return function (e) {
                  t.search_results_mouseover(e);
                };
              })(this)
            ),
            this.search_results.on(
              "mouseout.chosen",
              (function (t) {
                return function (e) {
                  t.search_results_mouseout(e);
                };
              })(this)
            ),
            this.search_results.on(
              "mousewheel.chosen DOMMouseScroll.chosen",
              (function (t) {
                return function (e) {
                  t.search_results_mousewheel(e);
                };
              })(this)
            ),
            this.search_results.on(
              "touchstart.chosen",
              (function (t) {
                return function (e) {
                  t.search_results_touchstart(e);
                };
              })(this)
            ),
            this.search_results.on(
              "touchmove.chosen",
              (function (t) {
                return function (e) {
                  t.search_results_touchmove(e);
                };
              })(this)
            ),
            this.search_results.on(
              "touchend.chosen",
              (function (t) {
                return function (e) {
                  t.search_results_touchend(e);
                };
              })(this)
            ),
            this.form_field_jq.on(
              "chosen:updated.chosen",
              (function (t) {
                return function (e) {
                  t.results_update_field(e);
                };
              })(this)
            ),
            this.form_field_jq.on(
              "chosen:activate.chosen",
              (function (t) {
                return function (e) {
                  t.activate_field(e);
                };
              })(this)
            ),
            this.form_field_jq.on(
              "chosen:open.chosen",
              (function (t) {
                return function (e) {
                  t.container_mousedown(e);
                };
              })(this)
            ),
            this.form_field_jq.on(
              "chosen:close.chosen",
              (function (t) {
                return function (e) {
                  t.close_field(e);
                };
              })(this)
            ),
            this.search_field.on(
              "blur.chosen",
              (function (t) {
                return function (e) {
                  t.input_blur(e);
                };
              })(this)
            ),
            this.search_field.on(
              "keyup.chosen",
              (function (t) {
                return function (e) {
                  t.keyup_checker(e);
                };
              })(this)
            ),
            this.search_field.on(
              "keydown.chosen",
              (function (t) {
                return function (e) {
                  t.keydown_checker(e);
                };
              })(this)
            ),
            this.search_field.on(
              "focus.chosen",
              (function (t) {
                return function (e) {
                  t.input_focus(e);
                };
              })(this)
            ),
            this.search_field.on(
              "cut.chosen",
              (function (t) {
                return function (e) {
                  t.clipboard_event_checker(e);
                };
              })(this)
            ),
            this.search_field.on(
              "paste.chosen",
              (function (t) {
                return function (e) {
                  t.clipboard_event_checker(e);
                };
              })(this)
            ),
            this.is_multiple
              ? this.search_choices.on(
                  "click.chosen",
                  (function (t) {
                    return function (e) {
                      t.choices_click(e);
                    };
                  })(this)
                )
              : this.container.on("click.chosen", function (t) {
                  t.preventDefault();
                })
          );
        }),
        (n.prototype.destroy = function () {
          return (
            t(this.container[0].ownerDocument).off(
              "click.chosen",
              this.click_test_action
            ),
            this.form_field_label.length > 0 &&
              this.form_field_label.off("click.chosen"),
            this.search_field[0].tabIndex &&
              (this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex),
            this.container.remove(),
            this.form_field_jq.removeData("chosen"),
            this.form_field_jq.show()
          );
        }),
        (n.prototype.search_field_disabled = function () {
          return (
            (this.is_disabled =
              this.form_field.disabled ||
              this.form_field_jq.parents("fieldset").is(":disabled")),
            this.container.toggleClass("chosen-disabled", this.is_disabled),
            (this.search_field[0].disabled = this.is_disabled),
            this.is_multiple ||
              this.selected_item.off("focus.chosen", this.activate_field),
            this.is_disabled
              ? this.close_field()
              : this.is_multiple
              ? void 0
              : this.selected_item.on("focus.chosen", this.activate_field)
          );
        }),
        (n.prototype.container_mousedown = function (e) {
          var s;
          if (!this.is_disabled)
            return (
              !e ||
                ("mousedown" !== (s = e.type) && "touchstart" !== s) ||
                this.results_showing ||
                e.preventDefault(),
              null != e && t(e.target).hasClass("search-choice-close")
                ? void 0
                : (this.active_field
                    ? this.is_multiple ||
                      !e ||
                      (t(e.target)[0] !== this.selected_item[0] &&
                        !t(e.target).parents("a.chosen-single").length) ||
                      (e.preventDefault(), this.results_toggle())
                    : (this.is_multiple && this.search_field.val(""),
                      t(this.container[0].ownerDocument).on(
                        "click.chosen",
                        this.click_test_action
                      ),
                      this.results_show()),
                  this.activate_field())
            );
        }),
        (n.prototype.container_mouseup = function (t) {
          if ("ABBR" === t.target.nodeName && !this.is_disabled)
            return this.results_reset(t);
        }),
        (n.prototype.search_results_mousewheel = function (t) {
          var e;
          if (
            (t.originalEvent &&
              (e =
                t.originalEvent.deltaY ||
                -t.originalEvent.wheelDelta ||
                t.originalEvent.detail),
            null != e)
          )
            return (
              t.preventDefault(),
              "DOMMouseScroll" === t.type && (e *= 40),
              this.search_results.scrollTop(e + this.search_results.scrollTop())
            );
        }),
        (n.prototype.blur_test = function (t) {
          if (
            !this.active_field &&
            this.container.hasClass("chosen-container-active")
          )
            return this.close_field();
        }),
        (n.prototype.close_field = function () {
          return (
            t(this.container[0].ownerDocument).off(
              "click.chosen",
              this.click_test_action
            ),
            (this.active_field = !1),
            this.results_hide(),
            this.container.removeClass("chosen-container-active"),
            this.clear_backstroke(),
            this.show_search_field_default(),
            this.search_field_scale(),
            this.search_field.blur()
          );
        }),
        (n.prototype.activate_field = function () {
          if (!this.is_disabled)
            return (
              this.container.addClass("chosen-container-active"),
              (this.active_field = !0),
              this.search_field.val(this.search_field.val()),
              this.search_field.focus()
            );
        }),
        (n.prototype.test_active_click = function (e) {
          var s;
          return (s = t(e.target).closest(".chosen-container")).length &&
            this.container[0] === s[0]
            ? (this.active_field = !0)
            : this.close_field();
        }),
        (n.prototype.results_build = function () {
          return (
            (this.parsing = !0),
            (this.selected_option_count = null),
            (this.results_data = i.select_to_array(this.form_field)),
            this.is_multiple
              ? this.search_choices.find("li.search-choice").remove()
              : (this.single_set_selected_text(),
                this.disable_search ||
                this.form_field.options.length <= this.disable_search_threshold
                  ? ((this.search_field[0].readOnly = !0),
                    this.container.addClass("chosen-container-single-nosearch"))
                  : ((this.search_field[0].readOnly = !1),
                    this.container.removeClass(
                      "chosen-container-single-nosearch"
                    ))),
            this.update_results_content(
              this.results_option_build({ first: !0 })
            ),
            this.search_field_disabled(),
            this.show_search_field_default(),
            this.search_field_scale(),
            (this.parsing = !1)
          );
        }),
        (n.prototype.result_do_highlight = function (t) {
          var e, s, i, n, r;
          if (t.length) {
            if (
              (this.result_clear_highlight(),
              (this.result_highlight = t),
              this.result_highlight.addClass("highlighted"),
              (i = parseInt(this.search_results.css("maxHeight"), 10)),
              (r = this.search_results.scrollTop()),
              (n = i + r),
              (s =
                this.result_highlight.position().top +
                this.search_results.scrollTop()),
              (e = s + this.result_highlight.outerHeight()) >= n)
            )
              return this.search_results.scrollTop(e - i > 0 ? e - i : 0);
            if (s < r) return this.search_results.scrollTop(s);
          }
        }),
        (n.prototype.result_clear_highlight = function () {
          return (
            this.result_highlight &&
              this.result_highlight.removeClass("highlighted"),
            (this.result_highlight = null)
          );
        }),
        (n.prototype.results_show = function () {
          return this.is_multiple &&
            this.max_selected_options <= this.choices_count()
            ? (this.form_field_jq.trigger("chosen:maxselected", {
                chosen: this,
              }),
              !1)
            : (this.container.addClass("chosen-with-drop"),
              (this.results_showing = !0),
              this.search_field.focus(),
              this.search_field.val(this.get_search_field_value()),
              this.winnow_results(),
              this.form_field_jq.trigger("chosen:showing_dropdown", {
                chosen: this,
              }));
        }),
        (n.prototype.update_results_content = function (t) {
          return this.search_results.html(t);
        }),
        (n.prototype.results_hide = function () {
          return (
            this.results_showing &&
              (this.result_clear_highlight(),
              this.container.removeClass("chosen-with-drop"),
              this.form_field_jq.trigger("chosen:hiding_dropdown", {
                chosen: this,
              })),
            (this.results_showing = !1)
          );
        }),
        (n.prototype.set_tab_index = function (t) {
          var e;
          if (this.form_field.tabIndex)
            return (
              (e = this.form_field.tabIndex),
              (this.form_field.tabIndex = -1),
              (this.search_field[0].tabIndex = e)
            );
        }),
        (n.prototype.set_label_behavior = function () {
          if (
            ((this.form_field_label = this.form_field_jq.parents("label")),
            !this.form_field_label.length &&
              this.form_field.id.length &&
              (this.form_field_label = t(
                "label[for='" + this.form_field.id + "']"
              )),
            this.form_field_label.length > 0)
          )
            return this.form_field_label.on(
              "click.chosen",
              this.label_click_handler
            );
        }),
        (n.prototype.show_search_field_default = function () {
          return this.is_multiple &&
            this.choices_count() < 1 &&
            !this.active_field
            ? (this.search_field.val(this.default_text),
              this.search_field.addClass("default"))
            : (this.search_field.val(""),
              this.search_field.removeClass("default"));
        }),
        (n.prototype.search_results_mouseup = function (e) {
          var s;
          if (
            (s = t(e.target).hasClass("active-result")
              ? t(e.target)
              : t(e.target).parents(".active-result").first()).length
          )
            return (
              (this.result_highlight = s),
              this.result_select(e),
              this.search_field.focus()
            );
        }),
        (n.prototype.search_results_mouseover = function (e) {
          var s;
          if (
            (s = t(e.target).hasClass("active-result")
              ? t(e.target)
              : t(e.target).parents(".active-result").first())
          )
            return this.result_do_highlight(s);
        }),
        (n.prototype.search_results_mouseout = function (e) {
          if (
            t(e.target).hasClass("active-result") ||
            t(e.target).parents(".active-result").first()
          )
            return this.result_clear_highlight();
        }),
        (n.prototype.choice_build = function (e) {
          var s, i;
          return (
            (s = t("<li />", { class: "search-choice" }).html(
              "<span>" + this.choice_label(e) + "</span>"
            )),
            e.disabled
              ? s.addClass("search-choice-disabled")
              : ((i = t("<a />", {
                  class: "search-choice-close",
                  "data-option-array-index": e.array_index,
                })).on(
                  "click.chosen",
                  (function (t) {
                    return function (e) {
                      return t.choice_destroy_link_click(e);
                    };
                  })(this)
                ),
                s.append(i)),
            this.search_container.before(s)
          );
        }),
        (n.prototype.choice_destroy_link_click = function (e) {
          if ((e.preventDefault(), e.stopPropagation(), !this.is_disabled))
            return this.choice_destroy(t(e.target));
        }),
        (n.prototype.choice_destroy = function (t) {
          if (
            this.result_deselect(t[0].getAttribute("data-option-array-index"))
          )
            return (
              this.active_field
                ? this.search_field.focus()
                : this.show_search_field_default(),
              this.is_multiple &&
                this.choices_count() > 0 &&
                this.get_search_field_value().length < 1 &&
                this.results_hide(),
              t.parents("li").first().remove(),
              this.search_field_scale()
            );
        }),
        (n.prototype.results_reset = function () {
          if (
            (this.reset_single_select_options(),
            (this.form_field.options[0].selected = !0),
            this.single_set_selected_text(),
            this.show_search_field_default(),
            this.results_reset_cleanup(),
            this.trigger_form_field_change(),
            this.active_field)
          )
            return this.results_hide();
        }),
        (n.prototype.results_reset_cleanup = function () {
          return (
            (this.current_selectedIndex = this.form_field.selectedIndex),
            this.selected_item.find("abbr").remove()
          );
        }),
        (n.prototype.result_select = function (t) {
          var e, s;
          if (this.result_highlight)
            return (
              (e = this.result_highlight),
              this.result_clear_highlight(),
              this.is_multiple &&
              this.max_selected_options <= this.choices_count()
                ? (this.form_field_jq.trigger("chosen:maxselected", {
                    chosen: this,
                  }),
                  !1)
                : (this.is_multiple
                    ? e.removeClass("active-result")
                    : this.reset_single_select_options(),
                  e.addClass("result-selected"),
                  (s =
                    this.results_data[
                      e[0].getAttribute("data-option-array-index")
                    ]),
                  (s.selected = !0),
                  (this.form_field.options[s.options_index].selected = !0),
                  (this.selected_option_count = null),
                  this.is_multiple
                    ? this.choice_build(s)
                    : this.single_set_selected_text(this.choice_label(s)),
                  this.is_multiple &&
                  (!this.hide_results_on_select || t.metaKey || t.ctrlKey)
                    ? t.metaKey || t.ctrlKey
                      ? this.winnow_results({ skip_highlight: !0 })
                      : (this.search_field.val(""), this.winnow_results())
                    : (this.results_hide(), this.show_search_field_default()),
                  (this.is_multiple ||
                    this.form_field.selectedIndex !==
                      this.current_selectedIndex) &&
                    this.trigger_form_field_change({
                      selected: this.form_field.options[s.options_index].value,
                    }),
                  (this.current_selectedIndex = this.form_field.selectedIndex),
                  t.preventDefault(),
                  this.search_field_scale())
            );
        }),
        (n.prototype.single_set_selected_text = function (t) {
          return (
            null == t && (t = this.default_text),
            t === this.default_text
              ? this.selected_item.addClass("chosen-default")
              : (this.single_deselect_control_build(),
                this.selected_item.removeClass("chosen-default")),
            this.selected_item.find("span").html(t)
          );
        }),
        (n.prototype.result_deselect = function (t) {
          var e;
          return (
            (e = this.results_data[t]),
            !this.form_field.options[e.options_index].disabled &&
              ((e.selected = !1),
              (this.form_field.options[e.options_index].selected = !1),
              (this.selected_option_count = null),
              this.result_clear_highlight(),
              this.results_showing && this.winnow_results(),
              this.trigger_form_field_change({
                deselected: this.form_field.options[e.options_index].value,
              }),
              this.search_field_scale(),
              !0)
          );
        }),
        (n.prototype.single_deselect_control_build = function () {
          if (this.allow_single_deselect)
            return (
              this.selected_item.find("abbr").length ||
                this.selected_item
                  .find("span")
                  .first()
                  .after('<abbr class="search-choice-close"></abbr>'),
              this.selected_item.addClass("chosen-single-with-deselect")
            );
        }),
        (n.prototype.get_search_field_value = function () {
          return this.search_field.val();
        }),
        (n.prototype.get_search_text = function () {
          return t.trim(this.get_search_field_value());
        }),
        (n.prototype.escape_html = function (e) {
          return t("<div/>").text(e).html();
        }),
        (n.prototype.winnow_results_set_highlight = function () {
          var t, e;
          if (
            ((e = this.is_multiple
              ? []
              : this.search_results.find(".result-selected.active-result")),
            null !=
              (t = e.length
                ? e.first()
                : this.search_results.find(".active-result").first()))
          )
            return this.result_do_highlight(t);
        }),
        (n.prototype.no_results = function (t) {
          var e;
          return (
            (e = this.get_no_results_html(t)),
            this.search_results.append(e),
            this.form_field_jq.trigger("chosen:no_results", { chosen: this })
          );
        }),
        (n.prototype.no_results_clear = function () {
          return this.search_results.find(".no-results").remove();
        }),
        (n.prototype.keydown_arrow = function () {
          var t;
          return this.results_showing && this.result_highlight
            ? (t = this.result_highlight.nextAll("li.active-result").first())
              ? this.result_do_highlight(t)
              : void 0
            : this.results_show();
        }),
        (n.prototype.keyup_arrow = function () {
          var t;
          return this.results_showing || this.is_multiple
            ? this.result_highlight
              ? (t = this.result_highlight.prevAll("li.active-result")).length
                ? this.result_do_highlight(t.first())
                : (this.choices_count() > 0 && this.results_hide(),
                  this.result_clear_highlight())
              : void 0
            : this.results_show();
        }),
        (n.prototype.keydown_backstroke = function () {
          var t;
          return this.pending_backstroke
            ? (this.choice_destroy(this.pending_backstroke.find("a").first()),
              this.clear_backstroke())
            : (t = this.search_container.siblings("li.search-choice").last())
                .length && !t.hasClass("search-choice-disabled")
            ? ((this.pending_backstroke = t),
              this.single_backstroke_delete
                ? this.keydown_backstroke()
                : this.pending_backstroke.addClass("search-choice-focus"))
            : void 0;
        }),
        (n.prototype.clear_backstroke = function () {
          return (
            this.pending_backstroke &&
              this.pending_backstroke.removeClass("search-choice-focus"),
            (this.pending_backstroke = null)
          );
        }),
        (n.prototype.search_field_scale = function () {
          var e, s, i, n, r, o, h;
          if (this.is_multiple) {
            for (
              r = {
                position: "absolute",
                left: "-1000px",
                top: "-1000px",
                display: "none",
                whiteSpace: "pre",
              },
                s = 0,
                i = (o = [
                  "fontSize",
                  "fontStyle",
                  "fontWeight",
                  "fontFamily",
                  "lineHeight",
                  "textTransform",
                  "letterSpacing",
                ]).length;
              s < i;
              s++
            )
              r[(n = o[s])] = this.search_field.css(n);
            return (
              (e = t("<div />").css(r)).text(this.get_search_field_value()),
              t("body").append(e),
              (h = e.width() + 25),
              e.remove(),
              this.container.is(":visible") &&
                (h = Math.min(this.container.outerWidth() - 10, h)),
              this.search_field.width(h)
            );
          }
        }),
        (n.prototype.trigger_form_field_change = function (t) {
          return (
            this.form_field_jq.trigger("input", t),
            this.form_field_jq.trigger("change", t)
          );
        }),
        n
      );
    })());
}).call(this);
!(function (i) {
  "use strict";
  "function" == typeof define && define.amd
    ? define(["jquery"], i)
    : "undefined" != typeof exports
    ? (module.exports = i(require("jquery")))
    : i(jQuery);
})(function (i) {
  "use strict";
  var e = window.Slick || {};
  (e = (function () {
    function e(e, s) {
      var o,
        n = this;
      (n.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: i(e),
        appendDots: i(e),
        arrows: !0,
        asNavFor: null,
        prevArrow:
          '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow:
          '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        slidesMargin: 30,
        cssEase: "ease",
        customPaging: function (e, t) {
          return i('<button type="button" />').text(t + 1);
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: 0.35,
        fade: !1,
        focusOnSelect: !1,
        focusOnChange: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !0,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3,
      }),
        (n.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          scrolling: !1,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          swiping: !1,
          $list: null,
          touchObject: {},
          transformsEnabled: !1,
          unslicked: !1,
        }),
        i.extend(n, n.initials),
        (n.activeBreakpoint = null),
        (n.animType = null),
        (n.animProp = null),
        (n.breakpoints = []),
        (n.breakpointSettings = []),
        (n.cssTransitions = !1),
        (n.focussed = !1),
        (n.interrupted = !1),
        (n.hidden = "hidden"),
        (n.paused = !0),
        (n.positionProp = null),
        (n.respondTo = null),
        (n.rowCount = 1),
        (n.shouldClick = !0),
        (n.$slider = i(e)),
        (n.$slidesCache = null),
        (n.transformType = null),
        (n.transitionType = null),
        (n.visibilityChange = "visibilitychange"),
        (n.windowWidth = 0),
        (n.windowTimer = null),
        (o = i(e).data("slick") || {}),
        (n.options = i.extend({}, n.defaults, s, o)),
        n.options.fade === !0 && (n.options.slidesMargin = 0),
        n.options.vertical === !0 && (n.options.variableWidth = !1),
        (n.currentSlide = n.options.initialSlide),
        (n.originalSettings = n.options),
        "undefined" != typeof document.mozHidden
          ? ((n.hidden = "mozHidden"),
            (n.visibilityChange = "mozvisibilitychange"))
          : "undefined" != typeof document.webkitHidden &&
            ((n.hidden = "webkitHidden"),
            (n.visibilityChange = "webkitvisibilitychange")),
        (n.autoPlay = i.proxy(n.autoPlay, n)),
        (n.autoPlayClear = i.proxy(n.autoPlayClear, n)),
        (n.autoPlayIterator = i.proxy(n.autoPlayIterator, n)),
        (n.changeSlide = i.proxy(n.changeSlide, n)),
        (n.clickHandler = i.proxy(n.clickHandler, n)),
        (n.selectHandler = i.proxy(n.selectHandler, n)),
        (n.setPosition = i.proxy(n.setPosition, n)),
        (n.swipeHandler = i.proxy(n.swipeHandler, n)),
        (n.dragHandler = i.proxy(n.dragHandler, n)),
        (n.keyHandler = i.proxy(n.keyHandler, n)),
        (n.instanceUid = t++),
        (n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
        n.registerBreakpoints(),
        n.init(!0);
    }
    var t = 0;
    return e;
  })()),
    (e.prototype.activateADA = function () {
      var i = this;
      i.$slideTrack
        .find(".slick-active")
        .attr({ "aria-hidden": "false" })
        .find("a, input, button, select")
        .attr({ tabindex: "0" });
    }),
    (e.prototype.addSlide = e.prototype.slickAdd =
      function (e, t, s) {
        var o = this;
        if ("boolean" == typeof t) (s = t), (t = null);
        else if (0 > t || t >= o.slideCount) return !1;
        o.unload(),
          "number" == typeof t
            ? 0 === t && 0 === o.$slides.length
              ? i(e).appendTo(o.$slideTrack)
              : s
              ? i(e).insertBefore(o.$slides.eq(t))
              : i(e).insertAfter(o.$slides.eq(t))
            : s === !0
            ? i(e).prependTo(o.$slideTrack)
            : i(e).appendTo(o.$slideTrack),
          (o.$slides = o.$slideTrack.children(this.options.slide)),
          o.$slideTrack.children(this.options.slide).detach(),
          o.$slideTrack.append(o.$slides),
          o.$slides.each(function (e, t) {
            i(t).attr("data-slick-index", e);
          }),
          (o.$slidesCache = o.$slides),
          o.reinit();
      }),
    (e.prototype.animateHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        i.options.adaptiveHeight === !0 &&
        i.options.vertical === !1
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.animate({ height: e }, i.options.speed);
      }
    }),
    (e.prototype.animateSlide = function (e, t) {
      var s = {},
        o = this;
      o.animateHeight(),
        o.options.rtl === !0 && o.options.vertical === !1 && (e = -e),
        o.transformsEnabled === !1
          ? o.options.vertical === !1
            ? o.$slideTrack.animate(
                { left: e },
                o.options.speed,
                o.options.easing,
                t
              )
            : o.$slideTrack.animate(
                { top: e },
                o.options.speed,
                o.options.easing,
                t
              )
          : o.cssTransitions === !1
          ? (o.options.rtl === !0 && (o.currentLeft = -o.currentLeft),
            i({ animStart: o.currentLeft }).animate(
              { animStart: e },
              {
                duration: o.options.speed,
                easing: o.options.easing,
                step: function (i) {
                  (i = Math.ceil(i)),
                    o.options.vertical === !1
                      ? ((s[o.animType] = "translate(" + i + "px, 0px)"),
                        o.$slideTrack.css(s))
                      : ((s[o.animType] = "translate(0px," + i + "px)"),
                        o.$slideTrack.css(s));
                },
                complete: function () {
                  t && t.call();
                },
              }
            ))
          : (o.applyTransition(),
            (e = Math.ceil(e)),
            o.options.vertical === !1
              ? (s[o.animType] = "translate3d(" + e + "px, 0px, 0px)")
              : (s[o.animType] = "translate3d(0px," + e + "px, 0px)"),
            o.$slideTrack.css(s),
            t &&
              setTimeout(function () {
                o.disableTransition(), t.call();
              }, o.options.speed));
    }),
    (e.prototype.getNavTarget = function () {
      var e = this,
        t = e.options.asNavFor;
      return t && null !== t && (t = i(t).not(e.$slider)), t;
    }),
    (e.prototype.asNavFor = function (e) {
      var t = this,
        s = t.getNavTarget();
      null !== s &&
        "object" == typeof s &&
        s.each(function () {
          var t = i(this).slick("getSlick");
          t.unslicked || t.slideHandler(e, !0);
        });
    }),
    (e.prototype.applyTransition = function (i) {
      var e = this,
        t = {};
      e.options.fade === !1
        ? (t[e.transitionType] =
            e.transformType + " " + e.options.speed + "ms " + e.options.cssEase)
        : (t[e.transitionType] =
            "opacity " + e.options.speed + "ms " + e.options.cssEase),
        e.options.fade === !1 ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.autoPlay = function () {
      var i = this;
      i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow &&
          (i.autoPlayTimer = setInterval(
            i.autoPlayIterator,
            i.options.autoplaySpeed
          ));
    }),
    (e.prototype.autoPlayClear = function () {
      var i = this;
      i.autoPlayTimer && clearInterval(i.autoPlayTimer);
    }),
    (e.prototype.autoPlayIterator = function () {
      var i = this,
        e = i.currentSlide + i.options.slidesToScroll;
      i.paused ||
        i.interrupted ||
        i.focussed ||
        (i.options.infinite === !1 &&
          (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1
            ? (i.direction = 0)
            : 0 === i.direction &&
              ((e = i.currentSlide - i.options.slidesToScroll),
              i.currentSlide - 1 === 0 && (i.direction = 1))),
        i.slideHandler(e));
    }),
    (e.prototype.buildArrows = function () {
      var e = this;
      e.options.arrows === !0 &&
        ((e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow")),
        (e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow")),
        e.slideCount > e.options.slidesToShow
          ? (e.$prevArrow
              .removeClass("slick-hidden")
              .removeAttr("aria-hidden tabindex"),
            e.$nextArrow
              .removeClass("slick-hidden")
              .removeAttr("aria-hidden tabindex"),
            e.htmlExpr.test(e.options.prevArrow) &&
              e.$prevArrow.prependTo(e.options.appendArrows),
            e.htmlExpr.test(e.options.nextArrow) &&
              e.$nextArrow.appendTo(e.options.appendArrows),
            e.options.infinite !== !0 &&
              e.$prevArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"))
          : e.$prevArrow
              .add(e.$nextArrow)
              .addClass("slick-hidden")
              .attr({ "aria-disabled": "true", tabindex: "-1" }));
    }),
    (e.prototype.buildDots = function () {
      var e,
        t,
        s = this;
      if (s.options.dots === !0 && s.slideCount > s.options.slidesToShow) {
        for (
          s.$slider.addClass("slick-dotted"),
            t = i("<ul />").addClass(s.options.dotsClass),
            e = 0;
          e <= s.getDotCount();
          e += 1
        )
          t.append(i("<li />").append(s.options.customPaging.call(this, s, e)));
        (s.$dots = t.appendTo(s.options.appendDots)),
          s.$dots.find("li").first().addClass("slick-active");
      }
    }),
    (e.prototype.buildOut = function () {
      var e = this;
      (e.$slides = e.$slider
        .children(e.options.slide + ":not(.slick-cloned)")
        .addClass("slick-slide")),
        (e.slideCount = e.$slides.length),
        e.$slides.each(function (e, t) {
          i(t)
            .attr("data-slick-index", e)
            .data("originalStyling", i(t).attr("style") || "");
        }),
        e.$slider.addClass("slick-slider"),
        1 === e.options.slidesToShow && (e.options.centerMode = !1),
        1 == e.options.centerMode && e.$slider.addClass("slick-center-mode"),
        (e.$slideTrack =
          0 === e.slideCount
            ? i('<div class="slick-track"/>').appendTo(e.$slider)
            : e.$slides.wrapAll('<div class="slick-track"/>').parent()),
        (e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent()),
        e.$slideTrack.css("opacity", 0),
        (e.options.centerMode === !0 || e.options.swipeToSlide === !0) &&
          (e.options.slidesToScroll = 1),
        i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses(
          "number" == typeof e.currentSlide ? e.currentSlide : 0
        ),
        e.options.draggable === !0 && e.$list.addClass("draggable");
    }),
    (e.prototype.buildRows = function () {
      var i,
        e,
        t,
        s,
        o,
        n,
        r,
        l = this;
      if (
        ((s = document.createDocumentFragment()),
        (n = l.$slider.children()),
        l.options.rows > 1)
      ) {
        for (
          r = l.options.slidesPerRow * l.options.rows,
            o = Math.ceil(n.length / r),
            i = 0;
          o > i;
          i++
        ) {
          var a = document.createElement("div");
          for (e = 0; e < l.options.rows; e++) {
            var d = document.createElement("div");
            for (
              d.className = "row-item", t = 0;
              t < l.options.slidesPerRow;
              t++
            ) {
              var c = i * r + (e * l.options.slidesPerRow + t);
              n.get(c) && d.appendChild(n.get(c));
            }
            a.appendChild(d);
          }
          s.appendChild(a);
        }
        l.$slider.empty().append(s),
          l.$slider
            .children()
            .children()
            .children()
            .css({
              width: 100 / l.options.slidesPerRow + "%",
              display: "inline-block",
            });
      }
    }),
    (e.prototype.checkResponsive = function (e, t) {
      var s,
        o,
        n,
        r = this,
        l = !1,
        a = r.$slider.width(),
        d = window.innerWidth || i(window).width();
      if (
        ("window" === r.respondTo
          ? (n = d)
          : "slider" === r.respondTo
          ? (n = a)
          : "min" === r.respondTo && (n = Math.min(d, a)),
        r.options.responsive &&
          r.options.responsive.length &&
          null !== r.options.responsive)
      ) {
        o = null;
        for (s in r.breakpoints)
          r.breakpoints.hasOwnProperty(s) &&
            (r.originalSettings.mobileFirst === !1
              ? n < r.breakpoints[s] && (o = r.breakpoints[s])
              : n > r.breakpoints[s] && (o = r.breakpoints[s]));
        null !== o
          ? null !== r.activeBreakpoint
            ? (o !== r.activeBreakpoint || t) &&
              ((r.activeBreakpoint = o),
              "unslick" === r.breakpointSettings[o]
                ? r.unslick(o)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[o]
                  )),
                  e === !0 && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = o))
            : ((r.activeBreakpoint = o),
              "unslick" === r.breakpointSettings[o]
                ? r.unslick(o)
                : ((r.options = i.extend(
                    {},
                    r.originalSettings,
                    r.breakpointSettings[o]
                  )),
                  e === !0 && (r.currentSlide = r.options.initialSlide),
                  r.refresh(e)),
              (l = o))
          : null !== r.activeBreakpoint &&
            ((r.activeBreakpoint = null),
            (r.options = r.originalSettings),
            e === !0 && (r.currentSlide = r.options.initialSlide),
            r.refresh(e),
            (l = o)),
          e || l === !1 || r.$slider.trigger("breakpoint", [r, l]);
      }
    }),
    (e.prototype.changeSlide = function (e, t) {
      var s,
        o,
        n,
        r = this,
        l = i(e.currentTarget);
      switch (
        (l.is("a") && e.preventDefault(),
        l.is("li") || (l = l.closest("li")),
        (n = r.slideCount % r.options.slidesToScroll !== 0),
        (s = n
          ? 0
          : (r.slideCount - r.currentSlide) % r.options.slidesToScroll),
        e.data.message)
      ) {
        case "previous":
          (o = 0 === s ? r.options.slidesToScroll : r.options.slidesToShow - s),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide - o, !1, t);
          break;
        case "next":
          (o = 0 === s ? r.options.slidesToScroll : s),
            r.slideCount > r.options.slidesToShow &&
              r.slideHandler(r.currentSlide + o, !1, t);
          break;
        case "index":
          var a =
            0 === e.data.index
              ? 0
              : e.data.index || l.index() * r.options.slidesToScroll;
          r.slideHandler(r.checkNavigable(a), !1, t),
            l.children().trigger("focus");
          break;
        default:
          return;
      }
    }),
    (e.prototype.checkNavigable = function (i) {
      var e,
        t,
        s = this;
      if (((e = s.getNavigableIndexes()), (t = 0), i > e[e.length - 1]))
        i = e[e.length - 1];
      else
        for (var o in e) {
          if (i < e[o]) {
            i = t;
            break;
          }
          t = e[o];
        }
      return i;
    }),
    (e.prototype.cleanUpEvents = function () {
      var e = this;
      e.options.dots &&
        null !== e.$dots &&
        (i("li", e.$dots)
          .off("click.slick", e.changeSlide)
          .off("mouseenter.slick", i.proxy(e.interrupt, e, !0))
          .off("mouseleave.slick", i.proxy(e.interrupt, e, !1)),
        e.options.accessibility === !0 &&
          e.$dots.off("keydown.slick", e.keyHandler)),
        e.$slider.off("focus.slick blur.slick"),
        e.options.arrows === !0 &&
          e.slideCount > e.options.slidesToShow &&
          (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
          e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide),
          e.options.accessibility === !0 &&
            (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
            e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
        e.$list.off("click.slick", e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        e.options.accessibility === !0 &&
          e.$list.off("keydown.slick", e.keyHandler),
        e.options.focusOnSelect === !0 &&
          i(e.$slideTrack).children().off("click.slick", e.selectHandler),
        i(window).off(
          "orientationchange.slick.slick-" + e.instanceUid,
          e.orientationChange
        ),
        i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
        i("[draggable!=true]", e.$slideTrack).off(
          "dragstart",
          e.preventDefault
        ),
        i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
    }),
    (e.prototype.cleanUpSlideEvents = function () {
      var e = this;
      e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.cleanUpRows = function () {
      var i,
        e = this;
      e.options.rows > 0 &&
        e.$slider.find(".row-item").length &&
        ((i = e.$slides.children().children()),
        i.removeAttr("style"),
        i.removeClass("first-slick last-slick"),
        e.$slider.empty().append(i));
    }),
    (e.prototype.clickHandler = function (i) {
      var e = this;
      e.shouldClick === !1 &&
        (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
    }),
    (e.prototype.destroy = function (e) {
      var t = this;
      t.autoPlayClear(),
        (t.touchObject = {}),
        t.cleanUpEvents(),
        i(".slick-cloned", t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow &&
          t.$prevArrow.length &&
          (t.$prevArrow
            .removeClass("slick-disabled slick-arrow slick-hidden")
            .removeAttr("aria-hidden aria-disabled tabindex")
            .css("display", ""),
          t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow &&
          t.$nextArrow.length &&
          (t.$nextArrow
            .removeClass("slick-disabled slick-arrow slick-hidden")
            .removeAttr("aria-hidden aria-disabled tabindex")
            .css("display", ""),
          t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides &&
          (t.$slides
            .removeClass(
              "slick-slide slick-active slick-center slick-visible slick-current"
            )
            .removeAttr("aria-hidden")
            .removeAttr("data-slick-index")
            .each(function () {
              i(this).attr("style", i(this).data("originalStyling"));
            }),
          t.$slideTrack.children(this.options.slide).detach(),
          t.$slideTrack.detach(),
          t.$list.detach(),
          t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass("slick-slider"),
        t.$slider.removeClass("slick-center-mode"),
        t.$slider.removeClass("slick-initialized"),
        t.$slider.removeClass("slick-dotted"),
        (t.unslicked = !0),
        e || t.$slider.trigger("destroy", [t]);
    }),
    (e.prototype.disableTransition = function (i) {
      var e = this,
        t = {};
      (t[e.transitionType] = ""),
        e.options.fade === !1 ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
    }),
    (e.prototype.fadeSlide = function (i, e) {
      var t = this;
      t.cssTransitions === !1
        ? (t.$slides.eq(i).css({ zIndex: t.options.zIndex }),
          t.$slides
            .eq(i)
            .animate({ opacity: 1 }, t.options.speed, t.options.easing, e))
        : (t.applyTransition(i),
          t.$slides.eq(i).css({ opacity: 1, zIndex: t.options.zIndex }),
          e &&
            setTimeout(function () {
              t.disableTransition(i), e.call();
            }, t.options.speed));
    }),
    (e.prototype.fadeSlideOut = function (i) {
      var e = this;
      e.cssTransitions === !1
        ? e.$slides
            .eq(i)
            .animate(
              { opacity: 0, zIndex: e.options.zIndex - 2 },
              e.options.speed,
              e.options.easing
            )
        : (e.applyTransition(i),
          e.$slides.eq(i).css({ opacity: 0, zIndex: e.options.zIndex - 2 }));
    }),
    (e.prototype.filterSlides = e.prototype.slickFilter =
      function (i) {
        var e = this;
        null !== i &&
          ((e.$slidesCache = e.$slides),
          e.unload(),
          e.$slideTrack.children(this.options.slide).detach(),
          e.$slidesCache.filter(i).appendTo(e.$slideTrack),
          e.reinit());
      }),
    (e.prototype.focusHandler = function () {
      var e = this;
      e.$slider
        .off("focus.slick blur.slick")
        .on("focus.slick blur.slick", "*", function (t) {
          t.stopImmediatePropagation();
          var s = i(this);
          setTimeout(function () {
            e.options.pauseOnFocus &&
              ((e.focussed = s.is(":focus")), e.autoPlay());
          }, 0);
        });
    }),
    (e.prototype.getCurrent = e.prototype.slickCurrentSlide =
      function () {
        var i = this;
        return i.currentSlide;
      }),
    (e.prototype.getDotCount = function () {
      var i = this,
        e = 0,
        t = 0,
        s = 0;
      if (i.options.infinite === !0)
        if (i.slideCount <= i.options.slidesToShow) ++s;
        else
          for (; e < i.slideCount; )
            ++s,
              (e = t + i.options.slidesToScroll),
              (t +=
                i.options.slidesToScroll <= i.options.slidesToShow
                  ? i.options.slidesToScroll
                  : i.options.slidesToShow);
      else if (i.options.centerMode === !0) s = i.slideCount;
      else if (i.options.asNavFor)
        for (; e < i.slideCount; )
          ++s,
            (e = t + i.options.slidesToScroll),
            (t +=
              i.options.slidesToScroll <= i.options.slidesToShow
                ? i.options.slidesToScroll
                : i.options.slidesToShow);
      else
        s =
          1 +
          Math.ceil(
            (i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll
          );
      return s - 1;
    }),
    (e.prototype.getValueMargin = function () {
      var i = this.options.slidesMargin;
      return this.options.fade === !0 && (i = 0), i;
    }),
    (e.prototype.getLeft = function (i) {
      var e,
        t,
        s,
        o,
        n = this,
        r = 0,
        l = 0,
        a = 0,
        d = 0;
      return (
        (a = n.getValueMargin()),
        (d =
          (n.listWidth -
            (n.options.slidesToShow - 1) * n.options.slidesMargin) /
            n.options.slidesToShow +
          n.options.slidesMargin),
        (r = Math.abs(a / n.options.slidesToShow)),
        (e = n.$slides.first().outerHeight(!0)),
        (n.slideOffset = -(i * r)),
        n.options.infinite === !0
          ? (n.slideCount > n.options.slidesToShow &&
              ((n.slideOffset =
                -1 * (n.slideWidth * n.options.slidesToShow + a + i * r)),
              (o = -1),
              n.options.vertical === !0 &&
                n.options.centerMode === !0 &&
                (2 === n.options.slidesToShow
                  ? (o = -1.5)
                  : 1 === n.options.slidesToShow && (o = -2)),
              (l = e * n.options.slidesToShow * o)),
            n.slideCount % n.options.slidesToScroll !== 0 &&
              i + n.options.slidesToScroll > n.slideCount &&
              n.slideCount > n.options.slidesToShow &&
              (i > n.slideCount
                ? ((n.slideOffset =
                    (n.options.slidesToShow - (i - n.slideCount)) *
                    n.slideWidth *
                    -1),
                  (l = (n.options.slidesToShow - (i - n.slideCount)) * e * -1))
                : ((n.slideOffset =
                    -1 *
                    ((n.slideCount % n.options.slidesToScroll) * n.slideWidth +
                      n.slideWidth / 2 +
                      n.options.valueMargin / 2)),
                  (l = (n.slideCount % n.options.slidesToScroll) * e * -1))))
          : i + n.options.slidesToShow > n.slideCount &&
            1 === n.options.slidesToScroll &&
            ((n.slideOffset =
              (i + n.options.slidesToShow - n.slideCount) * n.slideWidth - r),
            (l = (i + n.options.slidesToShow - n.slideCount) * e)),
        n.slideCount <= n.options.slidesToShow &&
          ((n.slideOffset = 0), (l = 0)),
        n.options.centerMode === !0 &&
          n.slideCount > n.options.slidesToShow &&
          (n.options.centerMode === !0 && n.options.infinite === !0
            ? 2 === n.options.slidesToShow
              ? (n.slideOffset -= d * Math.abs(0.5))
              : (n.slideOffset +=
                  d * Math.abs((n.options.slidesToShow - 3) / 2))
            : n.options.centerMode === !0 &&
              (n.slideOffset +=
                d * Math.abs((n.options.slidesToShow - 1) / 2))),
        (s =
          n.options.vertical === !1
            ? i * n.slideWidth * -1 + n.slideOffset
            : i * e * -1 + l),
        n.options.variableWidth === !0 &&
          ((t =
            n.slideCount <= n.options.slidesToShow || n.options.infinite === !1
              ? n.$slideTrack.children(".slick-slide").eq(i)
              : n.$slideTrack
                  .children(".slick-slide")
                  .eq(i + n.options.slidesToShow)),
          (s =
            n.options.rtl === !0
              ? t[0]
                ? -1 * (n.$slideTrack.width() - t[0].offsetLeft - t.width())
                : 0
              : t[0]
              ? -1 * t[0].offsetLeft
              : 0),
          n.options.centerMode === !0 &&
            ((t =
              n.slideCount <= n.options.slidesToShow ||
              n.options.infinite === !1
                ? n.$slideTrack.children(".slick-slide").eq(i)
                : n.$slideTrack
                    .children(".slick-slide")
                    .eq(i + n.options.slidesToShow + 1)),
            (s =
              n.options.rtl === !0
                ? t[0]
                  ? -1 * (n.$slideTrack.width() - t[0].offsetLeft - t.width())
                  : 0
                : t[0]
                ? -1 * t[0].offsetLeft
                : 0),
            (s += (n.$list.width() - t.outerWidth()) / 2))),
        s
      );
    }),
    (e.prototype.getOption = e.prototype.slickGetOption =
      function (i) {
        var e = this;
        return e.options[i];
      }),
    (e.prototype.getNavigableIndexes = function () {
      var i,
        e = this,
        t = 0,
        s = 0,
        o = [];
      for (
        e.options.infinite === !1
          ? (i = e.slideCount)
          : ((t = -1 * e.options.slideCount),
            (s = -1 * e.options.slideCount),
            (i = 2 * e.slideCount));
        i > t;

      )
        o.push(t),
          (t = s + e.options.slidesToScroll),
          (s +=
            e.options.slidesToScroll <= e.options.slidesToShow
              ? e.options.slidesToScroll
              : e.options.slidesToShow);
      return o;
    }),
    (e.prototype.getSlick = function () {
      return this;
    }),
    (e.prototype.getSlideCount = function () {
      var e,
        t,
        s,
        o,
        n = this;
      return (
        (o =
          n.options.centerMode === !0
            ? n.slideWidth * Math.floor(n.options.slidesToShow / 2)
            : 0),
        n.options.swipeToSlide === !0
          ? (n.$slideTrack.find(".slick-slide").each(function (e, t) {
              return t.offsetLeft - o + i(t).outerWidth() / 2 > -1 * n.swipeLeft
                ? ((s = t), !1)
                : void 0;
            }),
            (e = Math.abs(i(s).data("slick-index") - n.currentSlide) || 1),
            (t = Math.abs(i(s).data("slick-index")) + 1),
            t + e >= n.slideCount &&
              n.options.infinite === !1 &&
              n.options.centerMode === !1 &&
              (e = Math.abs(n.slideCount - t) || 1),
            e)
          : n.options.slidesToScroll
      );
    }),
    (e.prototype.goTo = e.prototype.slickGoTo =
      function (i, e) {
        var t = this;
        t.changeSlide({ data: { message: "index", index: parseInt(i) } }, e);
      }),
    (e.prototype.init = function (e) {
      var t = this;
      i(t.$slider).hasClass("slick-initialized") ||
        (i(t.$slider).addClass("slick-initialized"),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
        e && t.$slider.trigger("init", [t]),
        t.options.accessibility === !0 && t.initADA(),
        t.options.autoplay && ((t.paused = !1), t.autoPlay());
    }),
    (e.prototype.initADA = function () {
      var e = this,
        t = Math.ceil(e.slideCount / e.options.slidesToShow),
        s = e.getNavigableIndexes().filter(function (i) {
          return i >= 0 && i < e.slideCount;
        });
      e.$slides
        .add(e.$slideTrack.find(".slick-cloned"))
        .attr({ "aria-hidden": "true", tabindex: "-1" })
        .find("a, input, button, select")
        .attr({ tabindex: "-1" }),
        null !== e.$dots &&
          (e.$slides
            .not(e.$slideTrack.find(".slick-cloned"))
            .each(function (t) {
              var o = s.indexOf(t);
              i(this).attr({
                role: "tabpanel",
                id: "slick-slide" + e.instanceUid + t,
                tabindex: -1,
              }),
                -1 !== o &&
                  i(this).attr({
                    "aria-describedby":
                      "slick-slide-control" + e.instanceUid + o,
                  });
            }),
          e.$dots
            .attr("role", "tablist")
            .find("li")
            .each(function (o) {
              var n = s[o];
              i(this).attr({ role: "presentation" }),
                i(this)
                  .find("button")
                  .first()
                  .attr({
                    role: "tab",
                    id: "slick-slide-control" + e.instanceUid + o,
                    "aria-controls": "slick-slide" + e.instanceUid + n,
                    "aria-label": o + 1 + " of " + t,
                    "aria-selected": null,
                    tabindex: "-1",
                  });
            })
            .eq(e.currentSlide)
            .find("button")
            .attr({ "aria-selected": "true", tabindex: "0" })
            .end());
      for (var o = e.currentSlide, n = o + e.options.slidesToShow; n > o; o++)
        e.$slides.eq(o).attr("tabindex", 0);
      e.activateADA();
    }),
    (e.prototype.initArrowEvents = function () {
      var i = this;
      i.options.arrows === !0 &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow
          .off("click.slick")
          .on("click.slick", { message: "previous" }, i.changeSlide),
        i.$nextArrow
          .off("click.slick")
          .on("click.slick", { message: "next" }, i.changeSlide),
        i.options.accessibility === !0 &&
          (i.$prevArrow.on("keydown.slick", i.keyHandler),
          i.$nextArrow.on("keydown.slick", i.keyHandler)));
    }),
    (e.prototype.initDotEvents = function () {
      var e = this;
      e.options.dots === !0 &&
        e.slideCount > e.options.slidesToShow &&
        (i("li", e.$dots).on(
          "click.slick",
          { message: "index" },
          e.changeSlide
        ),
        e.options.accessibility === !0 &&
          e.$dots.on("keydown.slick", e.keyHandler)),
        e.options.dots === !0 &&
          e.options.pauseOnDotsHover === !0 &&
          i("li", e.$dots)
            .on("mouseenter.slick", i.proxy(e.interrupt, e, !0))
            .on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
    }),
    (e.prototype.initSlideEvents = function () {
      var e = this;
      e.options.pauseOnHover &&
        (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
    }),
    (e.prototype.initializeEvents = function () {
      var e = this;
      e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on(
          "touchstart.slick mousedown.slick",
          { action: "start" },
          e.swipeHandler
        ),
        e.$list.on(
          "touchmove.slick mousemove.slick",
          { action: "move" },
          e.swipeHandler
        ),
        e.$list.on(
          "touchend.slick mouseup.slick",
          { action: "end" },
          e.swipeHandler
        ),
        e.$list.on(
          "touchcancel.slick mouseleave.slick",
          { action: "end" },
          e.swipeHandler
        ),
        e.$list.on("click.slick", e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        e.options.accessibility === !0 &&
          e.$list.on("keydown.slick", e.keyHandler),
        e.options.focusOnSelect === !0 &&
          i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        i(window).on(
          "orientationchange.slick.slick-" + e.instanceUid,
          i.proxy(e.orientationChange, e)
        ),
        i(window).on(
          "resize.slick.slick-" + e.instanceUid,
          i.proxy(e.resize, e)
        ),
        i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
        i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(e.setPosition);
    }),
    (e.prototype.initUI = function () {
      var i = this;
      i.options.arrows === !0 &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.show(), i.$nextArrow.show()),
        i.options.dots === !0 &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.show();
    }),
    (e.prototype.keyHandler = function (i) {
      var e = this;
      i.target.tagName.match("TEXTAREA|INPUT|SELECT") ||
        (37 === i.keyCode && e.options.accessibility === !0
          ? e.changeSlide({
              data: { message: e.options.rtl === !0 ? "next" : "previous" },
            })
          : 39 === i.keyCode &&
            e.options.accessibility === !0 &&
            e.changeSlide({
              data: { message: e.options.rtl === !0 ? "previous" : "next" },
            }));
    }),
    (e.prototype.lazyLoad = function () {
      function e(e) {
        i("img[data-lazy]", e).each(function () {
          var e = i(this),
            t = i(this).attr("data-lazy"),
            s = i(this).attr("data-srcset"),
            o = i(this).attr("data-sizes") || r.$slider.attr("data-sizes"),
            n = document.createElement("img");
          (n.onload = function () {
            e.animate({ opacity: 0 }, 100, function () {
              s && (e.attr("srcset", s), o && e.attr("sizes", o)),
                e.attr("src", t).animate({ opacity: 1 }, 200, function () {
                  e.removeAttr("data-lazy data-srcset data-sizes").removeClass(
                    "slick-loading"
                  );
                }),
                r.$slider.trigger("lazyLoaded", [r, e, t]);
            });
          }),
            (n.onerror = function () {
              e
                .removeAttr("data-lazy")
                .removeClass("slick-loading")
                .addClass("slick-lazyload-error"),
                r.$slider.trigger("lazyLoadError", [r, e, t]);
            }),
            (n.src = t);
        });
      }
      var t,
        s,
        o,
        n,
        r = this;
      if (
        (r.options.centerMode === !0
          ? r.options.infinite === !0
            ? ((o = r.currentSlide + (r.options.slidesToShow / 2 + 1)),
              (n = o + r.options.slidesToShow + 2))
            : ((o = Math.max(
                0,
                r.currentSlide - (r.options.slidesToShow / 2 + 1)
              )),
              (n = 2 + (r.options.slidesToShow / 2 + 1) + r.currentSlide))
          : ((o = r.options.infinite
              ? r.options.slidesToShow + r.currentSlide
              : r.currentSlide),
            (n = Math.ceil(o + r.options.slidesToShow)),
            r.options.fade === !0 && (o > 0 && o--, n <= r.slideCount && n++)),
        (t = r.$slider.find(".slick-slide").slice(o, n)),
        "anticipated" === r.options.lazyLoad)
      )
        for (
          var l = o - 1, a = n, d = r.$slider.find(".slick-slide"), c = 0;
          c < r.options.slidesToScroll;
          c++
        )
          0 > l && (l = r.slideCount - 1),
            (t = t.add(d.eq(l))),
            (t = t.add(d.eq(a))),
            l--,
            a++;
      e(t),
        r.slideCount <= r.options.slidesToShow
          ? ((s = r.$slider.find(".slick-slide")), e(s))
          : r.currentSlide >= r.slideCount - r.options.slidesToShow
          ? ((s = r.$slider
              .find(".slick-cloned")
              .slice(0, r.options.slidesToShow)),
            e(s))
          : 0 === r.currentSlide &&
            ((s = r.$slider
              .find(".slick-cloned")
              .slice(-1 * r.options.slidesToShow)),
            e(s));
    }),
    (e.prototype.loadSlider = function () {
      var i = this;
      i.setPosition(),
        i.$slideTrack.css({ opacity: 1 }),
        i.$slider.removeClass("slick-loading"),
        i.initUI(),
        "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
    }),
    (e.prototype.next = e.prototype.slickNext =
      function () {
        var i = this;
        i.changeSlide({ data: { message: "next" } });
      }),
    (e.prototype.orientationChange = function () {
      var i = this;
      i.checkResponsive(), i.setPosition();
    }),
    (e.prototype.pause = e.prototype.slickPause =
      function () {
        var i = this;
        i.autoPlayClear(), (i.paused = !0);
      }),
    (e.prototype.play = e.prototype.slickPlay =
      function () {
        var i = this;
        i.autoPlay(),
          (i.options.autoplay = !0),
          (i.paused = !1),
          (i.focussed = !1),
          (i.interrupted = !1);
      }),
    (e.prototype.postSlide = function (e) {
      var t = this;
      if (
        !t.unslicked &&
        (t.$slider.trigger("afterChange", [t, e]),
        (t.animating = !1),
        t.slideCount > t.options.slidesToShow && t.setPosition(),
        (t.swipeLeft = null),
        t.options.autoplay && t.autoPlay(),
        t.options.accessibility === !0 &&
          (t.initADA(), t.options.focusOnChange))
      ) {
        var s = i(t.$slides.get(t.currentSlide));
        s.attr("tabindex", 0).focus();
      }
    }),
    (e.prototype.prev = e.prototype.slickPrev =
      function () {
        var i = this;
        i.changeSlide({ data: { message: "previous" } });
      }),
    (e.prototype.preventDefault = function (i) {
      i.preventDefault();
    }),
    (e.prototype.progressiveLazyLoad = function (e) {
      e = e || 1;
      var t,
        s,
        o,
        n,
        r,
        l = this,
        a = i("img[data-lazy]", l.$slider);
      a.length
        ? ((t = a.first()),
          (s = t.attr("data-lazy")),
          (o = t.attr("data-srcset")),
          (n = t.attr("data-sizes") || l.$slider.attr("data-sizes")),
          (r = document.createElement("img")),
          (r.onload = function () {
            o && (t.attr("srcset", o), n && t.attr("sizes", n)),
              t
                .attr("src", s)
                .removeAttr("data-lazy data-srcset data-sizes")
                .removeClass("slick-loading"),
              l.options.adaptiveHeight === !0 && l.setPosition(),
              l.$slider.trigger("lazyLoaded", [l, t, s]),
              l.progressiveLazyLoad();
          }),
          (r.onerror = function () {
            3 > e
              ? setTimeout(function () {
                  l.progressiveLazyLoad(e + 1);
                }, 500)
              : (t
                  .removeAttr("data-lazy")
                  .removeClass("slick-loading")
                  .addClass("slick-lazyload-error"),
                l.$slider.trigger("lazyLoadError", [l, t, s]),
                l.progressiveLazyLoad());
          }),
          (r.src = s))
        : l.$slider.trigger("allImagesLoaded", [l]);
    }),
    (e.prototype.refresh = function (e) {
      var t,
        s,
        o = this;
      (s = o.slideCount - o.options.slidesToShow),
        !o.options.infinite && o.currentSlide > s && (o.currentSlide = s),
        o.slideCount <= o.options.slidesToShow && (o.currentSlide = 0),
        (t = o.currentSlide),
        o.destroy(!0),
        i.extend(o, o.initials, { currentSlide: t }),
        o.init(),
        e || o.changeSlide({ data: { message: "index", index: t } }, !1);
    }),
    (e.prototype.registerBreakpoints = function () {
      var e,
        t,
        s,
        o = this,
        n = o.options.responsive || null;
      if ("array" === i.type(n) && n.length) {
        o.respondTo = o.options.respondTo || "window";
        for (e in n)
          if (((s = o.breakpoints.length - 1), n.hasOwnProperty(e))) {
            for (t = n[e].breakpoint; s >= 0; )
              o.breakpoints[s] &&
                o.breakpoints[s] === t &&
                o.breakpoints.splice(s, 1),
                s--;
            o.breakpoints.push(t), (o.breakpointSettings[t] = n[e].settings);
          }
        o.breakpoints.sort(function (i, e) {
          return o.options.mobileFirst ? i - e : e - i;
        });
      }
    }),
    (e.prototype.reinit = function () {
      var e = this;
      (e.$slides = e.$slideTrack
        .children(e.options.slide)
        .addClass("slick-slide")),
        (e.slideCount = e.$slides.length),
        e.currentSlide >= e.slideCount &&
          0 !== e.currentSlide &&
          (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        e.options.focusOnSelect === !0 &&
          i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        e.setSlideClasses(
          "number" == typeof e.currentSlide ? e.currentSlide : 0
        ),
        e.setPosition(),
        e.focusHandler(),
        (e.paused = !e.options.autoplay),
        e.autoPlay(),
        e.$slider.trigger("reInit", [e]);
    }),
    (e.prototype.resize = function () {
      var e = this;
      i(window).width() !== e.windowWidth &&
        (clearTimeout(e.windowDelay),
        (e.windowDelay = window.setTimeout(function () {
          (e.windowWidth = i(window).width()),
            e.checkResponsive(),
            e.unslicked || e.setPosition();
        }, 50)));
    }),
    (e.prototype.removeSlide = e.prototype.slickRemove =
      function (i, e, t) {
        var s = this;
        return (
          "boolean" == typeof i
            ? ((e = i), (i = e === !0 ? 0 : s.slideCount - 1))
            : (i = e === !0 ? --i : i),
          s.slideCount < 1 || 0 > i || i > s.slideCount - 1
            ? !1
            : (s.unload(),
              t === !0
                ? s.$slideTrack.children().remove()
                : s.$slideTrack.children(this.options.slide).eq(i).remove(),
              (s.$slides = s.$slideTrack.children(this.options.slide)),
              s.$slideTrack.children(this.options.slide).detach(),
              s.$slideTrack.append(s.$slides),
              (s.$slidesCache = s.$slides),
              void s.reinit())
        );
      }),
    (e.prototype.setCSS = function (i) {
      var e,
        t,
        s = this,
        o = {};
      s.options.rtl === !0 && s.options.vertical === !1 && (i = -i),
        (e = "left" == s.positionProp ? Math.ceil(i) + "px" : "0px"),
        (t = "top" == s.positionProp ? Math.ceil(i) + "px" : "0px"),
        (o[s.positionProp] = i),
        s.transformsEnabled === !1
          ? s.$slideTrack.css(o)
          : ((o = {}),
            s.cssTransitions === !1
              ? ((o[s.animType] = "translate(" + e + ", " + t + ")"),
                s.$slideTrack.css(o))
              : ((o[s.animType] = "translate3d(" + e + ", " + t + ", 0px)"),
                s.$slideTrack.css(o)));
    }),
    (e.prototype.setDimensions = function () {
      var i = this,
        e = 0,
        t = 0,
        s = 0;
      (s = i.getValueMargin()),
        (t =
          i.options.slidesMargin *
          i.$slideTrack.children(".slick-slide").length),
        i.options.vertical === !1
          ? i.options.centerMode === !0 &&
            i.$list.css({ padding: "0px " + i.options.centerPadding })
          : (i.$list.height(
              i.$slides.first().outerHeight(!0) * i.options.slidesToShow - s
            ),
            i.options.centerMode === !0 &&
              i.$list.css({ padding: i.options.centerPadding + " 0px" })),
        (i.listWidth = i.$list.width()),
        (i.listHeight = i.$list.height()),
        i.options.vertical === !1 && i.options.variableWidth === !1
          ? ((e = Math.abs(s / i.options.slidesToShow)),
            (i.slideWidth = Math.abs(i.listWidth / i.options.slidesToShow)),
            i.$slideTrack.width(
              Math.abs(
                i.slideWidth * i.$slideTrack.children(".slick-slide").length
              ) + t
            ))
          : i.options.variableWidth === !0
          ? i.$slideTrack.width(5e3 * i.slideCount)
          : ((i.slideWidth = Math.round(i.listWidth)),
            i.$slideTrack.height(
              Math.floor(
                i.$slides.first().outerHeight(!0) *
                  i.$slideTrack.children(".slick-slide").length
              )
            ));
      var o = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
      i.options.variableWidth === !1 &&
        i.$slideTrack.children(".slick-slide").width(i.slideWidth - o + e);
    }),
    (e.prototype.setFade = function () {
      var e,
        t = this;
      t.$slides.each(function (s, o) {
        (e = t.slideWidth * s * -1),
          t.options.rtl === !0
            ? i(o).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              })
            : i(o).css({
                position: "relative",
                left: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0,
              });
      }),
        t.$slides
          .eq(t.currentSlide)
          .css({ zIndex: t.options.zIndex - 1, opacity: 1 });
    }),
    (e.prototype.setHeight = function () {
      var i = this;
      if (
        1 === i.options.slidesToShow &&
        i.options.adaptiveHeight === !0 &&
        i.options.vertical === !1
      ) {
        var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
        i.$list.css("height", e);
      }
    }),
    (e.prototype.setOption = e.prototype.slickSetOption =
      function () {
        var e,
          t,
          s,
          o,
          n,
          r = this,
          l = !1;
        if (
          ("object" === i.type(arguments[0])
            ? ((s = arguments[0]), (l = arguments[1]), (n = "multiple"))
            : "string" === i.type(arguments[0]) &&
              ((s = arguments[0]),
              (o = arguments[1]),
              (l = arguments[2]),
              "responsive" === arguments[0] && "array" === i.type(arguments[1])
                ? (n = "responsive")
                : "undefined" != typeof arguments[1] && (n = "single")),
          "single" === n)
        )
          r.options[s] = o;
        else if ("multiple" === n)
          i.each(s, function (i, e) {
            r.options[i] = e;
          });
        else if ("responsive" === n)
          for (t in o)
            if ("array" !== i.type(r.options.responsive))
              r.options.responsive = [o[t]];
            else {
              for (e = r.options.responsive.length - 1; e >= 0; )
                r.options.responsive[e].breakpoint === o[t].breakpoint &&
                  r.options.responsive.splice(e, 1),
                  e--;
              r.options.responsive.push(o[t]);
            }
        l && (r.unload(), r.reinit());
      }),
    (e.prototype.setPosition = function () {
      var i = this;
      i.setDimensions(),
        i.setHeight(),
        i.options.fade === !1
          ? i.setCSS(i.getLeft(i.currentSlide))
          : i.setFade(),
        i.$slider.trigger("setPosition", [i]);
    }),
    (e.prototype.setProps = function () {
      var i = this,
        e = document.body.style;
      (i.positionProp = i.options.vertical === !0 ? "top" : "left"),
        "top" === i.positionProp
          ? i.$slider.addClass("slick-vertical")
          : i.$slider.removeClass("slick-vertical"),
        (void 0 !== e.WebkitTransition ||
          void 0 !== e.MozTransition ||
          void 0 !== e.msTransition) &&
          i.options.useCSS === !0 &&
          (i.cssTransitions = !0),
        i.options.fade &&
          ("number" == typeof i.options.zIndex
            ? i.options.zIndex < 3 && (i.options.zIndex = 3)
            : (i.options.zIndex = i.defaults.zIndex)),
        void 0 !== e.OTransform &&
          ((i.animType = "OTransform"),
          (i.transformType = "-o-transform"),
          (i.transitionType = "OTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.MozTransform &&
          ((i.animType = "MozTransform"),
          (i.transformType = "-moz-transform"),
          (i.transitionType = "MozTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.MozPerspective &&
            (i.animType = !1)),
        void 0 !== e.webkitTransform &&
          ((i.animType = "webkitTransform"),
          (i.transformType = "-webkit-transform"),
          (i.transitionType = "webkitTransition"),
          void 0 === e.perspectiveProperty &&
            void 0 === e.webkitPerspective &&
            (i.animType = !1)),
        void 0 !== e.msTransform &&
          ((i.animType = "msTransform"),
          (i.transformType = "-ms-transform"),
          (i.transitionType = "msTransition"),
          void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform &&
          i.animType !== !1 &&
          ((i.animType = "transform"),
          (i.transformType = "transform"),
          (i.transitionType = "transition")),
        (i.transformsEnabled =
          i.options.useTransform && null !== i.animType && i.animType !== !1);
    }),
    (e.prototype.setSlideClasses = function (i) {
      var e,
        t,
        s,
        o,
        n,
        r = this;
      if (
        ((n = "right"),
        r.options.rtl === !0 && (n = "left"),
        r.options.vertical === !0 && (n = "bottom"),
        r.$slider
          .children()
          .children(".slick-track")
          .children()
          .css("margin-" + n, r.options.slidesMargin + "px"),
        (t = r.$slider
          .children()
          .children(".slick-track")
          .children()
          .removeClass("slick-active slick-center slick-current")
          .attr("aria-hidden", "true")),
        r.$slides.eq(i).addClass("slick-current"),
        r.options.centerMode === !0)
      ) {
        var l = r.options.slidesToShow % 2 === 0 ? 1 : 0;
        (e = Math.floor(r.options.slidesToShow / 2)),
          r.options.infinite === !0 &&
            (i >= e && i <= r.slideCount - 1 - e
              ? r.$slides
                  .slice(i - e + l, i + e + 1)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false")
              : ((s = r.options.slidesToShow + i),
                t
                  .slice(s - e + 1 + l, s + e + 2)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false")),
            0 === i
              ? t
                  .eq(t.length - 1 - r.options.slidesToShow)
                  .addClass("slick-center")
              : i === r.slideCount - 1 &&
                t.eq(r.options.slidesToShow).addClass("slick-center")),
          r.$slides.eq(i).addClass("slick-center");
      } else
        i >= 0 && i <= r.slideCount - r.options.slidesToShow
          ? r.$slides
              .slice(i, i + r.options.slidesToShow)
              .addClass("slick-active")
              .attr("aria-hidden", "false")
          : t.length <= r.options.slidesToShow
          ? t.addClass("slick-active").attr("aria-hidden", "false")
          : ((o = r.slideCount % r.options.slidesToShow),
            (s = r.options.infinite === !0 ? r.options.slidesToShow + i : i),
            r.options.slidesToShow == r.options.slidesToScroll &&
            r.slideCount - i < r.options.slidesToShow
              ? t
                  .slice(s - (r.options.slidesToShow - o), s + o)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false")
              : t
                  .slice(s, s + r.options.slidesToShow)
                  .addClass("slick-active")
                  .attr("aria-hidden", "false"));
      ("ondemand" === r.options.lazyLoad ||
        "anticipated" === r.options.lazyLoad) &&
        r.lazyLoad(),
        r.$slider
          .find(".slick-list .slick-active:first")
          .addClass("first-slick")
          .siblings()
          .removeClass("first-slick"),
        r.$slider
          .find(".slick-list .slick-active:last")
          .addClass("last-slick")
          .siblings()
          .removeClass("last-slick");
    }),
    (e.prototype.setupInfinite = function () {
      var e,
        t,
        s,
        o = this;
      if (
        (o.options.fade === !0 && (o.options.centerMode = !1),
        o.options.infinite === !0 &&
          o.options.fade === !1 &&
          ((t = null), o.slideCount > o.options.slidesToShow))
      ) {
        for (
          s =
            o.options.centerMode === !0
              ? o.options.slidesToShow + 1
              : o.options.slidesToShow,
            e = o.slideCount;
          e > o.slideCount - s;
          e -= 1
        )
          (t = e - 1),
            i(o.$slides[t])
              .clone(!0)
              .attr("id", "")
              .attr("data-slick-index", t - o.slideCount)
              .prependTo(o.$slideTrack)
              .addClass("slick-cloned");
        for (e = 0; e < s + o.slideCount; e += 1)
          (t = e),
            i(o.$slides[t])
              .clone(!0)
              .attr("id", "")
              .attr("data-slick-index", t + o.slideCount)
              .appendTo(o.$slideTrack)
              .addClass("slick-cloned");
        o.$slideTrack
          .find(".slick-cloned")
          .find("[id]")
          .each(function () {
            i(this).attr("id", "");
          });
      }
    }),
    (e.prototype.interrupt = function (i) {
      var e = this;
      i || e.autoPlay(), (e.interrupted = i);
    }),
    (e.prototype.selectHandler = function (e) {
      var t = this,
        s = i(e.target).is(".slick-slide")
          ? i(e.target)
          : i(e.target).parents(".slick-slide"),
        o = parseInt(s.attr("data-slick-index"));
      return (
        o || (o = 0),
        t.slideCount <= t.options.slidesToShow
          ? void t.slideHandler(o, !1, !0)
          : void t.slideHandler(o)
      );
    }),
    (e.prototype.slideHandler = function (i, e, t) {
      var s,
        o,
        n,
        r,
        l,
        a = null,
        d = this;
      return (
        (e = e || !1),
        (d.animating === !0 && d.options.waitForAnimate === !0) ||
        (d.options.fade === !0 && d.currentSlide === i)
          ? void 0
          : (e === !1 && d.asNavFor(i),
            (s = i),
            (a = d.getLeft(s)),
            (r = d.getLeft(d.currentSlide)),
            (d.currentLeft = null === d.swipeLeft ? r : d.swipeLeft),
            d.options.infinite === !1 &&
            d.options.centerMode === !1 &&
            (0 > i || i > d.getDotCount() * d.options.slidesToScroll)
              ? void (
                  d.options.fade === !1 &&
                  ((s = d.currentSlide),
                  t !== !0
                    ? d.animateSlide(r, function () {
                        d.postSlide(s);
                      })
                    : d.postSlide(s))
                )
              : d.options.infinite === !1 &&
                d.options.centerMode === !0 &&
                (0 > i || i > d.slideCount - d.options.slidesToScroll)
              ? void (
                  d.options.fade === !1 &&
                  ((s = d.currentSlide),
                  t !== !0
                    ? d.animateSlide(r, function () {
                        d.postSlide(s);
                      })
                    : d.postSlide(s))
                )
              : (d.options.autoplay && clearInterval(d.autoPlayTimer),
                (o =
                  0 > s
                    ? d.slideCount % d.options.slidesToScroll !== 0
                      ? d.slideCount - (d.slideCount % d.options.slidesToScroll)
                      : d.slideCount + s
                    : s >= d.slideCount
                    ? d.slideCount % d.options.slidesToScroll !== 0
                      ? 0
                      : s - d.slideCount
                    : s),
                (d.animating = !0),
                d.$slider.trigger("beforeChange", [d, d.currentSlide, o]),
                (n = d.currentSlide),
                (d.currentSlide = o),
                d.setSlideClasses(d.currentSlide),
                d.options.asNavFor &&
                  ((l = d.getNavTarget()),
                  (l = l.slick("getSlick")),
                  l.slideCount <= l.options.slidesToShow &&
                    l.setSlideClasses(d.currentSlide)),
                d.updateDots(),
                d.updateArrows(),
                d.options.fade === !0
                  ? (t !== !0
                      ? (d.fadeSlideOut(n),
                        d.fadeSlide(o, function () {
                          d.postSlide(o);
                        }))
                      : d.postSlide(o),
                    void d.animateHeight())
                  : void (t !== !0
                      ? d.animateSlide(a, function () {
                          d.postSlide(o);
                        })
                      : d.postSlide(o))))
      );
    }),
    (e.prototype.startLoad = function () {
      var i = this;
      i.options.arrows === !0 &&
        i.slideCount > i.options.slidesToShow &&
        (i.$prevArrow.hide(), i.$nextArrow.hide()),
        i.options.dots === !0 &&
          i.slideCount > i.options.slidesToShow &&
          i.$dots.hide(),
        i.$slider.addClass("slick-loading");
    }),
    (e.prototype.swipeDirection = function () {
      var i,
        e,
        t,
        s,
        o = this;
      return (
        (i = o.touchObject.startX - o.touchObject.curX),
        (e = o.touchObject.startY - o.touchObject.curY),
        (t = Math.atan2(e, i)),
        (s = Math.round((180 * t) / Math.PI)),
        0 > s && (s = 360 - Math.abs(s)),
        45 >= s && s >= 0
          ? o.options.rtl === !1
            ? "left"
            : "right"
          : 360 >= s && s >= 315
          ? o.options.rtl === !1
            ? "left"
            : "right"
          : s >= 135 && 225 >= s
          ? o.options.rtl === !1
            ? "right"
            : "left"
          : o.options.verticalSwiping === !0
          ? s >= 35 && 135 >= s
            ? "down"
            : "up"
          : "vertical"
      );
    }),
    (e.prototype.swipeEnd = function (i) {
      var e,
        t,
        s = this;
      if (((s.dragging = !1), (s.swiping = !1), s.scrolling))
        return (s.scrolling = !1), !1;
      if (
        ((s.interrupted = !1),
        (s.shouldClick = s.touchObject.swipeLength > 10 ? !1 : !0),
        void 0 === s.touchObject.curX)
      )
        return !1;
      if (
        (s.touchObject.edgeHit === !0 &&
          s.$slider.trigger("edge", [s, s.swipeDirection()]),
        s.touchObject.swipeLength >= s.touchObject.minSwipe)
      ) {
        switch ((t = s.swipeDirection())) {
          case "left":
          case "down":
            (e = s.options.swipeToSlide
              ? s.checkNavigable(s.currentSlide + s.getSlideCount())
              : s.currentSlide + s.getSlideCount()),
              (s.currentDirection = 0);
            break;
          case "right":
          case "up":
            (e = s.options.swipeToSlide
              ? s.checkNavigable(s.currentSlide - s.getSlideCount())
              : s.currentSlide - s.getSlideCount()),
              (s.currentDirection = 1);
        }
        "vertical" != t &&
          (s.slideHandler(e),
          (s.touchObject = {}),
          s.$slider.trigger("swipe", [s, t]));
      } else
        s.touchObject.startX !== s.touchObject.curX &&
          (s.slideHandler(s.currentSlide), (s.touchObject = {}));
    }),
    (e.prototype.swipeHandler = function (i) {
      var e = this;
      if (
        !(
          e.options.swipe === !1 ||
          ("ontouchend" in document && e.options.swipe === !1) ||
          (e.options.draggable === !1 && -1 !== i.type.indexOf("mouse"))
        )
      )
        switch (
          ((e.touchObject.fingerCount =
            i.originalEvent && void 0 !== i.originalEvent.touches
              ? i.originalEvent.touches.length
              : 1),
          (e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold),
          e.options.verticalSwiping === !0 &&
            (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
          i.data.action)
        ) {
          case "start":
            e.swipeStart(i);
            break;
          case "move":
            e.swipeMove(i);
            break;
          case "end":
            e.swipeEnd(i);
        }
    }),
    (e.prototype.swipeMove = function (i) {
      var e,
        t,
        s,
        o,
        n,
        r,
        l = this;
      return (
        (n = void 0 !== i.originalEvent ? i.originalEvent.touches : null),
        !l.dragging || l.scrolling || (n && 1 !== n.length)
          ? !1
          : ((e = l.getLeft(l.currentSlide)),
            (l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX),
            (l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY),
            (l.touchObject.swipeLength = Math.round(
              Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))
            )),
            (r = Math.round(
              Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))
            )),
            !l.options.verticalSwiping && !l.swiping && r > 4
              ? ((l.scrolling = !0), !1)
              : (l.options.verticalSwiping === !0 &&
                  (l.touchObject.swipeLength = r),
                (t = l.swipeDirection()),
                void 0 !== i.originalEvent &&
                  l.touchObject.swipeLength > 4 &&
                  ((l.swiping = !0), i.preventDefault()),
                (o =
                  (l.options.rtl === !1 ? 1 : -1) *
                  (l.touchObject.curX > l.touchObject.startX ? 1 : -1)),
                l.options.verticalSwiping === !0 &&
                  (o = l.touchObject.curY > l.touchObject.startY ? 1 : -1),
                (s = l.touchObject.swipeLength),
                (l.touchObject.edgeHit = !1),
                l.options.infinite === !1 &&
                  ((0 === l.currentSlide && "right" === t) ||
                    (l.currentSlide >= l.getDotCount() && "left" === t)) &&
                  ((s = l.touchObject.swipeLength * l.options.edgeFriction),
                  (l.touchObject.edgeHit = !0)),
                l.options.vertical === !1
                  ? (l.swipeLeft = e + s * o)
                  : (l.swipeLeft =
                      e + s * (l.$list.height() / l.listWidth) * o),
                l.options.verticalSwiping === !0 && (l.swipeLeft = e + s * o),
                l.options.fade === !0 || l.options.touchMove === !1
                  ? !1
                  : l.animating === !0
                  ? ((l.swipeLeft = null), !1)
                  : void l.setCSS(l.swipeLeft)))
      );
    }),
    (e.prototype.swipeStart = function (i) {
      var e,
        t = this;
      return (
        (t.interrupted = !0),
        1 !== t.touchObject.fingerCount ||
        t.slideCount <= t.options.slidesToShow
          ? ((t.touchObject = {}), !1)
          : (void 0 !== i.originalEvent &&
              void 0 !== i.originalEvent.touches &&
              (e = i.originalEvent.touches[0]),
            (t.touchObject.startX = t.touchObject.curX =
              void 0 !== e ? e.pageX : i.clientX),
            (t.touchObject.startY = t.touchObject.curY =
              void 0 !== e ? e.pageY : i.clientY),
            void (t.dragging = !0))
      );
    }),
    (e.prototype.unfilterSlides = e.prototype.slickUnfilter =
      function () {
        var i = this;
        null !== i.$slidesCache &&
          (i.unload(),
          i.$slideTrack.children(this.options.slide).detach(),
          i.$slidesCache.appendTo(i.$slideTrack),
          i.reinit());
      }),
    (e.prototype.unload = function () {
      var e = this;
      i(".slick-cloned", e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow &&
          e.htmlExpr.test(e.options.prevArrow) &&
          e.$prevArrow.remove(),
        e.$nextArrow &&
          e.htmlExpr.test(e.options.nextArrow) &&
          e.$nextArrow.remove(),
        e.$slides
          .removeClass("slick-slide slick-active slick-visible slick-current")
          .attr("aria-hidden", "true")
          .css("width", "");
    }),
    (e.prototype.unslick = function (i) {
      var e = this;
      e.$slider.trigger("unslick", [e, i]), e.destroy();
    }),
    (e.prototype.updateArrows = function () {
      var i,
        e = this;
      (i = Math.floor(e.options.slidesToShow / 2)),
        e.options.arrows === !0 &&
          e.slideCount > e.options.slidesToShow &&
          !e.options.infinite &&
          (e.$prevArrow
            .removeClass("slick-disabled")
            .attr("aria-disabled", "false"),
          e.$nextArrow
            .removeClass("slick-disabled")
            .attr("aria-disabled", "false"),
          0 === e.currentSlide
            ? (e.$prevArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"),
              e.$nextArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false"))
            : e.currentSlide >= e.slideCount - e.options.slidesToShow &&
              e.options.centerMode === !1
            ? (e.$nextArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"),
              e.$prevArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false"))
            : e.currentSlide >= e.slideCount - 1 &&
              e.options.centerMode === !0 &&
              (e.$nextArrow
                .addClass("slick-disabled")
                .attr("aria-disabled", "true"),
              e.$prevArrow
                .removeClass("slick-disabled")
                .attr("aria-disabled", "false")));
    }),
    (e.prototype.updateDots = function () {
      var i = this;
      null !== i.$dots &&
        (i.$dots.find("li").removeClass("slick-active").end(),
        i.$dots
          .find("li")
          .eq(Math.floor(i.currentSlide / i.options.slidesToScroll))
          .addClass("slick-active"));
    }),
    (e.prototype.visibility = function () {
      var i = this;
      i.options.autoplay &&
        (document[i.hidden] ? (i.interrupted = !0) : (i.interrupted = !1));
    }),
    (i.fn.slick = function () {
      var i,
        t,
        s = this,
        o = arguments[0],
        n = Array.prototype.slice.call(arguments, 1),
        r = s.length;
      for (i = 0; r > i; i++)
        if (
          ("object" == typeof o || "undefined" == typeof o
            ? (s[i].slick = new e(s[i], o))
            : (t = s[i].slick[o].apply(s[i].slick, n)),
          "undefined" != typeof t)
        )
          return t;
      return s;
    });
});
+(function (t) {
  "use strict";
  function e() {
    var t = document.createElement("bootstrap"),
      e = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd otransitionend",
        transition: "transitionend",
      };
    for (var i in e) if (void 0 !== t.style[i]) return { end: e[i] };
    return !1;
  }
  (t.fn.emulateTransitionEnd = function (e) {
    var i = !1,
      o = this;
    t(this).one("bsTransitionEnd", function () {
      i = !0;
    });
    var n = function () {
      i || t(o).trigger(t.support.transition.end);
    };
    return setTimeout(n, e), this;
  }),
    t(function () {
      (t.support.transition = e()),
        t.support.transition &&
          (t.event.special.bsTransitionEnd = {
            bindType: t.support.transition.end,
            delegateType: t.support.transition.end,
            handle: function (e) {
              return t(e.target).is(this)
                ? e.handleObj.handler.apply(this, arguments)
                : void 0;
            },
          });
    });
})(jQuery),
  +(function (t) {
    "use strict";
    function e(e, i) {
      var o = e.nodeName.toLowerCase();
      if (-1 !== t.inArray(o, i))
        return -1 !== t.inArray(o, r)
          ? Boolean(e.nodeValue.match(p) || e.nodeValue.match(l))
          : !0;
      for (
        var n = t(i).filter(function (t, e) {
            return e instanceof RegExp;
          }),
          s = 0,
          a = n.length;
        a > s;
        s++
      )
        if (o.match(n[s])) return !0;
      return !1;
    }
    function i(i, o, n) {
      if (0 === i.length) return i;
      if (n && "function" == typeof n) return n(i);
      if (
        !document.implementation ||
        !document.implementation.createHTMLDocument
      )
        return i;
      var r = document.implementation.createHTMLDocument("sanitization");
      r.body.innerHTML = i;
      for (
        var s = t.map(o, function (t, e) {
            return e;
          }),
          a = t(r.body).find("*"),
          p = 0,
          l = a.length;
        l > p;
        p++
      ) {
        var h = a[p],
          u = h.nodeName.toLowerCase();
        if (-1 !== t.inArray(u, s))
          for (
            var c = t.map(h.attributes, function (t) {
                return t;
              }),
              f = [].concat(o["*"] || [], o[u] || []),
              d = 0,
              v = c.length;
            v > d;
            d++
          )
            e(c[d], f) || h.removeAttribute(c[d].nodeName);
        else h.parentNode.removeChild(h);
      }
      return r.body.innerHTML;
    }
    function o(e) {
      return this.each(function () {
        var i = t(this),
          o = i.data("bs.OVICtooltip"),
          n = "object" == typeof e && e;
        (o || !/destroy|hide/.test(e)) &&
          (o || i.data("bs.OVICtooltip", (o = new h(this, n))),
          "string" == typeof e && o[e]());
      });
    }
    var n = ["sanitize", "whiteList", "sanitizeFn"],
      r = [
        "background",
        "cite",
        "href",
        "itemtype",
        "longdesc",
        "poster",
        "src",
        "xlink:href",
      ],
      s = /^aria-[\w-]*$/i,
      a = {
        "*": ["class", "dir", "id", "lang", "role", s],
        a: ["target", "href", "title", "rel"],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ["src", "alt", "title", "width", "height"],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: [],
      },
      p = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,
      l =
        /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i,
      h = function (t, e) {
        (this.type = null),
          (this.options = null),
          (this.enabled = null),
          (this.timeout = null),
          (this.hoverState = null),
          (this.$element = null),
          (this.inState = null),
          this.init("OVICtooltip", t, e);
      };
    (h.VERSION = "3.4.1"),
      (h.TRANSITION_DURATION = 150),
      (h.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template:
          '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: { selector: "body", padding: 0 },
        sanitize: !0,
        sanitizeFn: null,
        whiteList: a,
      }),
      (h.prototype.init = function (e, i, o) {
        if (
          ((this.enabled = !0),
          (this.type = e),
          (this.$element = t(i)),
          (this.options = this.getOptions(o)),
          (this.$viewport =
            this.options.viewport &&
            t(document).find(
              t.isFunction(this.options.viewport)
                ? this.options.viewport.call(this, this.$element)
                : this.options.viewport.selector || this.options.viewport
            )),
          (this.inState = { click: !1, hover: !1, focus: !1 }),
          this.$element[0] instanceof document.constructor &&
            !this.options.selector)
        )
          throw new Error(
            "`selector` option must be specified when initializing " +
              this.type +
              " on the window.document object!"
          );
        for (var n = this.options.trigger.split(" "), r = n.length; r--; ) {
          var s = n[r];
          if ("click" == s)
            this.$element.on(
              "click." + this.type,
              this.options.selector,
              t.proxy(this.toggle, this)
            );
          else if ("manual" != s) {
            var a = "hover" == s ? "mouseenter" : "focusin",
              p = "hover" == s ? "mouseleave" : "focusout";
            this.$element.on(
              a + "." + this.type,
              this.options.selector,
              t.proxy(this.enter, this)
            ),
              this.$element.on(
                p + "." + this.type,
                this.options.selector,
                t.proxy(this.leave, this)
              );
          }
        }
        this.options.selector
          ? (this._options = t.extend({}, this.options, {
              trigger: "manual",
              selector: "",
            }))
          : this.fixTitle();
      }),
      (h.prototype.getDefaults = function () {
        return h.DEFAULTS;
      }),
      (h.prototype.getOptions = function (e) {
        var o = this.$element.data();
        for (var r in o)
          o.hasOwnProperty(r) && -1 !== t.inArray(r, n) && delete o[r];
        return (
          (e = t.extend({}, this.getDefaults(), o, e)),
          e.delay &&
            "number" == typeof e.delay &&
            (e.delay = { show: e.delay, hide: e.delay }),
          e.sanitize && (e.template = i(e.template, e.whiteList, e.sanitizeFn)),
          e
        );
      }),
      (h.prototype.getDelegateOptions = function () {
        var e = {},
          i = this.getDefaults();
        return (
          this._options &&
            t.each(this._options, function (t, o) {
              i[t] != o && (e[t] = o);
            }),
          e
        );
      }),
      (h.prototype.enter = function (e) {
        var i =
          e instanceof this.constructor
            ? e
            : t(e.currentTarget).data("bs." + this.type);
        return (
          i ||
            ((i = new this.constructor(
              e.currentTarget,
              this.getDelegateOptions()
            )),
            t(e.currentTarget).data("bs." + this.type, i)),
          e instanceof t.Event &&
            (i.inState["focusin" == e.type ? "focus" : "hover"] = !0),
          i.tip().hasClass("in") || "in" == i.hoverState
            ? void (i.hoverState = "in")
            : (clearTimeout(i.timeout),
              (i.hoverState = "in"),
              i.options.delay && i.options.delay.show
                ? void (i.timeout = setTimeout(function () {
                    "in" == i.hoverState && i.show();
                  }, i.options.delay.show))
                : i.show())
        );
      }),
      (h.prototype.isInStateTrue = function () {
        for (var t in this.inState) if (this.inState[t]) return !0;
        return !1;
      }),
      (h.prototype.leave = function (e) {
        var i =
          e instanceof this.constructor
            ? e
            : t(e.currentTarget).data("bs." + this.type);
        return (
          i ||
            ((i = new this.constructor(
              e.currentTarget,
              this.getDelegateOptions()
            )),
            t(e.currentTarget).data("bs." + this.type, i)),
          e instanceof t.Event &&
            (i.inState["focusout" == e.type ? "focus" : "hover"] = !1),
          i.isInStateTrue()
            ? void 0
            : (clearTimeout(i.timeout),
              (i.hoverState = "out"),
              i.options.delay && i.options.delay.hide
                ? void (i.timeout = setTimeout(function () {
                    "out" == i.hoverState && i.hide();
                  }, i.options.delay.hide))
                : i.hide())
        );
      }),
      (h.prototype.show = function () {
        var e = t.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
          this.$element.trigger(e);
          var i = t.contains(
            this.$element[0].ownerDocument.documentElement,
            this.$element[0]
          );
          if (e.isDefaultPrevented() || !i) return;
          var o = this,
            n = this.tip(),
            r = this.getUID(this.type);
          this.setContent(),
            n.attr("id", r),
            this.$element.attr("aria-describedby", r),
            this.options.animation && n.addClass("fade");
          var s =
              "function" == typeof this.options.placement
                ? this.options.placement.call(this, n[0], this.$element[0])
                : this.options.placement,
            a = /\s?auto?\s?/i,
            p = a.test(s);
          p && (s = s.replace(a, "") || "top"),
            n
              .detach()
              .css({ top: 0, left: 0, display: "block" })
              .addClass(s)
              .data("bs." + this.type, this),
            this.options.container
              ? n.appendTo(t(document).find(this.options.container))
              : n.insertAfter(this.$element),
            this.$element.trigger("inserted.bs." + this.type);
          var l = this.getPosition(),
            u = n[0].offsetWidth,
            c = n[0].offsetHeight;
          if (p) {
            var f = s,
              d = this.getPosition(this.$viewport);
            (s =
              "bottom" == s && l.bottom + c > d.bottom
                ? "top"
                : "top" == s && l.top - c < d.top
                ? "bottom"
                : "right" == s && l.right + u > d.width
                ? "left"
                : "left" == s && l.left - u < d.left
                ? "right"
                : s),
              n.removeClass(f).addClass(s);
          }
          var v = this.getCalculatedOffset(s, l, u, c);
          this.applyPlacement(v, s);
          var m = function () {
            var t = o.hoverState;
            o.$element.trigger("shown.bs." + o.type),
              (o.hoverState = null),
              "out" == t && o.leave(o);
          };
          t.support.transition && this.$tip.hasClass("fade")
            ? n
                .one("bsTransitionEnd", m)
                .emulateTransitionEnd(h.TRANSITION_DURATION)
            : m();
        }
      }),
      (h.prototype.applyPlacement = function (e, i) {
        var o = this.tip(),
          n = o[0].offsetWidth,
          r = o[0].offsetHeight,
          s = parseInt(o.css("margin-top"), 10),
          a = parseInt(o.css("margin-left"), 10);
        isNaN(s) && (s = 0),
          isNaN(a) && (a = 0),
          (e.top += s),
          (e.left += a),
          t.offset.setOffset(
            o[0],
            t.extend(
              {
                using: function (t) {
                  o.css({ top: Math.round(t.top), left: Math.round(t.left) });
                },
              },
              e
            ),
            0
          ),
          o.addClass("in");
        var p = o[0].offsetWidth,
          l = o[0].offsetHeight;
        "top" == i && l != r && (e.top = e.top + r - l);
        var h = this.getViewportAdjustedDelta(i, e, p, l);
        h.left ? (e.left += h.left) : (e.top += h.top);
        var u = /top|bottom/.test(i),
          c = u ? 2 * h.left - n + p : 2 * h.top - r + l,
          f = u ? "offsetWidth" : "offsetHeight";
        o.offset(e), this.replaceArrow(c, o[0][f], u);
      }),
      (h.prototype.replaceArrow = function (t, e, i) {
        this.arrow()
          .css(i ? "left" : "top", 50 * (1 - t / e) + "%")
          .css(i ? "top" : "left", "");
      }),
      (h.prototype.setContent = function () {
        var t = this.tip(),
          e = this.getTitle();
        this.options.html
          ? (this.options.sanitize &&
              (e = i(e, this.options.whiteList, this.options.sanitizeFn)),
            t.find(".tooltip-inner").html(e))
          : t.find(".tooltip-inner").text(e),
          t.removeClass("fade in top bottom left right");
      }),
      (h.prototype.hide = function (e) {
        function i() {
          "in" != o.hoverState && n.detach(),
            o.$element &&
              o.$element
                .removeAttr("aria-describedby")
                .trigger("hidden.bs." + o.type),
            e && e();
        }
        var o = this,
          n = t(this.$tip),
          r = t.Event("hide.bs." + this.type);
        return (
          this.$element.trigger(r),
          r.isDefaultPrevented()
            ? void 0
            : (n.removeClass("in"),
              t.support.transition && n.hasClass("fade")
                ? n
                    .one("bsTransitionEnd", i)
                    .emulateTransitionEnd(h.TRANSITION_DURATION)
                : i(),
              (this.hoverState = null),
              this)
        );
      }),
      (h.prototype.fixTitle = function () {
        var t = this.$element;
        (t.attr("title") || "string" != typeof t.attr("data-original-title")) &&
          t
            .attr("data-original-title", t.attr("title") || "")
            .attr("title", "");
      }),
      (h.prototype.hasContent = function () {
        return this.getTitle();
      }),
      (h.prototype.getPosition = function (e) {
        e = e || this.$element;
        var i = e[0],
          o = "BODY" == i.tagName,
          n = i.getBoundingClientRect();
        null == n.width &&
          (n = t.extend({}, n, {
            width: n.right - n.left,
            height: n.bottom - n.top,
          }));
        var r = window.SVGElement && i instanceof window.SVGElement,
          s = o ? { top: 0, left: 0 } : r ? null : e.offset(),
          a = {
            scroll: o
              ? document.documentElement.scrollTop || document.body.scrollTop
              : e.scrollTop(),
          },
          p = o
            ? { width: t(window).width(), height: t(window).height() }
            : null;
        return t.extend({}, n, a, p, s);
      }),
      (h.prototype.getCalculatedOffset = function (t, e, i, o) {
        return "bottom" == t
          ? { top: e.top + e.height, left: e.left + e.width / 2 - i / 2 }
          : "top" == t
          ? { top: e.top - o, left: e.left + e.width / 2 - i / 2 }
          : "left" == t
          ? { top: e.top + e.height / 2 - o / 2, left: e.left - i }
          : { top: e.top + e.height / 2 - o / 2, left: e.left + e.width };
      }),
      (h.prototype.getViewportAdjustedDelta = function (t, e, i, o) {
        var n = { top: 0, left: 0 };
        if (!this.$viewport) return n;
        var r = (this.options.viewport && this.options.viewport.padding) || 0,
          s = this.getPosition(this.$viewport);
        if (/right|left/.test(t)) {
          var a = e.top - r - s.scroll,
            p = e.top + r - s.scroll + o;
          a < s.top
            ? (n.top = s.top - a)
            : p > s.top + s.height && (n.top = s.top + s.height - p);
        } else {
          var l = e.left - r,
            h = e.left + r + i;
          l < s.left
            ? (n.left = s.left - l)
            : h > s.right && (n.left = s.left + s.width - h);
        }
        return n;
      }),
      (h.prototype.getTitle = function () {
        var t,
          e = this.$element,
          i = this.options;
        return (t =
          e.attr("data-original-title") ||
          ("function" == typeof i.title ? i.title.call(e[0]) : i.title));
      }),
      (h.prototype.getUID = function (t) {
        do t += ~~(1e6 * Math.random());
        while (document.getElementById(t));
        return t;
      }),
      (h.prototype.tip = function () {
        if (
          !this.$tip &&
          ((this.$tip = t(this.options.template)), 1 != this.$tip.length)
        )
          throw new Error(
            this.type +
              " `template` option must consist of exactly 1 top-level element!"
          );
        return this.$tip;
      }),
      (h.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"));
      }),
      (h.prototype.enable = function () {
        this.enabled = !0;
      }),
      (h.prototype.disable = function () {
        this.enabled = !1;
      }),
      (h.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled;
      }),
      (h.prototype.toggle = function (e) {
        var i = this;
        e &&
          ((i = t(e.currentTarget).data("bs." + this.type)),
          i ||
            ((i = new this.constructor(
              e.currentTarget,
              this.getDelegateOptions()
            )),
            t(e.currentTarget).data("bs." + this.type, i))),
          e
            ? ((i.inState.click = !i.inState.click),
              i.isInStateTrue() ? i.enter(i) : i.leave(i))
            : i.tip().hasClass("in")
            ? i.leave(i)
            : i.enter(i);
      }),
      (h.prototype.destroy = function () {
        var t = this;
        clearTimeout(this.timeout),
          this.hide(function () {
            t.$element.off("." + t.type).removeData("bs." + t.type),
              t.$tip && t.$tip.detach(),
              (t.$tip = null),
              (t.$arrow = null),
              (t.$viewport = null),
              (t.$element = null);
          });
      }),
      (h.prototype.sanitizeHtml = function (t) {
        return i(t, this.options.whiteList, this.options.sanitizeFn);
      });
    var u = t.fn.OVICtooltip;
    (t.fn.OVICtooltip = o),
      (t.fn.OVICtooltip.Constructor = h),
      (t.fn.OVICtooltip.noConflict = function () {
        return (t.fn.OVICtooltip = u), this;
      });
  })(jQuery),
  +(function (t) {
    "use strict";
    function e(e) {
      return this.each(function () {
        var o = t(this),
          n = o.data("bs.OVICpopover"),
          r = "object" == typeof e && e;
        (n || !/destroy|hide/.test(e)) &&
          (n || o.data("bs.OVICpopover", (n = new i(this, r))),
          "string" == typeof e && n[e]());
      });
    }
    var i = function (t, e) {
      this.init("OVICpopover", t, e);
    };
    if (!t.fn.OVICtooltip) throw new Error("Popover requires OVICtooltip.js");
    (i.VERSION = "3.4.1"),
      (i.DEFAULTS = t.extend({}, t.fn.OVICtooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template:
          '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
      })),
      (i.prototype = t.extend({}, t.fn.OVICtooltip.Constructor.prototype)),
      (i.prototype.constructor = i),
      (i.prototype.getDefaults = function () {
        return i.DEFAULTS;
      }),
      (i.prototype.setContent = function () {
        var t = this.tip(),
          e = this.getTitle(),
          i = this.getContent();
        if (this.options.html) {
          var o = typeof i;
          this.options.sanitize &&
            ((e = this.sanitizeHtml(e)),
            "string" === o && (i = this.sanitizeHtml(i))),
            t.find(".popover-title").html(e),
            t
              .find(".popover-content")
              .children()
              .detach()
              .end()
              ["string" === o ? "html" : "append"](i);
        } else
          t.find(".popover-title").text(e),
            t.find(".popover-content").children().detach().end().text(i);
        t.removeClass("fade top bottom left right in"),
          t.find(".popover-title").html() || t.find(".popover-title").hide();
      }),
      (i.prototype.hasContent = function () {
        return this.getTitle() || this.getContent();
      }),
      (i.prototype.getContent = function () {
        var t = this.$element,
          e = this.options;
        return (
          t.attr("data-content") ||
          ("function" == typeof e.content ? e.content.call(t[0]) : e.content)
        );
      }),
      (i.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find(".arrow"));
      });
    var o = t.fn.OVICpopover;
    (t.fn.OVICpopover = e),
      (t.fn.OVICpopover.Constructor = i),
      (t.fn.OVICpopover.noConflict = function () {
        return (t.fn.OVICpopover = o), this;
      });
  })(jQuery);
