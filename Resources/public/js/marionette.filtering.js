Backbone.Marionette.CollectionView.prototype.addChildView = function(item, collection, options) {
    var filter = this.options.filter || this.filter;
    if (filter && !filter.call(this, item)) {
        return;
    }

    this.closeEmptyView();
    var itemView = this.getItemView(item);
    var index = this.collection.indexOf(item);
    this.addItemView(item, itemView, index);
};

Backbone.Marionette.CollectionView.prototype.showCollection = function() {
    var filter = this.options.filter || this.filter;

    this.collection.each(function(item, index) {
        if (filter && !filter.call(this, item)) {
            return;
        }

        var itemView = this.getItemView(item);
        this.addItemView(item, itemView, index);
    }, this);
};