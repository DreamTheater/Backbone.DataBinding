(function (View) {
    'use strict';

    Backbone.ViewCollection = View.extend({
        view: Backbone.ViewModel,

        constructor: function () {

            /////////////////
            // DEFINITIONS //
            /////////////////

            this.views = [];

            /////////////////

            View.apply(this, arguments);

            /////////////////

            var collection = this.collection;

            this.listenTo(collection, 'add', this._addView);
            this.listenTo(collection, 'remove', this._removeView);
            this.listenTo(collection, 'sort', this.sort);
            this.listenTo(collection, 'reset', this.reset);

            this.reset();
        },

        remove: _.wrap(View.prototype.remove, function (remove) {
            this._removeViews();

            return remove.call(this);
        }),

        get: function (object) {
            var id = object.id || object,
                cid = object.cid || object;

            return _.find(this.views, function (view) {
                var model = view.model;

                return (model.id === id || model.cid === cid);
            });
        },

        at: function (index) {
            return this.views[index];
        },

        sort: function () {
            var views = this.views,

                collection = this.collection,
                comparator = collection.comparator;

            if (_.isString(comparator)) {
                this.views = _.sortBy(views, function (view) {
                    return view.model[comparator];
                });
            } else if (comparator.length === 1) {
                this.views = _.sortBy(views, function (view) {
                    return comparator.call(collection, view.model);
                });
            } else {
                views.sort(function (aView, bView) {
                    return comparator.call(collection, aView.model, bView.model);
                });
            }

            this._refreshViews();

            return this;
        },

        reset: function () {
            this._refreshViews(true);

            return this;
        },

        _addView: function (model) {
            var views = this.views,

                view = this.get(model) || new this.view({ model: model }).render(),
                index = _.indexOf(views, view);

            if (index === -1) {
                views.push(view);
            }

            view.$el.appendTo(this.$el);
        },

        _removeView: function (model) {
            var views = this.views,

                view = this.get(model),
                index = _.indexOf(views, view);

            views.splice(index, 1);

            view.remove();
        },

        _refreshViews: function (force) {
            if (force) {
                this._removeViews();
            } else {
                this._cleanViews();
            }

            this.collection.each(this._addView, this);
        },

        _removeViews: function () {
            var views = this.views;

            while (views.length > 0) {
                this._removeView(views[0].model);
            }
        },

        _cleanViews: function () {
            this.$el.empty();
        }
    });
}(Backbone.View));
