/*
    KCB Bank Blog/News Portal
    Customized for Kenya Commercial Bank
    Based on Future Imperfect template by HTML5 UP
*/

(function($) {

    var $window = $(window),
        $body = $('body'),
        $menu = $('#menu'),
        $sidebar = $('#sidebar'),
        $main = $('#main'),
        $header = $('#header');

    // KCB Bank Brand Colors
    const KCB = {
        colors: {
            primary: '#006747',      // KCB Green
            secondary: '#8B5A2B',    // KCB Gold/Brown
            accent: '#E30613',        // KCB Red (for accents)
            text: '#333333',
            light: '#F5F5F5'
        },
        fonts: {
            primary: "'Roboto', sans-serif",
            headings: "'Montserrat', sans-serif"
        }
    };

    // Apply KCB branding to dynamically created elements
    function applyKCBBranding() {
        // Add KCB logo to header if not present
        if (!$('.kcb-logo').length) {
            $header.prepend(
                '<div class="kcb-logo">' +
                '<img src="/images/kcb-logo.png" alt="KCB Bank Kenya" style="height:40px;">' +
                '</div>'
            );
        }

        // Add KCB tagline
        if (!$('.kcb-tagline').length) {
            $('#intro').append(
                '<p class="kcb-tagline" style="color:' + KCB.colors.secondary + ';">' +
                'So KCB, So Digital' +
                '</p>'
            );
        }
    }

    // Breakpoints (adjusted for KCB's responsive needs)
    breakpoints({
        xlarge: [ '1281px', '1680px' ],
        large:  [ '981px',  '1280px' ],
        medium: [ '737px',  '980px'  ],
        small:  [ '481px',  '736px'  ],
        xsmall: [ null,     '480px'  ]
    });

    // Play initial animations on page load
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
            applyKCBBranding();
            
            // Initialize KCB-specific features
            initKCBNavigation();
            initKCBAlerts();
        }, 100);
    });

    // KCB Navigation Enhancements
    function initKCBNavigation() {
        // Add KCB Bank menu items
        var $menuList = $menu.find('.menu-list');
        
        if ($menuList.length) {
            $menuList.append(
                '<li class="kcb-menu-header">Banking Services</li>' +
                '<li><a href="/personal-banking">Personal Banking</a></li>' +
                '<li><a href="/business-banking">Business Banking</a></li>' +
                '<li><a href="/corporate-banking">Corporate Banking</a></li>' +
                '<li class="kcb-divider"></li>' +
                '<li class="kcb-menu-header">Digital Channels</li>' +
                '<li><a href="/kcb-mpesa">KCB M-Pesa</a></li>' +
                '<li><a href="/kcb-app">KCB App</a></li>' +
                '<li><a href="/internet-banking">Internet Banking</a></li>'
            );
        }
    }

    // KCB Alerts and Notifications
    function initKCBAlerts() {
        // Check for important announcements
        $.ajax({
            url: '/api/kcb/alerts',
            method: 'GET',
            success: function(alerts) {
                if (alerts && alerts.length) {
                    showKCBAlert(alerts[0]);
                }
            }
        });
    }

    function showKCBAlert(alert) {
        var alertHtml = 
            '<div class="kcb-alert" style="' +
            'background-color: ' + KCB.colors.secondary + ';' +
            'color: white; padding: 10px 20px; text-align: center;' +
            'position: relative; z-index: 1000;">' +
            '<strong>KCB Notice:</strong> ' + alert.message +
            '<button class="close-alert" style="' +
            'position: absolute; right: 20px; background: none;' +
            'border: none; color: white; cursor: pointer;">×</button>' +
            '</div>';
        
        $body.prepend(alertHtml);
        
        $('.close-alert').on('click', function() {
            $(this).parent().fadeOut();
        });
    }

    // Menu (enhanced for KCB)
    $menu
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'right',
            target: $body,
            visibleClass: 'is-menu-visible'
        });

    // Search functionality (enhanced for KCB content)
    var $search = $('#search'),
        $search_input = $search.find('input');

    $body
        .on('click', '[href="#search"]', function(event) {
            event.preventDefault();

            if (!$search.hasClass('visible')) {
                $search[0].reset();
                $search.addClass('visible');
                $search_input.focus();
            }
        });

    // Enhanced search with KCB-specific suggestions
    $search_input
        .on('keydown', function(event) {
            if (event.keyCode == 27)
                $search_input.blur();
        })
        .on('keyup', function() {
            var query = $(this).val();
            if (query.length > 2) {
                searchKCBContent(query);
            }
        })
        .on('blur', function() {
            window.setTimeout(function() {
                $search.removeClass('visible');
            }, 100);
        });

    function searchKCBContent(query) {
        // Simulated search suggestions
        var suggestions = [
            'KCB M-Pesa charges',
            'Loan application status',
            'Branch locations',
            'Forex rates',
            'Account opening requirements'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
        
        if (suggestions.length) {
            displaySearchSuggestions(suggestions);
        }
    }

    function displaySearchSuggestions(suggestions) {
        var $suggestions = $('.search-suggestions');
        if (!$suggestions.length) {
            $suggestions = $('<div class="search-suggestions"></div>');
            $search.append($suggestions);
        }
        
        $suggestions.html(
            suggestions.map(s => 
                '<div class="suggestion-item" style="padding:8px;cursor:pointer;">' + s + '</div>'
            ).join('')
        ).show();
        
        $('.suggestion-item').on('click', function() {
            $search_input.val($(this).text());
            $suggestions.hide();
            // Trigger search
            window.location.href = '/search?q=' + encodeURIComponent($(this).text());
        });
    }

    // Intro section (KCB customized)
    var $intro = $('#intro');
    
    // Update intro with KCB content
    $intro.find('h1').html('KCB Bank <span style="color:' + KCB.colors.secondary + ';">Blog & News</span>');
    $intro.find('p').html('Stay updated with the latest from Kenya Commercial Bank');

    // Move to main on <=large, back to sidebar on >large
    breakpoints.on('<=large', function() {
        $intro.prependTo($main);
    });

    breakpoints.on('>large', function() {
        $intro.prependTo($sidebar);
    });

    // Add KCB-specific event handlers
    $('.post').on('mouseenter', function() {
        $(this).css('border-left', '3px solid ' + KCB.colors.primary);
    }).on('mouseleave', function() {
        $(this).css('border-left', 'none');
    });

    // Add KCB floating action button for quick actions
    $body.append(
        '<div class="kcb-quick-actions" style="' +
        'position: fixed; bottom: 20px; right: 20px; z-index: 999;">' +
        '<button class="kcb-fab" style="' +
        'width: 56px; height: 56px; border-radius: 50%;' +
        'background-color: ' + KCB.colors.primary + ';' +
        'color: white; border: none; cursor: pointer;' +
        'box-shadow: 0 2px 10px rgba(0,0,0,0.3);">' +
        '☎</button>' +
        '<div class="kcb-fab-menu" style="display:none; position: absolute; bottom: 70px; right: 0;">' +
        '<a href="tel:0711044000" style="display:block; padding:10px; background:white; color:' + KCB.colors.primary + '; text-decoration:none; border-radius:4px; margin-bottom:5px;">Call KCB</a>' +
        '<a href="/branch-locator" style="display:block; padding:10px; background:white; color:' + KCB.colors.primary + '; text-decoration:none; border-radius:4px;">Find Branch</a>' +
        '</div>' +
        '</div>'
    );

    $('.kcb-fab').on('click', function() {
        $('.kcb-fab-menu').slideToggle();
    });

    // Close FAB menu when clicking outside
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.kcb-quick-actions').length) {
            $('.kcb-fab-menu').slideUp();
        }
    });

    // Add KCB-specific CSS
    $('head').append(
        '<style>' +
        '.kcb-menu-header { font-weight: bold; color: ' + KCB.colors.primary + '; padding: 10px 0 5px; }' +
        '.kcb-divider { height: 1px; background: #ddd; margin: 10px 0; }' +
        '.post { transition: border-left 0.3s ease; }' +
        '.kcb-alert { animation: slideDown 0.5s ease; }' +
        '@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }' +
        '.search-suggestions { position: absolute; background: white; border: 1px solid #ddd; width: 100%; max-height: 200px; overflow-y: auto; z-index: 1000; }' +
        '.suggestion-item:hover { background: ' + KCB.colors.light + '; }' +
        '</style>'
    );

    // Track user interactions for analytics
    function trackKCBAction(action, data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'KCB Interaction',
                'event_label': data
            });
        }
    }

    // Track post views
    $('.post').on('click', 'a', function() {
        trackKCBAction('post_click', $(this).attr('href'));
    });

})(jQuery);