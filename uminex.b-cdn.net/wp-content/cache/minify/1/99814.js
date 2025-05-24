!(function () {
  "use strict";
  const e = (e) => Math.abs(parseInt(e, 10)),
    t = (e, t, a) => {
      const n = new CustomEvent(`wpcf7${t}`, { bubbles: !0, detail: a });
      "string" == typeof e && (e = document.querySelector(e)),
        e.dispatchEvent(n);
    },
    a = (e, a) => {
      const n = new Map([
        ["init", "init"],
        ["validation_failed", "invalid"],
        ["acceptance_missing", "unaccepted"],
        ["spam", "spam"],
        ["aborted", "aborted"],
        ["mail_sent", "sent"],
        ["mail_failed", "failed"],
        ["submitting", "submitting"],
        ["resetting", "resetting"],
        ["validating", "validating"],
        ["payment_required", "payment-required"],
      ]);
      n.has(a) && (a = n.get(a)),
        Array.from(n.values()).includes(a) ||
          (a = `custom-${(a = (a = a
            .replace(/[^0-9a-z]+/i, " ")
            .trim()).replace(/\s+/, "-"))}`);
      const r = e.getAttribute("data-status");
      if (
        ((e.wpcf7.status = a),
        e.setAttribute("data-status", a),
        e.classList.add(a),
        r && r !== a)
      ) {
        e.classList.remove(r);
        const a = {
          contactFormId: e.wpcf7.id,
          pluginVersion: e.wpcf7.pluginVersion,
          contactFormLocale: e.wpcf7.locale,
          unitTag: e.wpcf7.unitTag,
          containerPostId: e.wpcf7.containerPost,
          status: e.wpcf7.status,
          prevStatus: r,
        };
        t(e, "statuschanged", a);
      }
      return a;
    },
    n = (e) => {
      const { root: t, namespace: a = "contact-form-7/v1" } = wpcf7.api;
      return r.reduceRight(
        (e, t) => (a) => t(a, e),
        (e) => {
          let n,
            r,
            {
              url: o,
              path: c,
              endpoint: s,
              headers: i,
              body: l,
              data: d,
              ...p
            } = e;
          "string" == typeof s &&
            ((n = a.replace(/^\/|\/$/g, "")),
            (r = s.replace(/^\//, "")),
            (c = r ? n + "/" + r : n)),
            "string" == typeof c &&
              (-1 !== t.indexOf("?") && (c = c.replace("?", "&")),
              (c = c.replace(/^\//, "")),
              (o = t + c)),
            (i = { Accept: "application/json, */*;q=0.1", ...i }),
            delete i["X-WP-Nonce"],
            d &&
              ((l = JSON.stringify(d)),
              (i["Content-Type"] = "application/json"));
          const u = {
              code: "fetch_error",
              message: "You are probably offline.",
            },
            f = {
              code: "invalid_json",
              message: "The response is not a valid JSON response.",
            };
          return window
            .fetch(o || c || window.location.href, {
              ...p,
              headers: i,
              body: l,
            })
            .then(
              (e) =>
                Promise.resolve(e)
                  .then((e) => {
                    if (e.status >= 200 && e.status < 300) return e;
                    throw e;
                  })
                  .then((e) => {
                    if (204 === e.status) return null;
                    if (e && e.json)
                      return e.json().catch(() => {
                        throw f;
                      });
                    throw f;
                  }),
              () => {
                throw u;
              }
            );
        }
      )(e);
    },
    r = [];
  function o(e, t = {}) {
    var n;
    const { target: r, scope: o = e, ...l } = t;
    if (void 0 === e.wpcf7?.schema) return;
    const d = { ...e.wpcf7.schema };
    if (void 0 !== r) {
      if (!e.contains(r)) return;
      if (!r.closest(".wpcf7-form-control-wrap[data-name]")) return;
      if (r.closest(".novalidate")) return;
    }
    const p = new FormData(),
      u = [];
    for (const e of o.querySelectorAll(".wpcf7-form-control-wrap"))
      if (
        !e.closest(".novalidate") &&
        (e
          .querySelectorAll(":where( input, textarea, select ):enabled")
          .forEach((e) => {
            if (e.name)
              switch (e.type) {
                case "button":
                case "image":
                case "reset":
                case "submit":
                  break;
                case "checkbox":
                case "radio":
                  e.checked && p.append(e.name, e.value);
                  break;
                case "select-multiple":
                  for (const t of e.selectedOptions) p.append(e.name, t.value);
                  break;
                case "file":
                  for (const t of e.files) p.append(e.name, t);
                  break;
                default:
                  p.append(e.name, e.value);
              }
          }),
        e.dataset.name &&
          (u.push(e.dataset.name),
          e.setAttribute("data-under-validation", "1"),
          e.contains(r)))
      )
        break;
    d.rules = (null !== (n = d.rules) && void 0 !== n ? n : []).filter(
      ({ field: e }) => u.includes(e)
    );
    const f = e.getAttribute("data-status");
    Promise.resolve(a(e, "validating"))
      .then((a) => {
        if (void 0 !== swv) {
          const a = swv.validate(d, p, t);
          for (const [t, { error: n, validInputs: r }] of a)
            s(e, t),
              void 0 !== n && c(e, t, n, { scope: o }),
              i(e, t, null != r ? r : []);
        }
      })
      .finally(() => {
        a(e, f),
          e
            .querySelectorAll(".wpcf7-form-control-wrap[data-under-validation]")
            .forEach((e) => {
              e.removeAttribute("data-under-validation");
            });
      });
  }
  n.use = (e) => {
    r.unshift(e);
  };
  const c = (e, t, a, n) => {
      const { scope: r = e, ...o } = null != n ? n : {},
        c = `${e.wpcf7?.unitTag}-ve-${t}`.replaceAll(/[^0-9a-z_-]+/gi, ""),
        s = e.querySelector(
          `.wpcf7-form-control-wrap[data-name="${t}"] .wpcf7-form-control`
        );
      (() => {
        const t = document.createElement("li");
        t.setAttribute("id", c),
          s && s.id
            ? t.insertAdjacentHTML("beforeend", `<a href="#${s.id}">${a}</a>`)
            : t.insertAdjacentText("beforeend", a),
          e.wpcf7.parent
            .querySelector(".screen-reader-response ul")
            .appendChild(t);
      })(),
        r
          .querySelectorAll(`.wpcf7-form-control-wrap[data-name="${t}"]`)
          .forEach((t) => {
            if (
              "validating" === e.getAttribute("data-status") &&
              !t.dataset.underValidation
            )
              return;
            const n = document.createElement("span");
            n.classList.add("wpcf7-not-valid-tip"),
              n.setAttribute("aria-hidden", "true"),
              n.insertAdjacentText("beforeend", a),
              t.appendChild(n),
              t.querySelectorAll("[aria-invalid]").forEach((e) => {
                e.setAttribute("aria-invalid", "true");
              }),
              t.querySelectorAll(".wpcf7-form-control").forEach((e) => {
                e.classList.add("wpcf7-not-valid"),
                  e.setAttribute("aria-describedby", c),
                  "function" == typeof e.setCustomValidity &&
                    e.setCustomValidity(a),
                  e.closest(".use-floating-validation-tip") &&
                    (e.addEventListener("focus", (e) => {
                      n.setAttribute("style", "display: none");
                    }),
                    n.addEventListener("click", (e) => {
                      n.setAttribute("style", "display: none");
                    }));
              });
          });
    },
    s = (e, t) => {
      const a = `${e.wpcf7?.unitTag}-ve-${t}`.replaceAll(/[^0-9a-z_-]+/gi, "");
      e.wpcf7.parent
        .querySelector(`.screen-reader-response ul li#${a}`)
        ?.remove(),
        e
          .querySelectorAll(`.wpcf7-form-control-wrap[data-name="${t}"]`)
          .forEach((e) => {
            e.querySelector(".wpcf7-not-valid-tip")?.remove(),
              e.querySelectorAll("[aria-invalid]").forEach((e) => {
                e.setAttribute("aria-invalid", "false");
              }),
              e.querySelectorAll(".wpcf7-form-control").forEach((e) => {
                e.removeAttribute("aria-describedby"),
                  e.classList.remove("wpcf7-not-valid"),
                  "function" == typeof e.setCustomValidity &&
                    e.setCustomValidity("");
              });
          });
    },
    i = (e, t, a) => {
      e.querySelectorAll(`[data-reflection-of="${t}"]`).forEach((e) => {
        if ("output" === e.tagName.toLowerCase()) {
          const t = e;
          0 === a.length && a.push(t.dataset.default),
            a.slice(0, 1).forEach((e) => {
              e instanceof File && (e = e.name), (t.textContent = e);
            });
        } else
          e.querySelectorAll("output").forEach((e) => {
            e.hasAttribute("data-default")
              ? 0 === a.length
                ? e.removeAttribute("hidden")
                : e.setAttribute("hidden", "hidden")
              : e.remove();
          }),
            a.forEach((a) => {
              a instanceof File && (a = a.name);
              const n = document.createElement("output");
              n.setAttribute("name", t), (n.textContent = a), e.appendChild(n);
            });
      });
    };
  function l(e, r = {}) {
    if (wpcf7.blocked) return d(e), void a(e, "submitting");
    const o = new FormData(e);
    r.submitter &&
      r.submitter.name &&
      o.append(r.submitter.name, r.submitter.value);
    const s = {
      contactFormId: e.wpcf7.id,
      pluginVersion: e.wpcf7.pluginVersion,
      contactFormLocale: e.wpcf7.locale,
      unitTag: e.wpcf7.unitTag,
      containerPostId: e.wpcf7.containerPost,
      status: e.wpcf7.status,
      inputs: Array.from(o, (e) => {
        const t = e[0],
          a = e[1];
        return !t.match(/^_/) && { name: t, value: a };
      }).filter((e) => !1 !== e),
      formData: o,
    };
    n({
      endpoint: `contact-forms/${e.wpcf7.id}/feedback`,
      method: "POST",
      body: o,
      wpcf7: { endpoint: "feedback", form: e, detail: s },
    })
      .then((n) => {
        const r = a(e, n.status);
        return (
          (s.status = n.status),
          (s.apiResponse = n),
          ["invalid", "unaccepted", "spam", "aborted"].includes(r)
            ? t(e, r, s)
            : ["sent", "failed"].includes(r) && t(e, `mail${r}`, s),
          t(e, "submit", s),
          n
        );
      })
      .then((t) => {
        t.posted_data_hash &&
          (e.querySelector('input[name="_wpcf7_posted_data_hash"]').value =
            t.posted_data_hash),
          "mail_sent" === t.status &&
            (e.reset(), (e.wpcf7.resetOnMailSent = !0)),
          t.invalid_fields &&
            t.invalid_fields.forEach((t) => {
              c(e, t.field, t.message);
            }),
          e.wpcf7.parent
            .querySelector('.screen-reader-response [role="status"]')
            .insertAdjacentText("beforeend", t.message),
          e.querySelectorAll(".wpcf7-response-output").forEach((e) => {
            e.innerText = t.message;
          });
      })
      .catch((e) => console.error(e));
  }
  n.use((e, n) => {
    if (e.wpcf7 && "feedback" === e.wpcf7.endpoint) {
      const { form: n, detail: r } = e.wpcf7;
      d(n), t(n, "beforesubmit", r), a(n, "submitting");
    }
    return n(e);
  });
  const d = (e) => {
    e.querySelectorAll(".wpcf7-form-control-wrap").forEach((t) => {
      t.dataset.name && s(e, t.dataset.name);
    }),
      (e.wpcf7.parent.querySelector(
        '.screen-reader-response [role="status"]'
      ).innerText = ""),
      e.querySelectorAll(".wpcf7-response-output").forEach((e) => {
        e.innerText = "";
      });
  };
  function p(e) {
    const r = new FormData(e),
      o = {
        contactFormId: e.wpcf7.id,
        pluginVersion: e.wpcf7.pluginVersion,
        contactFormLocale: e.wpcf7.locale,
        unitTag: e.wpcf7.unitTag,
        containerPostId: e.wpcf7.containerPost,
        status: e.wpcf7.status,
        inputs: Array.from(r, (e) => {
          const t = e[0],
            a = e[1];
          return !t.match(/^_/) && { name: t, value: a };
        }).filter((e) => !1 !== e),
        formData: r,
      };
    n({
      endpoint: `contact-forms/${e.wpcf7.id}/refill`,
      method: "GET",
      wpcf7: { endpoint: "refill", form: e, detail: o },
    })
      .then((n) => {
        e.wpcf7.resetOnMailSent
          ? (delete e.wpcf7.resetOnMailSent, a(e, "mail_sent"))
          : a(e, "init"),
          (o.apiResponse = n),
          t(e, "reset", o);
      })
      .catch((e) => console.error(e));
  }
  n.use((e, t) => {
    if (e.wpcf7 && "refill" === e.wpcf7.endpoint) {
      const { form: t, detail: n } = e.wpcf7;
      d(t), a(t, "resetting");
    }
    return t(e);
  });
  const u = (e, t) => {
      for (const a in t) {
        const n = t[a];
        e.querySelectorAll(`input[name="${a}"]`).forEach((e) => {
          e.value = "";
        }),
          e
            .querySelectorAll(`img.wpcf7-captcha-${a.replaceAll(":", "")}`)
            .forEach((e) => {
              e.setAttribute("src", n);
            });
        const r = /([0-9]+)\.(png|gif|jpeg)$/.exec(n);
        r &&
          e
            .querySelectorAll(`input[name="_wpcf7_captcha_challenge_${a}"]`)
            .forEach((e) => {
              e.value = r[1];
            });
      }
    },
    f = (e, t) => {
      for (const a in t) {
        const n = t[a][0],
          r = t[a][1];
        e.querySelectorAll(
          `.wpcf7-form-control-wrap[data-name="${a}"]`
        ).forEach((e) => {
          (e.querySelector(`input[name="${a}"]`).value = ""),
            (e.querySelector(".wpcf7-quiz-label").textContent = n),
            (e.querySelector(`input[name="_wpcf7_quiz_answer_${a}"]`).value =
              r);
        });
      }
    };
  function m(t) {
    const a = new FormData(t);
    (t.wpcf7 = {
      id: e(a.get("_wpcf7")),
      status: t.getAttribute("data-status"),
      pluginVersion: a.get("_wpcf7_version"),
      locale: a.get("_wpcf7_locale"),
      unitTag: a.get("_wpcf7_unit_tag"),
      containerPost: e(a.get("_wpcf7_container_post")),
      parent: t.closest(".wpcf7"),
      schema: void 0,
    }),
      t.querySelectorAll(".has-spinner").forEach((e) => {
        e.insertAdjacentHTML("afterend", '<span class="wpcf7-spinner"></span>');
      }),
      ((e) => {
        e.querySelectorAll(".wpcf7-exclusive-checkbox").forEach((t) => {
          t.addEventListener("change", (t) => {
            const a = t.target.getAttribute("name");
            e.querySelectorAll(`input[type="checkbox"][name="${a}"]`).forEach(
              (e) => {
                e !== t.target && (e.checked = !1);
              }
            );
          });
        });
      })(t),
      ((e) => {
        e.querySelectorAll(".has-free-text").forEach((t) => {
          const a = t.querySelector("input.wpcf7-free-text"),
            n = t.querySelector('input[type="checkbox"], input[type="radio"]');
          (a.disabled = !n.checked),
            e.addEventListener("change", (e) => {
              (a.disabled = !n.checked),
                e.target === n && n.checked && a.focus();
            });
        });
      })(t),
      ((e) => {
        e.querySelectorAll(".wpcf7-validates-as-url").forEach((e) => {
          e.addEventListener("change", (t) => {
            let a = e.value.trim();
            a &&
              !a.match(/^[a-z][a-z0-9.+-]*:/i) &&
              -1 !== a.indexOf(".") &&
              ((a = a.replace(/^\/+/, "")), (a = "http://" + a)),
              (e.value = a);
          });
        });
      })(t),
      ((e) => {
        if (
          !e.querySelector(".wpcf7-acceptance") ||
          e.classList.contains("wpcf7-acceptance-as-validation")
        )
          return;
        const t = () => {
          let t = !0;
          e.querySelectorAll(".wpcf7-acceptance").forEach((e) => {
            if (!t || e.classList.contains("optional")) return;
            const a = e.querySelector('input[type="checkbox"]');
            ((e.classList.contains("invert") && a.checked) ||
              (!e.classList.contains("invert") && !a.checked)) &&
              (t = !1);
          }),
            e.querySelectorAll(".wpcf7-submit").forEach((e) => {
              e.disabled = !t;
            });
        };
        t(),
          e.addEventListener("change", (e) => {
            t();
          }),
          e.addEventListener("wpcf7reset", (e) => {
            t();
          });
      })(t),
      ((t) => {
        const a = (t, a) => {
            const n = e(t.getAttribute("data-starting-value")),
              r = e(t.getAttribute("data-maximum-value")),
              o = e(t.getAttribute("data-minimum-value")),
              c = t.classList.contains("down")
                ? n - a.value.length
                : a.value.length;
            t.setAttribute("data-current-value", c),
              (t.innerText = c),
              r && r < a.value.length
                ? t.classList.add("too-long")
                : t.classList.remove("too-long"),
              o && a.value.length < o
                ? t.classList.add("too-short")
                : t.classList.remove("too-short");
          },
          n = (e) => {
            (e = { init: !1, ...e }),
              t.querySelectorAll(".wpcf7-character-count").forEach((n) => {
                const r = n.getAttribute("data-target-name"),
                  o = t.querySelector(`[name="${r}"]`);
                o &&
                  ((o.value = o.defaultValue),
                  a(n, o),
                  e.init &&
                    o.addEventListener("keyup", (e) => {
                      a(n, o);
                    }));
              });
          };
        n({ init: !0 }),
          t.addEventListener("wpcf7reset", (e) => {
            n();
          });
      })(t),
      window.addEventListener("load", (e) => {
        wpcf7.cached && t.reset();
      }),
      t.addEventListener("reset", (e) => {
        wpcf7.reset(t);
      }),
      t.addEventListener("submit", (e) => {
        wpcf7.submit(t, { submitter: e.submitter }), e.preventDefault();
      }),
      t.addEventListener("wpcf7submit", (e) => {
        e.detail.apiResponse.captcha && u(t, e.detail.apiResponse.captcha),
          e.detail.apiResponse.quiz && f(t, e.detail.apiResponse.quiz);
      }),
      t.addEventListener("wpcf7reset", (e) => {
        e.detail.apiResponse.captcha && u(t, e.detail.apiResponse.captcha),
          e.detail.apiResponse.quiz && f(t, e.detail.apiResponse.quiz);
      }),
      n({
        endpoint: `contact-forms/${t.wpcf7.id}/feedback/schema`,
        method: "GET",
      }).then((e) => {
        t.wpcf7.schema = e;
      }),
      t.addEventListener("change", (e) => {
        e.target.closest(".wpcf7-form-control") &&
          wpcf7.validate(t, { target: e.target });
      }),
      t.addEventListener("wpcf7statuschanged", (e) => {
        const a = e.detail.status;
        t.querySelectorAll(".active-on-any").forEach((e) => {
          e.removeAttribute("inert"), e.classList.remove("active-on-any");
        }),
          t.querySelectorAll(`.inert-on-${a}`).forEach((e) => {
            e.setAttribute("inert", "inert"), e.classList.add("active-on-any");
          });
      });
  }
  document.addEventListener("DOMContentLoaded", (e) => {
    var t;
    "undefined" != typeof wpcf7
      ? void 0 !== wpcf7.api
        ? "function" == typeof window.fetch
          ? "function" == typeof window.FormData
            ? "function" == typeof NodeList.prototype.forEach
              ? "function" == typeof String.prototype.replaceAll
                ? ((wpcf7 = {
                    init: m,
                    submit: l,
                    reset: p,
                    validate: o,
                    ...(null !== (t = wpcf7) && void 0 !== t ? t : {}),
                  }),
                  document.querySelectorAll(".wpcf7 > form").forEach((e) => {
                    wpcf7.init(e),
                      e.closest(".wpcf7").classList.replace("no-js", "js");
                  }))
                : console.error(
                    "Your browser does not support String.replaceAll()."
                  )
              : console.error(
                  "Your browser does not support NodeList.forEach()."
                )
            : console.error("Your browser does not support window.FormData().")
          : console.error("Your browser does not support window.fetch().")
        : console.error("wpcf7.api is not defined.")
      : console.error("wpcf7 is not defined.");
  });
})();
var _createClass = (function () {
  function a(e, d) {
    for (var c = 0; c < d.length; c++) {
      var b = d[c];
      b.enumerable = b.enumerable || false;
      b.configurable = true;
      if ("value" in b) {
        b.writable = true;
      }
      Object.defineProperty(e, b.key, b);
    }
  }
  return function (b, c, d) {
    if (c) {
      a(b.prototype, c);
    }
    if (d) {
      a(b, d);
    }
    return b;
  };
})();
function _classCallCheck(b, a) {
  if (!(b instanceof a)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
(function () {
  var a, b, c;
  a = jQuery;
  b = (function () {
    var d = (function () {
      function e() {
        _classCallCheck(this, e);
      }
      _createClass(e, null, [
        {
          key: "transition",
          value: function f(g) {
            var h, i, j, k;
            h = g[0];
            i = this.transitions;
            for (k in i) {
              j = i[k];
              if (h.style[k] != null) {
                return j;
              }
            }
          },
        },
      ]);
      return e;
    })();
    d.transitions = {
      webkitTransition: "webkitTransitionEnd",
      mozTransition: "mozTransitionEnd",
      oTransition: "oTransitionEnd",
      transition: "transitionend",
    };
    return d;
  })();
  c = (function () {
    var d = (function () {
      _createClass(p, null, [
        {
          key: "growl",
          value: function o() {
            var z =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : {};
            return new p(z);
          },
        },
      ]);
      function p() {
        var z =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};
        _classCallCheck(this, p);
        this.render = this.render.bind(this);
        this.bind = this.bind.bind(this);
        this.unbind = this.unbind.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.click = this.click.bind(this);
        this.close = this.close.bind(this);
        this.cycle = this.cycle.bind(this);
        this.waitAndDismiss = this.waitAndDismiss.bind(this);
        this.present = this.present.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this.remove = this.remove.bind(this);
        this.animate = this.animate.bind(this);
        this.$growls = this.$growls.bind(this);
        this.$growl = this.$growl.bind(this);
        this.html = this.html.bind(this);
        this.content = this.content.bind(this);
        this.container = this.container.bind(this);
        this.settings = a.extend({}, p.settings, z);
        this.initialize(this.settings.location);
        this.render();
      }
      _createClass(p, [
        {
          key: "initialize",
          value: function r(A) {
            var z;
            z = "growls-" + A;
            return a("body:not(:has(#" + z + "))").append(
              '<div id="' + z + '" />'
            );
          },
        },
        {
          key: "render",
          value: function w() {
            var z;
            z = this.$growl();
            this.$growls(this.settings.location).append(z);
            if (this.settings.fixed) {
              this.present();
            } else {
              this.cycle();
            }
          },
        },
        {
          key: "bind",
          value: function h() {
            var z =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.$growl();
            z.on("click", this.click);
            if (this.settings.delayOnHover) {
              z.on("mouseenter", this.mouseEnter);
              z.on("mouseleave", this.mouseLeave);
            }
            return z
              .on("contextmenu", this.close)
              .find("." + this.settings.namespace + "-close")
              .on("click", this.close);
          },
        },
        {
          key: "unbind",
          value: function x() {
            var z =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.$growl();
            z.off("click", this.click);
            if (this.settings.delayOnHover) {
              z.off("mouseenter", this.mouseEnter);
              z.off("mouseleave", this.mouseLeave);
            }
            return z
              .off("contextmenu", this.close)
              .find("." + this.settings.namespace + "-close")
              .off("click", this.close);
          },
        },
        {
          key: "mouseEnter",
          value: function s(A) {
            var z;
            z = this.$growl();
            return z.stop(true, true);
          },
        },
        {
          key: "mouseLeave",
          value: function t(z) {
            return this.waitAndDismiss();
          },
        },
        {
          key: "click",
          value: function i(z) {
            if (this.settings.url != null) {
              z.preventDefault();
              z.stopPropagation();
              return window.open(this.settings.url);
            }
          },
        },
        {
          key: "close",
          value: function j(A) {
            var z;
            A.preventDefault();
            A.stopPropagation();
            z = this.$growl();
            return z.stop().queue(this.dismiss).queue(this.remove);
          },
        },
        {
          key: "cycle",
          value: function m() {
            var z;
            z = this.$growl();
            return z.queue(this.present).queue(this.waitAndDismiss());
          },
        },
        {
          key: "waitAndDismiss",
          value: function y() {
            var z;
            z = this.$growl();
            return z
              .delay(this.settings.duration)
              .queue(this.dismiss)
              .queue(this.remove);
          },
        },
        {
          key: "present",
          value: function u(A) {
            var z;
            z = this.$growl();
            this.bind(z);
            return this.animate(
              z,
              this.settings.namespace + "-incoming",
              "out",
              A
            );
          },
        },
        {
          key: "dismiss",
          value: function n(A) {
            var z;
            z = this.$growl();
            this.unbind(z);
            return this.animate(
              z,
              this.settings.namespace + "-outgoing",
              "in",
              A
            );
          },
        },
        {
          key: "remove",
          value: function v(z) {
            this.$growl().remove();
            return typeof z === "function" ? z() : void 0;
          },
        },
        {
          key: "animate",
          value: function g(z, C) {
            var B =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : "in";
            var A = arguments[3];
            var D;
            D = b.transition(z);
            z[B === "in" ? "removeClass" : "addClass"](C);
            z.offset().position;
            z[B === "in" ? "addClass" : "removeClass"](C);
            if (A == null) {
              return;
            }
            if (D != null) {
              z.one(D, A);
            } else {
              A();
            }
          },
        },
        {
          key: "$growls",
          value: function f(A) {
            var z;
            if (this.$_growls == null) {
              this.$_growls = [];
            }
            return (z = this.$_growls)[A] != null
              ? z[A]
              : (z[A] = a("#growls-" + A));
          },
        },
        {
          key: "$growl",
          value: function e() {
            return this.$_growl != null
              ? this.$_growl
              : (this.$_growl = a(this.html()));
          },
        },
        {
          key: "html",
          value: function q() {
            return this.container(this.content());
          },
        },
        {
          key: "content",
          value: function l() {
            return (
              "<div class='" +
              this.settings.namespace +
              "-close'>" +
              this.settings.close +
              "</div>\n<div class='" +
              this.settings.namespace +
              "-title'>" +
              this.settings.title +
              "</div>\n<div class='" +
              this.settings.namespace +
              "-message'>" +
              this.settings.message +
              "</div>"
            );
          },
        },
        {
          key: "container",
          value: function k(z) {
            return (
              "<div class='" +
              this.settings.namespace +
              " " +
              this.settings.namespace +
              "-" +
              this.settings.style +
              " " +
              this.settings.namespace +
              "-" +
              this.settings.size +
              "'>\n  " +
              z +
              "\n</div>"
            );
          },
        },
      ]);
      return p;
    })();
    d.settings = {
      namespace: "growl",
      duration: 3200,
      close: "&#215;",
      location: "default",
      style: "default",
      size: "medium",
      delayOnHover: true,
    };
    return d;
  })();
  this.Growl = c;
  a.growl = function () {
    var d =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return c.growl(d);
  };
  a.growl.error = function () {
    var d =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var e;
    e = { title: "Error!", style: "error" };
    return a.growl(a.extend(e, d));
  };
  a.growl.notice = function () {
    var d =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var e;
    e = { title: "Notice!", style: "notice" };
    return a.growl(a.extend(e, d));
  };
  a.growl.warning = function () {
    var d =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var e;
    e = { title: "Warning!", style: "warning" };
    return a.growl(a.extend(e, d));
  };
}).call(this);
