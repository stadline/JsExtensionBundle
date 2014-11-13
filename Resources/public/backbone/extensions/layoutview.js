Extension = window.Extension || {};

Extension.LayoutView = Marionette.LayoutView.extend({
    /**
     * Removed default action on hash links
     * in order not to trigger router methods
     */
    preventHashChange: function(event) {
        var $target = $(event.currentTarget);

        if (_.string.startsWith($target.attr('href'), '#')) {
            event.preventDefault();
        }
    },

    /**
     * Open a view in a modal
     *
     * Attach a view to modal region
     * and trigger modal initialization
     */
    openModal: function(modalView, options) {
        var self = this;

        this.modal.show(modalView);

        $.magnificPopup.open(_.defaults({}, options, {
            items: {
                src: this.modal.$el,
                type: 'inline'
            },
            /*modal: true,*/
            midClick: true,
            callbacks: {
                open: function() {
                    self.modal.$el.on("click", ".mfp-close, .mfp-inline-close", function() {
                        App.layout.closeModal();
                    });

                    self.modal.$el.on("click", "a[href]", function(event) {
                        self.preventHashChange(event);
                    });
                },
                close: function() {
                    modalView.destroy();
                }
            }
        }));
    },

    /**
     * Close current modal
     *
     * A modal view class can be passed to prevent closing the wrong modal
     */
    closeModal: function(modalViewClass) {
        if (!modalViewClass || this.modal.currentView instanceof modalViewClass) {
            $.magnificPopup.close();
        }
    }
});