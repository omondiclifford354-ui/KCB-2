(function($) {

    // KCB Bank Configuration
    const KCB_CONFIG = {
        brand: {
            name: 'KCB Bank Kenya',
            primaryColor: '#006747', // KCB Green
            secondaryColor: '#8B5A2B', // KCB Gold
            accentColor: '#E30613', // KCB Red
            contact: {
                phone: '0711 044 000',
                email: 'contact@kcb.co.ke',
                twitter: '@KCBGroup'
            }
        },
        navigation: {
            banking: [
                { text: 'Personal Banking', url: '/personal' },
                { text: 'Business Banking', url: '/business' },
                { text: 'Corporate Banking', url: '/corporate' },
                { text: 'SME Banking', url: '/sme' }
            ],
            digital: [
                { text: 'KCB M-Pesa', url: '/kcb-mpesa' },
                { text: 'KCB App', url: '/app' },
                { text: 'Internet Banking', url: '/internet-banking' },
                { text: 'Card Services', url: '/cards' }
            ],
            loans: [
                { text: 'Personal Loans', url: '/loans/personal' },
                { text: 'Business Loans', url: '/loans/business' },
                { text: 'Mortgages', url: '/loans/mortgages' },
                { text: 'Asset Finance', url: '/loans/asset-finance' }
            ],
            support: [
                { text: 'Branch Locator', url: '/branches' },
                { text: 'ATM Locator', url: '/atms' },
                { text: 'Customer Care', url: '/support' },
                { text: 'FAQs', url: '/faqs' }
            ]
        }
    };

    /**
     * KCB Enhanced Navigation List Generator
     * Generates accessible navigation with icons and descriptions
     * @return {string} HTML string of navigation items
     */
    $.fn.kcbNavList = function(options) {
        var $this = $(this);
        var settings = $.extend({
            showIcons: true,
            showDescriptions: false,
            highlightCurrent: true,
            mobileFriendly: true
        }, options);

        var $a = $this.find('a');
        var b = [];

        $a.each(function() {
            var $this = $(this);
            var indent = Math.max(0, $this.parents('li').length - 1);
            var href = $this.attr('href');
            var target = $this.attr('target');
            var text = $this.text();
            
            // KCB-specific link detection
            var linkType = detectKCBLinks(href, text);
            var icon = getKCBIcon(linkType);
            var description = getKCBDescription(linkType);

            // Check if current page
            var isCurrent = settings.highlightCurrent && 
                (window.location.pathname === href || 
                 window.location.href.includes(href));

            b.push(
                '<a ' +
                    'class="kcb-nav-link depth-' + indent + (isCurrent ? ' current-page' : '') + '"' +
                    (target ? ' target="' + target + '"' : '') +
                    (href ? ' href="' + href + '"' : '') +
                    ' data-link-type="' + linkType + '"' +
                '>' +
                    '<span class="indent-' + indent + '"></span>' +
                    (settings.showIcons && icon ? '<span class="kcb-nav-icon">' + icon + '</span>' : '') +
                    '<span class="kcb-nav-text">' + text + '</span>' +
                    (settings.showDescriptions && description ? 
                        '<span class="kcb-nav-description">' + description + '</span>' : '') +
                '</a>'
            );
        });

        return b.join('');
    };

    /**
     * KCB Panel with Banking Features
     * Enhanced panel with KCB-specific functionality
     * @param {object} userConfig User configuration
     * @return {jQuery} jQuery object
     */
    $.fn.kcbPanel = function(userConfig) {
        if (this.length == 0) return this;
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++)
                $(this[i]).kcbPanel(userConfig);
            return this;
        }

        var $this = $(this);
        var $body = $('body');
        var $window = $(window);
        var id = $this.attr('id');

        // KCB default configuration
        var config = $.extend({
            delay: 300,
            hideOnClick: true,
            hideOnEscape: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'right',
            target: $body,
            visibleClass: 'is-menu-visible',
            
            // KCB-specific options
            showUserStatus: true,
            enableQuickActions: true,
            enableNotifications: true,
            bankingMode: true
        }, userConfig);

        if (typeof config.target != 'jQuery')
            config.target = $(config.target);

        // Panel methods
        $this._kcbHide = function(event) {
            if (!config.target.hasClass(config.visibleClass))
                return;

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            config.target.removeClass(config.visibleClass);
            
            // Track panel close in analytics
            trackKCBAnalytics('panel_closed', { panelId: id });

            window.setTimeout(function() {
                if (config.resetScroll)
                    $this.scrollTop(0);
                if (config.resetForms)
                    $this.find('form').each(function() { this.reset(); });
            }, config.delay);
        };

        // Add KCB banking features to panel
        function enhanceWithKCBFeatures() {
            if (config.showUserStatus) {
                addUserStatus($this);
            }
            if (config.enableQuickActions) {
                addQuickActions($this);
            }
            if (config.bankingMode) {
                addBankingMenu($this);
            }
        }

        // Add user login/account status
        function addUserStatus($panel) {
            var isLoggedIn = checkKCBLoginStatus();
            var userHtml = isLoggedIn ? 
                '<div class="kcb-user-status logged-in">' +
                    '<span class="kcb-user-name">Welcome, ' + getKCBUserName() + '</span>' +
                    '<a href="/logout" class="kcb-logout">Logout</a>' +
                '</div>' :
                '<div class="kcb-user-status logged-out">' +
                    '<a href="/login" class="kcb-login-btn">Login</a>' +
                    '<a href="/register" class="kcb-register-btn">Register</a>' +
                '</div>';
            
            $panel.prepend(userHtml);
        }

        // Add quick banking actions
        function addQuickActions($panel) {
            var actions = [
                { icon: '💰', text: 'Check Balance', action: 'balance' },
                { icon: '📱', text: 'Buy Airtime', action: 'airtime' },
                { icon: '💸', text: 'Send Money', action: 'transfer' },
                { icon: '📊', text: 'Pay Bill', action: 'paybill' }
            ];

            var actionsHtml = '<div class="kcb-quick-actions-panel">' +
                actions.map(a => 
                    '<button class="kcb-quick-action" data-action="' + a.action + '">' +
                        '<span class="kcb-action-icon">' + a.icon + '</span>' +
                        '<span class="kcb-action-text">' + a.text + '</span>' +
                    '</button>'
                ).join('') + '</div>';

            $panel.find('.kcb-quick-actions-container').html(actionsHtml);
            
            // Bind quick action events
            $panel.find('.kcb-quick-action').on('click', function() {
                var action = $(this).data('action');
                handleKCBQuickAction(action);
            });
        }

        // Add banking menu structure
        function addBankingMenu($panel) {
            var menuHtml = '<nav class="kcb-banking-menu">' +
                '<div class="kcb-menu-section">' +
                    '<h3 class="kcb-menu-heading">Banking</h3>' +
                    generateMenuItems(KCB_CONFIG.navigation.banking) +
                '</div>' +
                '<div class="kcb-menu-section">' +
                    '<h3 class="kcb-menu-heading">Digital Channels</h3>' +
                    generateMenuItems(KCB_CONFIG.navigation.digital) +
                '</div>' +
                '<div class="kcb-menu-section">' +
                    '<h3 class="kcb-menu-heading">Loans</h3>' +
                    generateMenuItems(KCB_CONFIG.navigation.loans) +
                '</div>' +
                '<div class="kcb-menu-section">' +
                    '<h3 class="kcb-menu-heading">Support</h3>' +
                    generateMenuItems(KCB_CONFIG.navigation.support) +
                '</div>' +
                '<div class="kcb-contact-info">' +
                    '<p>📞 ' + KCB_CONFIG.brand.contact.phone + '</p>' +
                    '<p>✉️ ' + KCB_CONFIG.brand.contact.email + '</p>' +
                '</div>' +
                '</nav>';

            $panel.append(menuHtml);
        }

        function generateMenuItems(items) {
            return '<ul>' + items.map(item => 
                '<li><a href="' + item.url + '">' + item.text + '</a></li>'
            ).join('') + '</ul>';
        }

        // Vendor fixes
        $this
            .css('-ms-overflow-style', '-ms-autohiding-scrollbar')
            .css('-webkit-overflow-scrolling', 'touch');

        // Event handlers with KCB enhancements
        if (config.hideOnClick) {
            $this.find('a')
                .css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)')
                .on('click', function(event) {
                    var $a = $(this);
                    var href = $a.attr('href');
                    
                    if (!href || href == '#' || href == '' || href == '#' + id)
                        return;

                    event.preventDefault();
                    event.stopPropagation();

                    // Track navigation
                    trackKCBAnalytics('menu_navigation', { href: href });

                    $this._kcbHide();

                    window.setTimeout(function() {
                        if ($a.attr('target') == '_blank')
                            window.open(href);
                        else
                            window.location.href = href;
                    }, config.delay + 10);
                });
        }

        // Touch events for mobile
        $this.on('touchstart', function(event) {
            $this.touchPosX = event.originalEvent.touches[0].pageX;
            $this.touchPosY = event.originalEvent.touches[0].pageY;
        });

        $this.on('touchmove', function(event) {
            if ($this.touchPosX === null || $this.touchPosY === null)
                return;

            var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX;
            var diffY = $this.touchPosY - event.originalEvent.touches[0].pageY;
            var th = $this.outerHeight();
            var ts = ($this.get(0).scrollHeight - $this.scrollTop());

            if (config.hideOnSwipe) {
                var result = false;
                var boundary = 20;
                var delta = 50;

                switch (config.side) {
                    case 'left':
                        result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
                        break;
                    case 'right':
                        result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
                        break;
                }

                if (result) {
                    $this.touchPosX = null;
                    $this.touchPosY = null;
                    $this._kcbHide();
                    return false;
                }
            }

            // Prevent scrolling issues
            if (($this.scrollTop() < 0 && diffY < 0) ||
                (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
                event.preventDefault();
                event.stopPropagation();
            }
        });

        $this.on('click touchend touchstart touchmove', function(event) {
            event.stopPropagation();
        });

        $this.on('click', 'a[href="#' + id + '"]', function(event) {
            event.preventDefault();
            event.stopPropagation();
            config.target.removeClass(config.visibleClass);
        });

        // Body events
        $body.on('click touchend', function(event) {
            $this._kcbHide(event);
        });

        $body.on('click', 'a[href="#' + id + '"]', function(event) {
            event.preventDefault();
            event.stopPropagation();
            config.target.toggleClass(config.visibleClass);
            
            // Enhance panel when shown
            if (config.target.hasClass(config.visibleClass)) {
                enhanceWithKCBFeatures();
                trackKCBAnalytics('panel_opened', { panelId: id });
            }
        });

        // Window events
        if (config.hideOnEscape) {
            $window.on('keydown', function(event) {
                if (event.keyCode == 27)
                    $this._kcbHide(event);
            });
        }

        return $this;
    };

    /**
     * KCB Form Placeholder Handler with Banking Validation
     */
    $.fn.kcbPlaceholder = function() {
        if (typeof (document.createElement('input')).placeholder != 'undefined')
            return $(this);

        if (this.length == 0) return this;
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++)
                $(this[i]).kcbPlaceholder();
            return this;
        }

        var $this = $(this);

        // Handle text inputs with KCB-specific formatting
        $this.find('input[type=text],textarea')
            .each(function() {
                var i = $(this);
                
                // Apply KCB-specific input masking
                if (i.hasClass('kcb-phone')) {
                    i.on('input', function() {
                        formatKCBPhoneNumber(this);
                    });
                }
                
                if (i.hasClass('kcb-account')) {
                    i.on('input', function() {
                        formatKCBAccountNumber(this);
                    });
                }

                if (i.val() == '' || i.val() == i.attr('placeholder')) {
                    i.addClass('polyfill-placeholder')
                     .val(i.attr('placeholder'));
                }
            })
            .on('blur', function() {
                var i = $(this);
                if (i.attr('name').match(/-polyfill-field$/))
                    return;
                if (i.val() == '')
                    i.addClass('polyfill-placeholder')
                     .val(i.attr('placeholder'));
            })
            .on('focus', function() {
                var i = $(this);
                if (i.attr('name').match(/-polyfill-field$/))
                    return;
                if (i.val() == i.attr('placeholder'))
                    i.removeClass('polyfill-placeholder')
                     .val('');
            });

        // Handle password fields with banking security
        $this.find('input[type=password]')
            .each(function() {
                var i = $(this);
                var x = $('<div>')
                    .append(i.clone())
                    .html()
                    .replace(/type="password"/i, 'type="text"')
                    .replace(/type=password/i, 'type=text');

                x = $(x);

                if (i.attr('id') != '')
                    x.attr('id', i.attr('id') + '-polyfill-field');
                if (i.attr('name') != '')
                    x.attr('name', i.attr('name') + '-polyfill-field');

                x.addClass('polyfill-placeholder kcb-secure-field')
                 .val(x.attr('placeholder'))
                 .insertAfter(i);

                if (i.val() == '')
                    i.hide();
                else
                    x.hide();

                i.on('blur', function() {
                    var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');
                    if (i.val() == '') {
                        i.hide();
                        x.show();
                    }
                });

                x.on('focus', function() {
                    var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');
                    x.hide();
                    i.show().focus();
                });
            });

        // Form submit with KCB validation
        $this
            .on('submit', function() {
                $this.find('input[type=text],input[type=password],textarea')
                    .each(function() {
                        var i = $(this);
                        if (i.attr('name').match(/-polyfill-field$/))
                            i.attr('name', '');
                        if (i.val() == i.attr('placeholder')) {
                            i.removeClass('polyfill-placeholder');
                            i.val('');
                        }
                    });
                
                // Validate KCB-specific fields
                return validateKCBForm($this);
            });

        return $this;
    };

    /**
     * KCB Prioritize with Banking Context
     */
    $.kcbPrioritize = function($elements, condition) {
        var key = '__kcb_prioritize';

        if (typeof $elements != 'jQuery')
            $elements = $($elements);

        $elements.each(function() {
            var $e = $(this);
            var $parent = $e.parent();

            if ($parent.length == 0) return;

            if (!$e.data(key)) {
                if (!condition) return;

                var $p = $e.prev();
                if ($p.length == 0) return;

                $e.prependTo($parent);
                $e.data(key, $p);
                
                // Log prioritization for analytics
                trackKCBAnalytics('element_prioritized', { 
                    element: $e.prop('tagName'),
                    condition: condition 
                });
            } else {
                if (condition) return;

                $p = $e.data(key);
                $e.insertAfter($p);
                $e.removeData(key);
            }
        });
    };

    // Helper Functions

    function detectKCBLinks(href, text) {
        var url = href.toLowerCase();
        var text_lower = text.toLowerCase();
        
        if (url.includes('loan') || text_lower.includes('loan')) return 'loan';
        if (url.includes('mpesa') || text_lower.includes('mpesa')) return 'mpesa';
        if (url.includes('account') || text_lower.includes('account')) return 'account';
        if (url.includes('branch') || text_lower.includes('branch')) return 'branch';
        if (url.includes('contact') || text_lower.includes('contact')) return 'contact';
        if (url.includes('faq') || text_lower.includes('faq')) return 'faq';
        
        return 'general';
    }

    function getKCBIcon(type) {
        var icons = {
            'loan': '💰',
            'mpesa': '📱',
            'account': '🏦',
            'branch': '📍',
            'contact': '📞',
            'faq': '❓',
            'general': '🔗'
        };
        return icons[type] || '🔗';
    }

    function getKCBDescription(type) {
        var descriptions = {
            'loan': 'Quick and affordable loans',
            'mpesa': 'Mobile money services',
            'account': 'Manage your accounts',
            'branch': 'Find KCB near you',
            'contact': 'Get in touch with us',
            'faq': 'Frequently asked questions'
        };
        return descriptions[type] || '';
    }

    function checkKCBLoginStatus() {
        // Implement actual login check
        return localStorage.getItem('kcb_logged_in') === 'true';
    }

    function getKCBUserName() {
        return localStorage.getItem('kcb_user_name') || 'Customer';
    }

    function handleKCBQuickAction(action) {
        trackKCBAnalytics('quick_action', { action: action });
        
        switch(action) {
            case 'balance':
                window.location.href = '/account/balance';
                break;
            case 'airtime':
                window.location.href = '/airtime';
                break;
            case 'transfer':
                window.location.href = '/transfer';
                break;
            case 'paybill':
                window.location.href = '/paybill';
                break;
        }
    }

    function formatKCBPhoneNumber(input) {
        var value = input.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.startsWith('0')) {
                value = '254' + value.substring(1);
            }
            if (value.length > 12) {
                value = value.substring(0, 12);
            }
        }
        input.value = value;
    }

    function formatKCBAccountNumber(input) {
        var value = input.value.replace(/\D/g, '');
        if (value.length > 16) {
            value = value.substring(0, 16);
        }
        input.value = value;
    }

    function validateKCBForm($form) {
        var isValid = true;
        
        // Validate phone numbers
        $form.find('.kcb-phone').each(function() {
            var phone = $(this).val().replace(/\D/g, '');
            if (phone.length < 10) {
                showKCBError('Please enter a valid phone number');
                isValid = false;
            }
        });
        
        // Validate account numbers
        $form.find('.kcb-account').each(function() {
            var account = $(this).val().replace(/\D/g, '');
            if (account.length < 10) {
                showKCBError('Please enter a valid account number');
                isValid = false;
            }
        });
        
        return isValid;
    }

    function showKCBError(message) {
        alert('KCB Bank: ' + message);
    }

    function trackKCBAnalytics(action, data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'KCB Navigation',
                'event_label': JSON.stringify(data)
            });
        }
        console.log('KCB Track:', action, data);
    }

    // Initialize KCB enhancements
    $(document).ready(function() {
        // Add KCB styles
        $('head').append(
            '<style>' +
            '.kcb-user-status { padding: 20px; border-bottom: 1px solid #ddd; }' +
            '.kcb-login-btn, .kcb-register-btn { display: inline-block; padding: 8px 15px; margin-right: 10px; background: ' + KCB_CONFIG.brand.primaryColor + '; color: white; text-decoration: none; border-radius: 4px; }' +
            '.kcb-register-btn { background: ' + KCB_CONFIG.brand.secondaryColor + '; }' +
            '.kcb-quick-actions-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 15px; }' +
            '.kcb-quick-action { padding: 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }' +
            '.kcb-quick-action:hover { background: ' + KCB_CONFIG.brand.light + '; }' +
            '.kcb-menu-section { margin: 20px 0; }' +
            '.kcb-menu-heading { color: ' + KCB_CONFIG.brand.primaryColor + '; font-size: 1.1em; margin-bottom: 10px; }' +
            '.kcb-contact-info { margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 4px; }' +
            '.current-page { font-weight: bold; color: ' + KCB_CONFIG.brand.primaryColor + '; }' +
            '.kcb-nav-link { display: flex; align-items: center; padding: 8px 0; }' +
            '.kcb-nav-icon { margin-right: 10px; font-size: 1.2em; }' +
            '.kcb-nav-description { font-size: 0.85em; color: #666; margin-left: 10px; }' +
            '</style>'
        );
    });

})(jQuery);