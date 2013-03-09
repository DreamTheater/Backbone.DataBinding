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
            this.listenTo(collection, 'reset', this._resetViews);
            this.listenTo(collection, 'sort', this._sortViews);

            this._resetViews(collection);
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

                return model.id === id || model.cid === cid;
            });
        },

        at: function (index) {
            return this.views[index];
        },

        _addView: function (model) {
            var views = this.views,

                view = this.get(model) || this._prepareView(model),
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

        _resetViews: function (collection) {
            this._removeViews();

            collection.each(this._addView, this);
        },

        _sortViews: function (collection) {
            this.$el.empty();

            collection.each(this._addView, this);
        },

        _prepareView: function (model) {
            var View = this.view, view = new View({ model: model });

            return view.render();
        },

        _removeViews: function () {
            var views = this.views;

            while (views.length > 0) {
                this._removeView(views[0].model);
            }
        }
    });
}(Backbone.View));
