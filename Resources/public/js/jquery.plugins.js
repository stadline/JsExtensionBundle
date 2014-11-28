;(function($) {
    $(document).ready(function() {
        // init qTip²
        $('[title]').qtip({
            position: {
                my: "bottom center",
                at: "top center",
                viewport: true,
                adjust: {
                    method: "shift flipinvert"
                }
            },
            show: {
                solo: true
            },
            hide: {
                fixed: true,
                delay: 200
            },
            style: {
                classes: "qtip-tipsy qtip-rounded",
                tip: {
                    corner: true,
                    width: 18,
                    height: 9
                }
            }
        });

        // init MagnificPopup
        $(document.body).magnificPopup({
            delegate: 'a[target="popup"]',
            type: 'ajax'
        });
    });
})(window.jQuery);