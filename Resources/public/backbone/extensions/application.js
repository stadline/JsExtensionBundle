Extension = window.Extension || {};

Extension.Application = Marionette.Application.extend({
    initialize: function() {
        Marionette.Behaviors.behaviorsLookup = function() {
            return App.Behaviors;
        };
    },

    setParameter: function(key, value) {
        App.parameters.setValue(key, value);
    },

    getParameter: function(key) {
        return App.parameters.getValue(key);
    }
});