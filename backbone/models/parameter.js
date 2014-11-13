App = window.App || new Marionette.Application();

App.module('Models', function(module) {
    module.Parameter = Backbone.Model.extend({
        defaults: {
            value: null
        }
    });
});