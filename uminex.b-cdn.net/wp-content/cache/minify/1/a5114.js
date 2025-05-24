(function ($) {
    'use strict';

    $(function () {
        if (uminex_params.loading_page == true) {
            Pace.on('done', function () {
                $('#preloader').addClass("isdone");
            });
        }
    });

    var get_url = function (endpoint) {
            return uminex_params.uminex_ajax_url.toString().replace(
                '%%endpoint%%',
                endpoint
            );
        },
        get_cookie = function (name) {
            var e, b, cookie = document.cookie, p = name + '=';
            if (!cookie) {
                return;
            }
            b = cookie.indexOf('; ' + p);
            if (b === -1) {
                b = cookie.indexOf(p);
                if (b !== 0) {
                    return null;
                }
            } else {
                b += 2;
            }
            e = cookie.indexOf(';', b);
            if (e === -1) {
                e = cookie.length;
            }
            return decodeURIComponent(cookie.substring(b + p.length, e));
        },
        set_cookie = function (name, value, expires, path, domain, secure) {
            var d = new Date();
            if (typeof (expires) === 'object' && expires.toGMTString) {
                expires = expires.toGMTString();
            } else if (parseInt(expires, 10)) {
                d.setTime(d.getTime() + (parseInt(expires, 10) * 1000));
                expires = d.toGMTString();
            } else {
                expires = '';
            }
            document.cookie = name + '=' + encodeURIComponent(value) +
                (expires ? '; expires=' + expires : '') +
                (path ? '; path=' + path : '') +
                (domain ? '; domain=' + domain : '') +
                (secure ? '; secure' : '');
        },
        remove_cookie = function (name, path, domain, secure) {
            set_cookie(name, '', -1000, path, domain, secure);
        };

    var Mobile_Detect = {
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
            return (Mobile_Detect.Mobile() || Mobile_Detect.Tablet());
        }
    };

    $(document).on('click', '.view-all-menu > a', function () {
        var button = $(this),
            vertical = button.closest('.box-nav-vertical'),
            items = button.data('items'),
            open = button.data('more'),
            close = button.data('less'),
            menus = vertical.find('ul.vertical-menu > li:nth-child(n+' + (items + 1) + ')');
        button.toggleClass('open-cate close-cate');
        if (button.hasClass('close-cate')) {
            button.html(close);
            menus.slideDown();
        } else {
            button.html(open);
            menus.slideUp();
        }

        return false;
    });

    /* AJAX TABS */
    $(document).on('click', '.ovic-tabs .tabs-list .tab-link, .ovic-accordion .panel-heading a', function (e) {
        e.preventDefault();
        var $this = $(this),
            $data = $this.data(),
            $tabID = $($this.attr('href')),
            $tabItem = $this.closest('.tab-item'),
            $tabContent = $tabID.closest('.tabs-container,.ovic-accordion'),
            $loaded = $this.closest('.tabs-list,.ovic-accordion').find('a.loaded').attr('href');

        if ($data.ajax == 1 && !$this.hasClass('loaded')) {
            $tabContent.addClass('loading');
            $tabItem.addClass('active').closest('.tabs-list').find('.tab-item').not($tabItem).removeClass('active');
            $.ajax({
                type: 'POST',
                url: get_url('content_ajax_tabs'),
                data: {
                    security: uminex_params.security,
                    section: $data.section,
                },
                success: function (response) {
                    $('[href="' + $loaded + '"]').removeClass('loaded');
                    if (response) {
                        $tabID.html(response);
                        if ($tabID.find('.owl-slick').length) {
                            $tabID.find('.owl-slick').uminex_init_carousel();
                        }
                        if ($tabID.find('.equal-container.better-height').length) {
                            $tabID.find('.equal-container.better-height').uminex_better_equal_elems();
                        }
                        if ($tabID.find('.uminex-countdown').length && $.fn.uminex_countdown) {
                            $tabID.find('.uminex-countdown').uminex_countdown();
                        }
                        if ($tabID.find('.ovic-products').length && $.fn.uminex_load_infinite) {
                            $tabID.find('.ovic-products').uminex_load_infinite();
                        }
                        if ($tabID.find('.product-item.style-01 .product-inner').length && !Mobile_Detect.any()) {
                            $tabID.find('.product-item.style-01 .product-inner').uminex_hover_product();
                        }
                        if ($tabID.find('.product-item.style-02 .product-inner').length && !Mobile_Detect.any()) {
                            $tabID.find('.product-item.style-02 .product-inner').uminex_hover_product();
                        }
                        if ($tabID.find('.product-item.style-03 .product-inner').length && !Mobile_Detect.any()) {
                            $tabID.find('.product-item.style-03 .product-inner').uminex_hover_product();
                        }
                        if ($tabID.find('.yith-wcqv-button,.compare-button a.compare,.entry-summary a.compare,.yith-wcwl-add-to-wishlist a').length) {
                            $tabID.find('.yith-wcqv-button,.compare-button a.compare,.entry-summary a.compare,.yith-wcwl-add-to-wishlist a').uminex_bootstrap_tooltip();
                        }
                        if ($tabID.find('.uminex-isotope').length && $.fn.uminex_isotope) {
                            $tabID.find('.uminex-isotope').uminex_isotope();
                        }
                    } else {
                        $tabID.html('<div class="alert alert-warning">' + uminex_params.tab_warning + '</div>');
                    }
                    /* for accordion */
                    $this.closest('.panel-default').addClass('active').siblings().removeClass('active');
                    $this.closest('.ovic-accordion').find($tabID).slideDown(400);
                    $this.closest('.ovic-accordion').find('.panel-collapse').not($tabID).slideUp(400);
                },
                complete: function () {
                    $this.addClass('loaded');
                    $tabContent.removeClass('loading');
                    setTimeout(function ($tabID, $tab_animated, $loaded) {
                        $tabID.addClass('active').siblings().removeClass('active');
                        $($loaded).html('');
                        if (!$tabID.find('.uminex-isotope').length) {
                            $tabID.animation_tabs($tab_animated);
                        }
                    }, 10, $tabID, $data.animate, $loaded);
                },
                ajaxError: function () {
                    $tabContent.removeClass('loading');
                    $tabID.html('<div class="alert alert-warning">' + uminex_params.tab_warning + '</div>');
                }
            });
        } else {
            $tabItem.addClass('active').closest('.tabs-list').find('.tab-item').not($tabItem).removeClass('active');
            $tabID.addClass('active').siblings().removeClass('active');
            /* for accordion */
            $this.closest('.panel-default').addClass('active').siblings().removeClass('active');
            $this.closest('.ovic-accordion').find($tabID).slideDown(400);
            $this.closest('.ovic-accordion').find('.panel-collapse').not($tabID).slideUp(400);
            /* for animate */
            $tabID.animation_tabs($data.animate);
        }
    });
    /* ANIMATE */
    $.fn.animation_tabs = function ($tab_animated) {
        $tab_animated = ($tab_animated === undefined || $tab_animated === '') ? '' : $tab_animated;
        if ($tab_animated !== '') {
            $(this).find('.owl-slick .slick-active, .product-list-grid .product-item').each(function (i) {
                var $this = $(this),
                    $style = $this.attr('style'),
                    $delay = i * 200;

                $style = ($style === undefined) ? '' : $style;
                $this.attr('style', $style +
                    ';-webkit-animation-delay:' + $delay + 'ms;' +
                    '-moz-animation-delay:' + $delay + 'ms;' +
                    '-o-animation-delay:' + $delay + 'ms;' +
                    'animation-delay:' + $delay + 'ms;'
                ).addClass($tab_animated + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $this.removeClass($tab_animated + ' animated');
                    $this.attr('style', $style);
                });
            });
        }
    };
    $.fn.uminex_init_carousel = function () {
        $(this).not('.slick-initialized').each(function () {
            var $this = $(this),
                $config = $this.data('slick') !== undefined ? $this.data('slick') : [];

            if ($this.hasClass('flex-control-thumbs')) {
                $config = $this.closest('.single-product-wrapper').data('slick');
            }
            if ($this.hasClass('elementor-section-slide')) {
                $this = $this.children('.elementor-container');

                if ($this.children('.elementor-row').length) {
                    $this = $this.children('.elementor-row');
                }
                if ($this.hasClass('slick-initialized')) {
                    return false;
                }
            }
            if ($config.length <= 0) {
                return false;
            }
            if ($('body').hasClass('rtl')) {
                $config.rtl = true;
            }
            if ($config.vertical == true) {
                $config.prevArrow = '<span class="fa fa-angle-up prev"></span>';
                $config.nextArrow = '<span class="fa fa-angle-down next"></span>';
            } else {
                $config.prevArrow = '<span class="fa fa-angle-left prev"></span>';
                $config.nextArrow = '<span class="fa fa-angle-right next"></span>';
            }
            if ($this.hasClass('dots-title')) {
                $config.customPaging = function (slider, i) {
                    var $title = $(slider.$slides[i]).find('[data-title]').data('title');
                    return $title;
                };
            } else {
                $config.customPaging = function (slick, index) {
                    return '<span class="number">' + (index + 1) + '</span><button type="button">' + (index + 1) + '</button>';
                };
            }

            $this.slick($config);

            $this.on('setPosition', function (event) {
                if ($(event.target).find('.product-item.style-01 .product-inner').length && !Mobile_Detect.any()) {
                    $(event.target).find('.product-item.style-01 .product-inner').uminex_hover_product();
                }
                if ($(event.target).find('.product-item.style-02 .product-inner').length && !Mobile_Detect.any()) {
                    $(event.target).find('.product-item.style-02 .product-inner').uminex_hover_product();
                }
                if ($(event.target).find('.product-item.style-03 .product-inner').length && !Mobile_Detect.any()) {
                    $(event.target).find('.product-item.style-03 .product-inner').uminex_hover_product();
                }
            });
        });
    };
    $.fn.uminex_better_equal_elems = function () {
        if (uminex_params.disable_equal == false) {
            var $this = $(this);

            $this.on('uminex_better_equal_elems', function () {
                setTimeout(function () {
                    $this.each(function () {
                        if ($(this).find('.equal-elem').length) {
                            $(this).find('.equal-elem').css({
                                'height': 'auto'
                            });
                            var $height = 0;
                            $(this).find('.equal-elem').each(function () {
                                if ($height < $(this).height()) {
                                    $height = $(this).height();
                                }
                            });
                            $(this).find('.equal-elem').height($height);
                        }
                    });
                }, 300);
            }).trigger('uminex_better_equal_elems');

            $(window).on('resize', function () {
                $this.trigger('uminex_better_equal_elems');
            });
        }
    };
    $.fn.uminex_get_info_elements = function () {
        var $this = $(this);
        $this.on('uminex_get_info_elements', function () {
            this.style.setProperty('--elem-width', $(this).width() + 'px');
            this.style.setProperty('--elem-height', $(this).height() + 'px');
        }).trigger('uminex_get_info_elements');

        $(window).on('resize', function () {
            $this.trigger('uminex_get_info_elements');
        });
    };
    $.fn.uminex_sticky_header = function () {
        $(this).each(function () {
            var $this = $(this),
                $sticky = $this.find('.header-sticky'),
                $height = $this.height(),
                $vertical = $this.find('.always-open .block-content').height();

            if (uminex_params.sticky_menu == 'template') {
                $sticky = $('#header-sticky');
            }

            $(document).on('scroll', function (event) {
                var sh = $height,
                    st = $(this).scrollTop();

                if ($sticky.hasClass('sticky-top-0')) {
                    sh = 0;
                }
                if ($('.header-banner').length) {
                    sh = sh + $('.header-banner').height();
                }
                if ($this.find('.always-open .block-content').length) {
                    sh = sh + $vertical;
                }
                if (st > sh) {
                    $sticky.addClass('is-sticky');
                } else {
                    $sticky.removeClass('is-sticky');
                    $('#header-sticky').find('.uminex-dropdown.open').removeClass('open');
                }
            });
        });
    };
    /* DROPDOWN */
    $(document).on('click', function (event) {
        var $target = $(event.target).closest('.uminex-dropdown'),
            $current = $target.closest('.uminex-parent-toggle'),
            $parent = $('.uminex-dropdown');

        if ($target.length) {
            $parent.not($target).not($current).removeClass('open');
            if ($(event.target).is('[data-uminex="uminex-dropdown"]') ||
                $(event.target).closest('[data-uminex="uminex-dropdown"]').length) {
                if ($target.hasClass('overlay')) {
                    if ($target.hasClass('open')) {
                        $('body').removeClass('active-overlay');
                    } else {
                        $('body').addClass('active-overlay');
                    }
                }
                $target.toggleClass('open');
                event.preventDefault();
            }
        } else {
            $('.uminex-dropdown').removeClass('open');
            if ($target.hasClass('overlay') || !$target.length) {
                $('body').removeClass('active-overlay');
            }
        }
    });
    /* POPUP VIDEO */
    $(document).on('click', '.popup-video', function (e) {
        var $this = $(this),
            $href = $this.attr('href'),
            $effect = $this.attr('data-effect');

        if ($.fn.magnificPopup) {
            $.magnificPopup.open({
                items: {
                    src: $href,
                },
                type: 'iframe', // this is a default type
                iframe: {
                    markup: '<div class="mfp-iframe-scaler mfp-with-anim">' +
                        '<div class="mfp-close"></div>' +
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                        '</div>',
                },
                callbacks: {
                    beforeOpen: function () {
                        this.st.mainClass = $effect;
                    },
                },
                removalDelay: 500,
                midClick: true
            });
            e.preventDefault();
        }
    });
    /* LOOP GALLERY IMAGE */
    $(document).on('click', '.product-item .product-loop-gallery a', function (event) {
        var $this = $(this),
            $img = $this.attr('data-image'),
            $index = $this.attr('data-index'),
            $parent = $this.closest('.product-item'),
            $slide = $parent.find('.thumb-wrapper'),
            $main_img = $slide.find('.wp-post-image');

        if ($main_img) {
            if ($this.hasClass('dot-item') && $slide.length) {
                $slide.slick('slickGoTo', $index);
            } else {
                $main_img.attr('src', $img).attr('srcset', $img);
                $main_img.css({
                    'transform': 'scale(0.5)',
                    'opacity': '0',
                    'transition': 'all 0.3s ease',
                }).load(function () {
                    var image = $(this);
                    setTimeout(function () {
                        image.css({
                            'transform': 'scale(1)',
                            'opacity': '1',
                            'transition': 'all 0.3s ease',
                        });
                    }, 300);
                });
            }
            $(this).addClass('gallery-active').siblings().removeClass('gallery-active');
        }

        event.preventDefault();
    });
    /* BUTTON TOOLTIP */
    $.fn.uminex_bootstrap_tooltip = function () {
        if (!Mobile_Detect.any()) {
            $(this).each(function () {
                var $this = $(this),
                    $product = $this.closest('.tooltip-wrap'),
                    $text = $this.text(),
                    $place = 'left',
                    $place_e = 'right';

                if ($('body').hasClass('rtl')) {
                    $place = 'right';
                    $place_e = 'left';
                }
                if ($product.length) {
                    if ($product.hasClass('tooltip-top')) {
                        $this.OVICtooltip({
                            trigger: 'hover',
                            placement: 'top',
                            container: 'body',
                            title: $text,
                        });
                    }
                    if ($product.hasClass('tooltip-start')) {
                        $this.OVICtooltip({
                            trigger: 'hover',
                            placement: $place,
                            container: 'body',
                            title: $text,
                        });
                    }
                    if ($product.hasClass('tooltip-end')) {
                        $this.OVICtooltip({
                            trigger: 'hover',
                            placement: $place_e,
                            container: 'body',
                            title: $text,
                        });
                    }
                }
            });
        }
    }
    /* ZOOM IMAGE */
    $.fn.uminex_zoom_product = function () {
        if ($(this).find('.single-product-wrapper.has-gallery').length && $.fn.zoom) {
            $(this).find('.single-product-wrapper.has-gallery .woocommerce-product-gallery .woocommerce-product-gallery__image').each(function () {
                var zoomTarget = $(this),
                    zoomImg = zoomTarget.find('a').attr('href');

                if (zoomTarget.hasClass('flex-active-slide')) {
                    zoomTarget.trigger('zoom.destroy');
                }
                zoomTarget.zoom({url: zoomImg});
            });
        }
    };
    /* TOGGLE WIDGET */
    $.fn.ovic_category_product = function () {
        $(this).each(function () {
            var $main = $(this);
            $main.find('.cat-parent').each(function () {
                if ($(this).hasClass('current-cat')) {
                    $(this).addClass('show-sub');
                    $(this).children('.children').slideDown(400);
                }
                if ($(this).hasClass('current-cat-parent')) {
                    $(this).addClass('show-sub');
                    $(this).children('.children').slideDown(400);
                }
                $(this).children('.children').before('<span class="carets"></span>');
            });
            $main.children('.cat-parent').each(function () {
                var current = $(this).find('.children');
                $(this).children('.carets').on('click', function () {
                    $(this).parent().toggleClass('show-sub');
                    $(this).parent().children('.children').slideToggle(400);
                    $main.find('.children').not(current).slideUp(400);
                    $main.find('.cat-parent').not($(this).parent()).removeClass('show-sub');
                });
                var next_current = $(this).find('.children');
                next_current.children('.cat-parent').each(function () {
                    var child_current = $(this).find('.children');
                    $(this).children('.carets').on('click', function () {
                        $(this).parent().toggleClass('show-sub');
                        $(this).parent().parent().find('.cat-parent').not($(this).parent()).removeClass('show-sub');
                        $(this).parent().parent().find('.children').not(child_current).slideUp(400);
                        $(this).parent().children('.children').slideToggle(400);
                    })
                });
            });
        });
    };
    /* SWITCH MENU */
    $.fn.ovic_switch_menu = function () {
        $(this).each(function () {
            var current = $(this),
                $data = $(this).data(),
                $menu = $('.main-menu');
            $(this).on('click', function () {
                $(this).addClass('active');
                $(this).parent().find('a').not(current).removeClass('active');
                $menu.each(function () {
                    var current_menu = $(this);
                    if ($(this).hasClass($data.menu)) {
                        $(this).addClass('active');
                    }
                    if (!$(this).hasClass($data.menu)) {
                        $(this).removeClass('active');
                    }
                })
            });
        });
    };
    /* UPDATE COUNT WISHLIST */
    $(document).on('added_to_wishlist removed_from_wishlist', function () {
        $.get(get_url('update_wishlist_count'), function (count) {
            if (!count) {
                count = 0;
            }
            $('.block-wishlist .count').text(count);
        });
    });

    $(document).on('click', '.action-to-top', function (e) {
        $('html, body').animate({scrollTop: 0}, 800);
        e.preventDefault();
    });

    if (uminex_params.ajax_comment == 1) {
        $(document).on('click', '#comments .woocommerce-pagination a', function () {
            var $this = $(this),
                $comment = $this.closest('#comments'),
                $commentlist = $comment.find('.commentlist'),
                $pagination = $this.closest('.woocommerce-pagination');

            $comment.addClass('loading');
            $.ajax({
                url: $this.attr('href'),
                success: function (response) {
                    if (!response) {
                        return;
                    }
                    var $html = $.parseHTML(response, document, true),
                        $nav = $('#comments .woocommerce-pagination', $html).length ? $('#comments .woocommerce-pagination', $html)[0].innerHTML : '',
                        $content = $('#comments .commentlist', $html).length ? $('#comments .commentlist', $html)[0].innerHTML : '';

                    if ($content !== '') {
                        $commentlist.html($content);
                    }
                    $pagination.html($nav);
                    $comment.removeClass('loading');
                },
            });

            return false;
        });
    }
    /* QUANTITY */
    if (!String.prototype.getDecimals) {
        String.prototype.getDecimals = function () {
            var num = this,
                match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) {
                return 0;
            }
            return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
        };
    }
    $(document).on('click', '.quantity-plus, .quantity-minus', function (e) {
        e.preventDefault();
        // Get values
        var $qty = $(this).closest('.quantity').find('.qty'),
            currentVal = parseFloat($qty.val()),
            max = parseFloat($qty.attr('max')),
            min = parseFloat($qty.attr('min')),
            step = $qty.attr('step');

        if (!$qty.is(':disabled')) {
            // Format values
            if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
            if (max === '' || max === 'NaN') max = '';
            if (min === '' || min === 'NaN') min = 0;
            if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = '1';

            // Change the value
            if ($(this).is('.quantity-plus')) {
                if (max && (currentVal >= max)) {
                    $qty.val(max);
                } else {
                    $qty.val((currentVal + parseFloat(step)).toFixed(step.getDecimals()));
                }
            } else {
                if (min && (currentVal <= min)) {
                    $qty.val(min);
                } else if (currentVal > 0) {
                    $qty.val((currentVal - parseFloat(step)).toFixed(step.getDecimals()));
                }
            }

            // Trigger change event
            $qty.trigger('change');
        }
    });

    /* SALES POPUP */
    $.fn.ovic_sales_popup = function () {
        var $this = $(this),
            $sales = uminex_params.sales_popup,
            $close = uminex_params.sales_popup_close,
            $hover = uminex_params.sales_popup_hover,
            $interval,
            $timeout;

        function startToast() {
            var $display = parseInt(uminex_params.sales_popup_display),
                $delayOption = uminex_params.sales_popup_delay,
                $delayMin = parseInt(uminex_params.sales_popup_delay_min),
                $delayMax = parseInt(uminex_params.sales_popup_delay_max),
                $delay;
            if ($delayOption === 'random') {
                $delay = $display + $delayMin + Math.floor(Math.random() * Math.abs($delayMax - $delayMin));
            } else {
                $delay = $display + $delayMin;
            }
            $display = $display * 1000;
            $delay = $delay * 1000;
            $interval = setTimeout(function () {
                var $item = $sales[Math.floor(Math.random() * $sales.length)],
                    $html;
                $('body').addClass('sales-popup-active');
                $html = `
                <a href="${$item['product']['link']}" class="image link" target="_blank"><img src="${$item['product']['image']}" alt=""></a>
                <div class="content">
                    <p class="info">${$item['name']} ${uminex_params.sales_popup_1} ${$item['address']} ${uminex_params.sales_popup_2}</p>
                    <a href="${$item['product']['link']}" class="title link" target="_blank">${$item['product']['title']}</a>
                    <p class="time">${$item['time']}</p>
                    <p class="verified">${uminex_params.sales_popup_3}</p>
                </div>
                `;
                if (parseInt($close) === 1) {
                    $html += `<span class="sales-popup-close"></span>`;
                }
                $this.html('').append($html);
                $timeout = setTimeout(function () {
                    $('body').removeClass('sales-popup-active');
                }, $display);
                startToast();
            }, $delay);
        }

        startToast();

        function stopToast() {
            if ($interval) {
                clearInterval($interval)
            }
            if ($timeout) {
                clearTimeout($timeout)
            }
        }

        if (parseInt($hover) === 1) {
            $this
                .mouseenter(function () {
                    stopToast()
                })
                .mouseleave(function () {
                    setTimeout(function () {
                        $('body').removeClass('sales-popup-active');
                    }, 1000);
                    startToast()
                });
        }

        $(document).on('click', '.sales-popup-close', function () {
            $('body').removeClass('sales-popup-active');
            return false;
        });
    };

    /* HOVER PRODUCT */
    $.fn.uminex_hover_product = function () {
        $(this).each(function () {
            var $this = $(this),
                $list = $this.closest('.slick-list');
            if ($this.closest('.owl-slick').length) {
                $this.hover(
                    function (e) {
                        $list.css({
                            'padding': '30px 30px 85px',
                            'margin': '-30px -30px -85px',
                            'z-index': '4',
                        });
                    }, function () {
                        $list.css({
                            'padding': '0',
                            'margin': '0',
                            'z-index': '1',
                        });
                    }
                );
            }
        });
    };

    // Toggle mobile menu
    $(document).on('click', '.overlay-body', function () {
        $('body').removeClass('ovic-open-mobile-menu');
        $('body').removeClass('open-mobile-sidebar');
        $('body').removeClass('open-popup-vertical');
        $('body').removeClass('open-popup-minicart');
        $('body').removeClass('open-popup-search');
        $('.ovic-menu-clone-wrap').removeClass('open');
        return false;
    });

    // Toggle title mobile
    $(document).on('click', '.ovic-custommenu.toggle-yes .widget-title', function () {
        $(this).parent().toggleClass('open');
        $(this).parent().children(':not(.widget-title)').slideToggle(400);
        return false;
    });
    // Toggle sidebar mobile
    $(document).on('click', '.open-sidebar', function () {
        $('body').addClass('open-mobile-sidebar');
        return false;
    });
    $(document).on('click', '.close-sidebar', function () {
        $('body').removeClass('open-mobile-sidebar');
        return false;
    });
    $(document).on('click', '.uminex-filter .filter-dropdown-btn', function () {
        $(this).parent().toggleClass('open');
        $(this).closest('.shop-control').children('#secondary').slideToggle();
        return false;
    });
    // Toggle header banner
    $(document).on('click', '.close-banner', function () {
        $('.header-banner').removeClass('open');
        return false;
    });
    // Toggle popup vertical
    $(document).on('click', '.vertical-open', function () {
        $('body').addClass('open-popup-vertical');
        return false;
    });
    $(document).on('click', '.vertical-close', function () {
        $('body').removeClass('open-popup-vertical');
        return false;
    });
    // Toggle popup minicart
    $(document).on('click', '.minicart-open', function () {
        $('body').addClass('open-popup-minicart');
        return false;
    });
    $(document).on('click', '.minicart-close', function () {
        $('body').removeClass('open-popup-minicart');
        return false;
    });
    // Toggle popup search
    $(document).on('click', '.search-open', function () {
        $('body').addClass('open-popup-search');
        return false;
    });
    $(document).on('click', '.search-close', function () {
        $('body').removeClass('open-popup-search');
        return false;
    });
    // Toggle share button
    $(document).on('click', '.post-share-button .toggle', function () {
        $(this).closest('.post-share-button').toggleClass('open');
        return false;
    });
    // Toggle ovic pinmap
    $(document).on('click', '.ovic-pin .toggle', function () {
        $(this).parent().toggleClass('open');
        return false;
    });
    // Toggle widget content
    $(document).on('click', '.shop-page .sidebar-inner > .widget > .widget-title .arrow', function () {
        console.log('ok');
        $(this).closest('.widget').toggleClass('open');
        $(this).closest('.widget').children(':not(.widget-title)').slideToggle();
        return false;
    });

    $(document).on('click', '.more_seller_product_tab > a', function () {
        var id = $(this).attr('href');

        if ($(id).find('ul.products').length) {
            $(id).find('ul.products').uminex_better_equal_elems();
        }
    });

    $(document).on('change', '#uminex_disabled_popup_by_user', function () {
        if ($(this).is(":checked")) {
            set_cookie('uminex_disabled_popup_by_user', 'true');
        } else {
            set_cookie('uminex_disabled_popup_by_user', '');
        }
    });

    $(document).on('change', '.per-page-form .option-perpage', function () {
        $(this).closest('form').submit();
    });

    $(document).on('wc-product-gallery-after-init', function (event, gallery, params) {
        if ($(this).find('.flex-control-thumbs').length) {
            $(this).find('.flex-control-thumbs').uminex_init_carousel();
        }
    });

    $(document).on('added_to_cart', function (event, fragments, cart_hash, $button) {
        if ($button.hasClass('buy-now')) {
            window.location = uminex_params.cart_url;
            return;
        }
    });
    // ovic-expand
    $(document).on('click', '.ovic-expand > .expand-button', function () {
        $(this).parent().children('.post-content').slideToggle();
        $(this).parent().toggleClass('open');
        return false;
    });

    $(document).on('ovic_success_load_more_post', function (event, content) {
        if ($(event.target).find('.yith-wcqv-button,.compare-button a.compare,.entry-summary a.compare,.yith-wcwl-add-to-wishlist a').length) {
            $(event.target).find('.yith-wcqv-button,.compare-button a.compare,.entry-summary a.compare,.yith-wcwl-add-to-wishlist a').uminex_bootstrap_tooltip();
        }
        if ($(event.target).find('.owl-slick').length) {
            $(event.target).find('.owl-slick').uminex_init_carousel();
        }
        if ($('.equal-container.better-height').length) {
            $('.equal-container.better-height').uminex_better_equal_elems();
        }
    });

    $(document).on('scroll', function () {
        if ($(document).scrollTop() > 400) {
            $('.backtotop').addClass('show');
        } else {
            $('.backtotop').removeClass('show');
        }
    });

    $(document).on('found_variation', function (event, variation) {
        if ($(variation.price_html).length && $(event.target).find('.price').length) {
            $(event.target).find('.price').replaceWith(variation.price_html);
        }
    });

    $(document).on('click', '.reset_variations', function () {
        var form = $(this).closest('.variations_form'),
            price = form.data('price');

        form.find('.price').html(price);
    });

    $(document).on('updated_wc_div', function (event) {
        if ($(event.target).find('.cross-sells .owl-slick').length > 0) {
            $(event.target).find('.cross-sells .owl-slick').uminex_init_carousel();
        }
    });

    if ($('.woocommerce-product-gallery').attr("data-columns")) {
        $('.woocommerce-product-gallery').css({'--product-nav-cols': $('.woocommerce-product-gallery').attr("data-columns")});
    }

    $(document).ready(function () {
        $('.ovic-tabs').each(function (index, el) {
            $(this).find('.section-down').on('click', function (e) {
                if ($('.ovic-tabs').eq(index + 1).length == 1) {
                    $('html, body').animate({
                        scrollTop: $('.ovic-tabs').eq(index + 1).offset().top - 100
                    }, 'slow');
                }

                e.preventDefault();
            });
            $(this).find('.section-up').on('click', function (e) {
                if ($('.ovic-tabs').eq(index - 1).length == 1) {
                    $('html, body').animate({
                        scrollTop: $('.ovic-tabs').eq(index - 1).offset().top - 100
                    }, 'slow');
                }

                e.preventDefault();
            });
        });
    });

    $(document).on('click', '.scroll-content .scroll-prev', function (e) {

        event.preventDefault();

        var content = $(this).closest('.scroll-content'),
            type = content.data('scroll'),
            mobile = content.data('mobile'),
            action = '-=',
            step = content.data('step') != undefined ? content.data('step') : '200';
        if ($('body').hasClass('rtl')) {
            action = '+='
        }
        var config = {
            scrollLeft: action + step + 'px'
        };

        if (type == 'vertical') {
            if (mobile == true && window.matchMedia("(max-width: 767px)").matches) {
                config = {
                    scrollLeft: action + step + 'px'
                };
            } else {
                config = {
                    scrollTop: action + step + 'px'
                };
            }
        }

        content.children('.scroll-list').animate(config, 'slow');

    });

    $(document).on('click', '.scroll-content .scroll-next', function (e) {

        event.preventDefault();

        var content = $(this).closest('.scroll-content'),
            type = content.data('scroll'),
            mobile = content.data('mobile'),
            action = '+=',
            step = content.data('step') != undefined ? content.data('step') : '200';
        if ($('body').hasClass('rtl')) {
            action = '-='
        }
        var config = {
            scrollLeft: action + step + 'px'
        };

        if (type == 'vertical') {
            if (mobile == true && window.matchMedia("(max-width: 767px)").matches) {
                config = {
                    scrollLeft: action + step + 'px'
                };
            } else {
                config = {
                    scrollTop: action + step + 'px'
                };
            }
        }

        content.children('.scroll-list').animate(config, 'slow');

    });


    window.addEventListener("load", function load() {
        /**
         * remove listener, no longer needed
         * */
        window.removeEventListener("load", load, false);
        /**
         * start functions
         * */
        if ($('.owl-slick').length) {
            $('.owl-slick').uminex_init_carousel();
        }
        if ($('.elementor-section-slide').length) {
            $('.elementor-section-slide').uminex_init_carousel();
        }
        if ($('.equal-container.better-height').length) {
            $('.equal-container.better-height').uminex_better_equal_elems();
        }
        if ($('.ovic-products.ovic-shortcode.style-08 > .products-title').length) {
            $('.ovic-products.ovic-shortcode.style-08 > .products-title').uminex_get_info_elements();
        }
        if ($('.shop-before-control select').length) {
            $('.shop-before-control select').chosen({disable_search_threshold: 10});
        }
        if ($('table.variations select:not(.hide)').length) {
            $('table.variations select:not(.hide)').chosen({disable_search_threshold: 10});
        }
        if ($('.widget_product_categories .product-categories').length) {
            $('.widget_product_categories .product-categories').ovic_category_product();
        }
        if ($('.category-search-option').length) {
            $('.category-search-option').chosen();
            $('.category-search-option').on('change', function (event, value) {
                var $this = $(this),
                    $form = $this.closest('form'),
                    $input = $form.find('input[type="search"]');

                $input.removeData();

                if ('selected' in value) {
                    $input.attr('data-custom-params', JSON.stringify({"product_cat": value.selected}));
                }
            });
        }
        /**
         * sales popup
         * */
        if ($('.ovic-sales-popup').length) {
            $('.ovic-sales-popup').ovic_sales_popup();
        }
        /**
         * popup newsletter
         * */
        if ($('.uminex-popup-newsletter').length && get_cookie('uminex_disabled_popup_by_user') !== 'true' && $.fn.magnificPopup) {
            var popup = document.getElementById('uminex-popup-newsletter'),
                effect = popup.getAttribute('data-effect'),
                delay = popup.getAttribute('data-delay');

            setTimeout(function () {
                $.magnificPopup.open({
                    items: {
                        src: '#uminex-popup-newsletter'
                    },
                    type: 'inline',
                    removalDelay: 600,
                    callbacks: {
                        beforeOpen: function () {
                            this.st.mainClass = effect;
                        }
                    },
                    midClick: true
                });
            }, delay);
        }
        /**
         * check not mobile
         * */
        if (!Mobile_Detect.any()) {
            if ($('.product-page-grid .site-main > .product').length) {
                $('.product-page-grid .site-main > .product').uminex_zoom_product();
            }
            if ($('.product-page-slide .site-main > .product').length) {
                $('.product-page-slide .site-main > .product').uminex_zoom_product();
            }
            if ($('.product-page-sticky .site-main > .product').length) {
                $('.product-page-sticky .site-main > .product').uminex_zoom_product();
            }
            if ($('.header').length && uminex_params.sticky_menu !== 'none' && window.matchMedia("(min-width: 1200px)").matches) {
                $('.header').uminex_sticky_header();
            }
            if (window.matchMedia("(min-width: 1200px)").matches) {
                if ($('.product-item.style-01 .product-inner').length) {
                    $('.product-item.style-01 .product-inner').uminex_hover_product();
                }
                if ($('.product-item.style-02 .product-inner').length) {
                    $('.product-item.style-02 .product-inner').uminex_hover_product();
                }
                if ($('.product-item.style-03 .product-inner').length) {
                    $('.product-item.style-03 .product-inner').uminex_hover_product();
                }
            }
            if ($('.yith-wcqv-button,.compare-button a.compare,.entry-summary a.compare,.yith-wcwl-add-to-wishlist a').length) {
                $('.yith-wcqv-button,.compare-button a.compare,.entry-summary a.compare,.yith-wcwl-add-to-wishlist a').uminex_bootstrap_tooltip();
            }
        }
    }, false);

    if (uminex_params.is_preview) {
        //
        // Elementor scripts
        //
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope, $) {
                $scope.find('.owl-slick').uminex_init_carousel();
                $scope.find('.elementor-section-slide').uminex_init_carousel();
                $scope.find('.equal-container.better-height').uminex_better_equal_elems();
                if ($.fn.uminex_countdown) {
                    $scope.find('.uminex-countdown').uminex_countdown();
                }
            });
        });
    }

})(window.jQuery);