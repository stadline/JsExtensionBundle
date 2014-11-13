Extension = window.Extension || {};

/**
 * Relational model extension
 */
Extension.RelationalModel = Backbone.Model.extend({
    set: function() {
        Backbone.Model.prototype.set.apply(this, arguments);

        if (_(this._initialAttributes).isUndefined()) {
            this._initialAttributes = _(this.attributes).clone();
        }

        return this;
    },

    /**
     * To be used in parse process
     * > add model response to collection
     * > and return related model
     */
    addReference: function(collection, givenModel, additionalValues, callback) {
        var model = _(givenModel).extend(additionalValues);

        var addedModels = collection.add([model], {merge: true, parse: true});

        if (_.isFunction(callback)) {
            var self = this;

            _(addedModels).each(function(addedModel) {
                callback.call(self, addedModel);
            });
        }

        return addedModels[0];
    },

    /**
     * To be used in parse process
     * > add model responses to collection
     * > and return an array of related models
     */
    addReferences: function(collection, givenModels, additionalValues, callback) {
        var models = _(givenModels).map(function(model) {
            return _(model).extend(additionalValues);
        });

        var addedModels = collection.add(models, {merge: true, parse: true});

        if (_.isFunction(callback)) {
            var self = this;

            _(addedModels).each(function(addedModel) {
                callback.call(self, addedModel);
            });
        }

        return new Backbone.Collection(addedModels);
    },

    /**
     * Serialize model
     * > used in saving process
     */
    toJSON: function(options) {
        // serialize helper, which flatten related models to ids
        var serialize = function(value) {
            if (value instanceof Backbone.Collection) {
                return value.chain().map(serialize).reject(_.isUndefined).value();
            } else if (_(value).isObject() && value.cid) {
                return value.id;
            } else {
                return value;
            }
        };

        var attributes = {};

        _(this.attributes).each(function(value, key) {
            attributes[key] = serialize(value);
        });

        return attributes;
    },

    /**
     * Nested save process
     * > save related models before current model
     *
     * @returns {Deferred}
     */
    save: function(key, val, options) {
        var self = this;

        options = options || {
            models: []
        };

        // remember object tree to avoid infinite recursion
        if (_(options['models']).contains(this)) {
            return $.Deferred().resolve();
        } else {
            options['models'].push(this);
        }

        // get related models
        var relatedModels = [];
        _(this.attributes).each(function(attribute) {
            if (attribute instanceof Backbone.Model) {
                relatedModels.push(attribute);
            } else if (attribute instanceof Backbone.Collection) {
                relatedModels = relatedModels.concat(attribute.models);
            }
        });

        // check models to sync
        var modelsToSync = _(relatedModels).filter(function(model) {
            return model.hasUrl() && model.isSyncable();
        });

        // if there is no model to sync, use regular save method
        if (modelsToSync.length < 1) {
            return this._save(key, val, options);
        }

        // reject save if a related model is invalid
        if (!_(modelsToSync).every(function(model) {
            return model.isValid();
        })) {
            return false;
        }

        // prepare deferred save
        var deferredSave = $.Deferred();

        // sync related models first
        _(modelsToSync).each(function(model, i) {
            model.save(null, null, options).done(function() {
                modelsToSync.pop();

                // if we have synced all related model, save parent
                if (modelsToSync.length < 1) {
                    self._save(key, val, options).done(function() {
                        // then resolve the promise
                        deferredSave.resolve();
                    });
                }
            });
        });

        return deferredSave;
    },

    _save: function() {
        var xhr = Backbone.Model.prototype.save.apply(this, arguments);
        this._initialAttributes = _(this.attributes).clone();
        return xhr;
    },
    
    /**
     * Test if model has changed this initialization
     * 
     * @returns {Boolean}
     */
    isVanilla: function() {
        return _(this._initialAttributes).isEqual(this.attributes);
    },

    /**
     * Test if model has data to be synced
     *
     * @returns {Boolean}
     */
    isSyncable: function() {
        return this.isNew() || !this.isVanilla();
    },

    /**
     * Test if model has a valid url
     *
     * @returns {Boolean}
     */
    hasUrl: function() {
        var baseUrl =
            _.result(this, 'urlRoot') ||
            _.result(this.collection, 'url');

        return !!baseUrl;
    }
});