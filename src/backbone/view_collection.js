Backbone.ViewCollection = (function (View) {
    'use strict';

    return View.extend({
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
            this.listenTo(collection, 'reset', this._resetViews);
            this.listenTo(collection, 'sort', this._sortViews);

            this._resetViews(collection);
        },

        remove: _.wrap(View.prototype.remove, function (remove) {
            this._removeViews();

            return remove.call(this);
        }),

        get: function (object) {
            return _.find(this.views, function (view) {
                var model = view.model;

                return model.id === object.id || model.cid === object.cid || model.id === object;
            });
        },

        at: function (index) {
            return this.views[index];
        },

        _addView: function (model) {
            var view = this.get(model) || this._prepareView(model);

            this.$el.append(view.el);
        },

        _resetViews: function (collection) {
            this._removeViews();

            collection.each(this._addView, this);
        },

        _sortViews: function (collection) {
            this.$el.empty();

            collection.each(this._addView, this);
        },

        _prepareView: function (model) {
            var View = this.view, view = new View({
                model: model
            });

            view.container = this;

            this.views.push(view);

            return view.render();
        },

        _removeViews: function () {
            var views = this.views;

            while (views.length > 0) {
                views[0].remove();
            }
        }
    });
}(Backbone.View));
