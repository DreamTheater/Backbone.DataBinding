(function () {
    'use strict';

    ////////////////
    // SUPERCLASS //
    ////////////////

    var View = Backbone.View;

    ////////////////

    /**
     * @class
     */
    Backbone.ViewCollection = View.extend({
        view: Backbone.ViewModel,

        /**
         * @constructor
         */
        constructor: function (options) {

            ////////////////
            // PROPERTIES //
            ////////////////

            this.views = [];

            ////////////////

            /**
             * @override
             */
            this.initialize = _.wrap(this.initialize, function (fn, options) {
                var collection = this.collection;

                this.listenTo(collection, 'reset', this.syncToCollection);
                this.listenTo(collection, 'sort', this._sortViews);
                this.listenTo(collection, 'add', this._addView);
                this.listenTo(collection, 'remove', this._removeView);

                if (!collection.isEmpty()) {
                    this.syncToCollection();
                }

                return fn.call(this, options);
            });

            View.call(this, options);
        },

        /**
         * @override
         */
        remove: _.wrap(View.prototype.remove, function (fn) {
            this._destroyViews();

            return fn.call(this);
        }),

        get: function (object) {
            var id = object.id || object,
                cid = object.cid || object;

            return _.find(this.views, function (view) {
                var model = view.model;

                return model.id === id || model.cid === cid;
            });
        },

        at: function (index) {
            return this.views[index];
        },

        syncToCollection: function () {
            this._refreshViews({
                reset: true
            });

            return this;
        },

        _sortViews: function (collection) {
            var views = this.views, comparator = collection.comparator;

            if (comparator) {
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
            }
        },

        _addView: function (model) {
            var views = this.views, place = this._ensureContainer(model),

                view = this.get(model) || this._prepareView(model),
                index = _.indexOf(views, view);

            if (index === -1) {
                views.push(view);
            }

            view.$el.appendTo(place);
        },

        _removeView: function (model) {
            var views = this.views,

                view = this.get(model),
                index = _.indexOf(views, view);

            if (index !== -1) {
                views.splice(index, 1);
            }

            view.remove();
        },

        _prepareView: function (model) {
            var View = this.view,

                view = new View({
                    model: model
                });

            return view.render();
        },

        _ensureContainer: function (model) {
            var container = this.container;

            if (_.isFunction(container)) {
                container = container.call(this, model);
            }

            return container ? this.$(container) : this.$el;
        },

        _refreshViews: function (options) {

            ///////////////////
            // NORMALIZATION //
            ///////////////////

            options = options || {};

            ///////////////////

            if (options.reset) {
                this._destroyViews();
            } else {
                this._detachViews();
            }

            this.collection.each(this._addView, this);
        },

        _destroyViews: function () {
            var views = this.views;

            while (views.length > 0) {
                this._removeView(views[0].model);
            }
        },

        _detachViews: function () {
            var views = this.views;

            _.each(views, function (view) {
                view.$el.detach();
            });
        }
    });
}());
