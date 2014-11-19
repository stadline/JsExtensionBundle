App = window.App || new Extension.Application();

App.module('Collections', function(module) {
    /**
     * Global lockers collection
     */
    module.Parameters = Backbone.Collection.extend({
        model: App.Models.Parameter,

        getValue: function(key) {
            var parameter = this.get(key);

            return parameter ? parameter.get('value') : undefined;
        },

        setValue: function(key, value) {
            var parameter = new this.model({
                id: key,
                value: value
            });

            return this.add([parameter], {
                merge: true
            });
        },

        setValues: function(values) {
            var parameters = [];

            _(values).each(function(value, key) {
                parameters.push({
                    id: key,
                    value: value
                });
            });

            return this.set(parameters, {
                merge: true
            });
        },

        unsetValue: function(key) {
            return this.remove(key);
        }
    });

    module.addInitializer(function() {
        App.parameters = new App.Collections.Parameters();
    });
});