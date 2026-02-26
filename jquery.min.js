<!-- Load jQuery normally -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Then add your KCB-specific customizations -->
<script>
// KCB Bank jQuery Extensions
(function($) {
    // KCB-specific utilities
    $.kcb = {
        // Format currency in KES
        formatKES: function(amount) {
            return 'KES ' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        
        // Validate KCB account number
        validateAccount: function(accountNumber) {
            // Add KCB account validation logic
            return /^\d{10,16}$/.test(accountNumber);
        },
        
        // Validate phone number (Kenyan format)
        validatePhone: function(phone) {
            return /^(?:\+254|0)[17]\d{8}$/.test(phone);
        },
        
        // Show KCB toast notification
        showNotification: function(message, type) {
            const colors = {
                success: '#28a745',
                error: '#dc3545',
                info: '#007bff',
                warning: '#ffc107'
            };
            
            $('body').append(
                `<div class="kcb-notification" style="position:fixed;top:20px;right:20px;padding:15px;background:${colors[type] || '#333'};color:white;border-radius:5px;z-index:9999;">${message}</div>`
            );
            
            setTimeout(function() {
                $('.kcb-notification').fadeOut(function() {
                    $(this).remove();
                });
            }, 5000);
        }
    };
    
    // Add KCB-specific methods to jQuery
    $.fn.kcbFormValidate = function() {
        return this.each(function() {
            const $form = $(this);
            $form.on('submit', function(e) {
                const phone = $('#phone').val();
                const account = $('#account').val();
                
                if (!$.kcb.validatePhone(phone)) {
                    e.preventDefault();
                    $.kcb.showNotification('Invalid phone number', 'error');
                }
                
                if (account && !$.kcb.validateAccount(account)) {
                    e.preventDefault();
                    $.kcb.showNotification('Invalid account number', 'error');
                }
            });
        });
    };
    
})(jQuery);

// Initialize KCB form validation
$(document).ready(function() {
    $('#payment-form').kcbFormValidate();
});
</script>
