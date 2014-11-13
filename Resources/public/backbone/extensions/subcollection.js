Extension = window.Extension || {};

/**
 * Sub-collection extension
 * A sub collection sync with a parent collection
 *
 * Eg:
 * - subcollection:    activeUsers
 * - parentcollection: allUsers
 *
 * Add and remove in subcollection are synced with the parent collection, but add and remove in parent collection
 * are not synced the subcollections because we don't know how they are related.
 *
 * Model changes are sync with all collections because model are object references.
 */
Extension.SubCollection = Backbone.Collection.extend({
    constructor: function(models, options) {
        options || (options = {});

        // parent option should be set on initialization
        if (options.parent) {
            this.parent = options.parent;
            this.model = this.parent.model;
            this.comparator = this.parent.comparator;

            this.on("add", function(model, collection, options) {
                this.parent.add(model, options);
            });
            this.on("remove", function(model, collection, options) {
                this.parent.remove(model, options);
            });
            this.on("reset", function(collection, options) {
                this.parent.reset(options);
            });
            this.on("change", function(model, changes) {
                this.parent.get(model).set(model.toJSON());
            });
        }

        Backbone.Collection.apply(this, arguments);
    }
});