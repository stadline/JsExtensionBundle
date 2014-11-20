Extension = window.Extension || {};

Extension.Application = Marionette.Application.extend({
    initialize: function() {
        var App = this;

        Marionette.Behaviors.behaviorsLookup = function() {
            return App.Behaviors;
        };

        App.on("before:start", function() {
            App.parameters = new Backbone.Model();
        });

        App.on("stop", function() {
            App.parameters.clear();

            delete App.parameters();
        });
    },

    setParameter: function(key, value) {
        this.parameters.set(key, value);
    },

    getParameter: function(key) {
        return this.parameters.get(key);
    }
});