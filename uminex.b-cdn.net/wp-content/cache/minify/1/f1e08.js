/*!
 * The Final Countdown for jQuery v2.2.0 (http://hilios.github.io/jQuery.countdown/)
 * Copyright (c) 2016 Edson Hilios
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
!(function (a) {
  "use strict";
  "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery);
})(function (a) {
  "use strict";
  function b(a) {
    if (a instanceof Date) return a;
    if (String(a).match(g))
      return (
        String(a).match(/^[0-9]*$/) && (a = Number(a)),
        String(a).match(/\-/) && (a = String(a).replace(/\-/g, "/")),
        new Date(a)
      );
    throw new Error("Couldn't cast `" + a + "` to a date object.");
  }
  function c(a) {
    var b = a.toString().replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    return new RegExp(b);
  }
  function d(a) {
    return function (b) {
      var d = b.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
      if (d)
        for (var f = 0, g = d.length; f < g; ++f) {
          var h = d[f].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),
            j = c(h[0]),
            k = h[1] || "",
            l = h[3] || "",
            m = null;
          (h = h[2]),
            i.hasOwnProperty(h) && ((m = i[h]), (m = Number(a[m]))),
            null !== m &&
              ("!" === k && (m = e(l, m)),
              "" === k && m < 10 && (m = "0" + m.toString()),
              (b = b.replace(j, m.toString())));
        }
      return (b = b.replace(/%%/, "%"));
    };
  }
  function e(a, b) {
    var c = "s",
      d = "";
    return (
      a &&
        ((a = a.replace(/(:|;|\s)/gi, "").split(/\,/)),
        1 === a.length ? (c = a[0]) : ((d = a[0]), (c = a[1]))),
      Math.abs(b) > 1 ? c : d
    );
  }
  var f = [],
    g = [],
    h = { precision: 100, elapse: !1, defer: !1 };
  g.push(/^[0-9]*$/.source),
    g.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),
    g.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),
    (g = new RegExp(g.join("|")));
  var i = {
      Y: "years",
      m: "months",
      n: "daysToMonth",
      d: "daysToWeek",
      w: "weeks",
      W: "weeksToMonth",
      H: "hours",
      M: "minutes",
      S: "seconds",
      D: "totalDays",
      I: "totalHours",
      N: "totalMinutes",
      T: "totalSeconds",
    },
    j = function (b, c, d) {
      (this.el = b),
        (this.$el = a(b)),
        (this.interval = null),
        (this.offset = {}),
        (this.options = a.extend({}, h)),
        (this.instanceNumber = f.length),
        f.push(this),
        this.$el.data("countdown-instance", this.instanceNumber),
        d &&
          ("function" == typeof d
            ? (this.$el.on("update.countdown", d),
              this.$el.on("stoped.countdown", d),
              this.$el.on("finish.countdown", d))
            : (this.options = a.extend({}, h, d))),
        this.setFinalDate(c),
        this.options.defer === !1 && this.start();
    };
  a.extend(j.prototype, {
    start: function () {
      null !== this.interval && clearInterval(this.interval);
      var a = this;
      this.update(),
        (this.interval = setInterval(function () {
          a.update.call(a);
        }, this.options.precision));
    },
    stop: function () {
      clearInterval(this.interval),
        (this.interval = null),
        this.dispatchEvent("stoped");
    },
    toggle: function () {
      this.interval ? this.stop() : this.start();
    },
    pause: function () {
      this.stop();
    },
    resume: function () {
      this.start();
    },
    remove: function () {
      this.stop.call(this),
        (f[this.instanceNumber] = null),
        delete this.$el.data().countdownInstance;
    },
    setFinalDate: function (a) {
      this.finalDate = b(a);
    },
    update: function () {
      if (0 === this.$el.closest("html").length) return void this.remove();
      var b,
        c = void 0 !== a._data(this.el, "events"),
        d = new Date();
      (b = this.finalDate.getTime() - d.getTime()),
        (b = Math.ceil(b / 1e3)),
        (b = !this.options.elapse && b < 0 ? 0 : Math.abs(b)),
        this.totalSecsLeft !== b &&
          c &&
          ((this.totalSecsLeft = b),
          (this.elapsed = d >= this.finalDate),
          (this.offset = {
            seconds: this.totalSecsLeft % 60,
            minutes: Math.floor(this.totalSecsLeft / 60) % 60,
            hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
            days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
            daysToWeek: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
            daysToMonth: Math.floor(
              (this.totalSecsLeft / 60 / 60 / 24) % 30.4368
            ),
            weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
            weeksToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7) % 4,
            months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30.4368),
            years: Math.abs(this.finalDate.getFullYear() - d.getFullYear()),
            totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
            totalHours: Math.floor(this.totalSecsLeft / 60 / 60),
            totalMinutes: Math.floor(this.totalSecsLeft / 60),
            totalSeconds: this.totalSecsLeft,
          }),
          this.options.elapse || 0 !== this.totalSecsLeft
            ? this.dispatchEvent("update")
            : (this.stop(), this.dispatchEvent("finish")));
    },
    dispatchEvent: function (b) {
      var c = a.Event(b + ".countdown");
      (c.finalDate = this.finalDate),
        (c.elapsed = this.elapsed),
        (c.offset = a.extend({}, this.offset)),
        (c.strftime = d(this.offset)),
        this.$el.trigger(c);
    },
  }),
    (a.fn.countdown = function () {
      var b = Array.prototype.slice.call(arguments, 0);
      return this.each(function () {
        var c = a(this).data("countdown-instance");
        if (void 0 !== c) {
          var d = f[c],
            e = b[0];
          j.prototype.hasOwnProperty(e)
            ? d[e].apply(d, b.slice(1))
            : null === String(e).match(/^[$A-Z_][0-9A-Z_$]*$/i)
            ? (d.setFinalDate.call(d, e), d.start())
            : a.error(
                "Method %s does not exist on jQuery.countdown".replace(
                  /\%s/gi,
                  e
                )
              );
        } else new j(this, b[0], b[1]);
      });
    });
});
(function ($) {
  "use strict";

  function get_digit(number) {
    var text = "",
      str = number.toString();

    for (var i = 0; i < str.length; i++) {
      text += '<span class="digit">' + str.charAt(i) + "</span>";
    }

    return text;
  }

  function countdown_event(el, event, data) {
    var $text_number = "",
      $days = parseInt(el.find(".days > .number").text()),
      $hours = parseInt(el.find(".hours > .number").text()),
      $mins = parseInt(el.find(".mins > .number").text());

    if (data.days_text !== undefined) {
      $text_number = "%-d";
      const num = event.strftime($text_number);

      if ($days != num) {
        el.find(".days > .number").html(num);
        el.find(".days > .number").attr("data-number", num);
        el.find(".days").addClass("flip");
      }
    }
    if (data.hrs_text !== undefined) {
      $text_number = "%H";
      if (data.days_text === undefined) {
        $text_number = "%I";
      }
      const num = event.strftime($text_number);

      if ($hours != num) {
        el.find(".hours > .number").html(num);
        el.find(".hours > .number").attr("data-number", num);
        el.find(".hours").addClass("flip");
      }
    }
    if (data.mins_text !== undefined) {
      $text_number = "%M";
      if (data.hrs_text === undefined) {
        $text_number = "%N";
      }
      const num = event.strftime($text_number);

      if ($mins != num) {
        el.find(".mins > .number").html(num);
        el.find(".mins > .number").attr("data-number", num);
        el.find(".mins").addClass("flip");
      }
    }
    if (data.secs_text !== undefined) {
      $text_number = "%S";
      if (data.mins_text === undefined) {
        $text_number = "%T";
      }
      const num = event.strftime($text_number);

      el.find(".secs > .number").html(num);
      el.find(".secs > .number").attr("data-number", num);
      el.find(".secs").addClass("flip");
    }
    setTimeout(function () {
      el.find(".time").removeClass("flip");
    }, 500);
  }
  $.fn.uminex_countdown = function () {
    $(this)
      .not(".loaded")
      .on("uminex_countdown", function () {
        $(this).each(function () {
          var el = $(this),
            data = el.data("params"),
            text_format = "",
            text_countdown = "";

          if (data.days_text !== undefined) {
            text_format += '<span class="time days">';
            text_format +=
              '    <span class="number" data-number="00">00</span>';
            if (data.days_text !== "") {
              text_format += '<span class="text">' + data.days_text + "</span>";
            }
            text_format += "</span>";
          }
          if (data.hrs_text !== undefined) {
            text_format += '<span class="time hours">';
            text_format +=
              '    <span class="number" data-number="00">00</span>';
            if (data.hrs_text !== "") {
              text_format += '<span class="text">' + data.hrs_text + "</span>";
            }
            text_format += "</span>";
          }
          if (data.mins_text !== undefined) {
            text_format += '<span class="time mins">';
            text_format +=
              '    <span class="number" data-number="00">00</span>';
            if (data.mins_text !== "") {
              text_format += '<span class="text">' + data.mins_text + "</span>";
            }
            text_format += "</span>";
          }
          if (data.secs_text !== undefined) {
            text_format += '<span class="time secs">';
            text_format +=
              '    <span class="number" data-number="00">00</span>';
            if (data.secs_text !== "") {
              text_format += '<span class="text">' + data.secs_text + "</span>";
            }
            text_format += "</span>";
          }

          el.html(text_format);

          el.countdown(el.data("datetime"), { elapse: true }).on(
            "update.countdown",
            function (event) {
              if (!event.elapsed) {
                countdown_event(el, event, data);
              }
            }
          );

          el.addClass("loaded");
        });
      })
      .trigger("uminex_countdown");
  };

  window.addEventListener(
    "load",
    function load() {
      /**
       * remove listener, no longer needed
       * */
      window.removeEventListener("load", load, false);
      /**
       * start functions
       * */

      if ($(".uminex-countdown").length) {
        $(".uminex-countdown").uminex_countdown();
      }
    },
    false
  );
})(window.jQuery);
