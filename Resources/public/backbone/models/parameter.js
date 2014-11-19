App = window.App || new Extension.Application();

App.module('Models', function(module) {
    module.Parameter = Backbone.Model.extend({
        defaults: {
            value: null
        }
    });
});