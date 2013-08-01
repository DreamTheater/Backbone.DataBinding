/*jshint maxstatements:12, maxlen:102 */
(function (self) {
    'use strict';

    var CollectionBinder = Backbone.CollectionBinder = function (view, collection, options) {

        ////////////////////

        if (!(this instanceof CollectionBinder)) {
            return new CollectionBinder(view, collection, options);
        }

        ////////////////////

        self = _.extend(this, {
            view: view,
            collection: collection,
            options: options
        }, {
            views: []
        });

        ////////////////////

        _.extend(view, {
            remove: _.wrap(view.remove, function (fn) {
                self.removeViews().removeDummy();

                fn.call(this);

                return this;
            })
        });
    };

    _.extend(CollectionBinder, {
        handlers: {
            add: function (model) {
                var views = this.views, view = this.getViewByModel(model) || this._prepareView(model),

                    index = _.indexOf(views, view);

                if (index === -1) {
                    views.push(view);
                }

                if (view.$el.parent().length === 0) {
                    var element = this._resolveElement.call({
                        view: this.view,
                        options: this.options
                    }, model);

                    view.$el.appendTo(element);
                }
            },

            remove: function (model) {
                var views = this.views, view = this.getViewByModel(model),

                    index = _.indexOf(views, view);

                if (index !== -1) {
                    views.splice(index, 1);
                }

                if (view) {
                    view.remove();
                }
            },

            reset: function (collection) {
                this.removeViews().renderViews(collection);
            },

            sort: function (collection) {
                var views = this.views, comparator = collection.comparator;

                if (comparator) {
                    if (_.isString(comparator)) {
                        this.views = _.sortBy(views, function (view) {
                            return view.model.get(comparator);
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

                    this.detachViews().renderViews(collection);
                }
            }
        }
    });

    _.extend(CollectionBinder.prototype, {
        constructor: CollectionBinder,

        listen: function (options) {

            ////////////////////

            options = options || {};

            ////////////////////

            this._addHandlers(options);

            this.refresh();

            return this;
        },

        refresh: function () {

            ////////////////////

            var callback = this.handlers.reset;

            ////////////////////

            if (callback) callback(this.collection);

            return this;
        },

        renderViews: function (collection) {
            collection.each(this.constructor.handlers.add, this);

            return this;
        },

        removeViews: function () {
            var views = this.views;

            while (views.length > 0) {
                this.constructor.handlers.remove.call(this, views[0].model);
            }

            return this;
        },

        detachViews: function () {
            var views = this.views;

            _.each(views, function (view) {
                view.$el.detach();
            });

            return this;
        },

        renderDummy: function () {
            var dummy = this.getDummy() || this._prepareDummy();

            if (dummy) {
                this.dummy = dummy;

                if (dummy.$el.parent().length === 0) {
                    var element = this._resolveElement.call({
                        view: this.view,
                        options: this.options
                    });

                    dummy.$el.appendTo(element);
                }
            }

            return this;
        },

        removeDummy: function () {
            var dummy = this.getDummy();

            delete this.dummy;

            if (dummy) {
                dummy.remove();
            }

            return this;
        },

        detachDummy: function () {
            var dummy = this.getDummy();

            if (dummy) {
                dummy.$el.detach();
            }

            return this;
        },

        getViewByCid: function (cid) {
            var views = this.views;

            return _.find(views, function (view) {
                return view.cid === cid;
            });
        },

        getViewByIndex: function (index) {
            return this.views[index];
        },

        getViewByModel: function (model) {
            var views = this.views;

            return _.find(views, function (view) {
                return view.model === model;
            });
        },

        getDummy: function () {
            return this.dummy;
        },

        startListening: function (event) {

            ////////////////////

            var handlers = this.handlers;

            if (event) {
                handlers = _.pick(handlers, event);
            }

            ////////////////////

            _.each(handlers, function (callback, event) {
                this.stopListening(event);

                if (callback) {
                    this.view.listenTo(this.collection, event, callback);
                }
            }, this);

            return this;
        },

        stopListening: function (event) {

            ////////////////////

            var handlers = this.handlers;

            if (event) {
                handlers = _.pick(handlers, event);
            }

            ////////////////////

            _.each(handlers, function (callback, event) {
                if (callback) {
                    this.view.stopListening(this.collection, event, callback);
                }
            }, this);

            return this;
        },

        _addHandlers: function (options) {

            ////////////////////

            var callbacks = this.constructor.handlers;

            ////////////////////

            this.stopListening();

            this.handlers = _.defaults(options, {
                add: _.wrap(callbacks.add, function (fn, model) {
                    this.detachDummy();

                    fn.call(this, model);
                }),

                remove: _.wrap(callbacks.remove, function (fn, model) {
                    fn.call(this, model);

                    if (this.collection.isEmpty()) {
                        this.renderDummy();
                    }
                }),

                reset: _.wrap(callbacks.reset, function (fn, collection) {
                    this.removeDummy();

                    fn.call(this, collection);

                    if (this.collection.isEmpty()) {
                        this.renderDummy();
                    }
                }),

                sort: _.wrap(callbacks.sort, function (fn, collection) {
                    fn.call(this, collection);
                })
            });

            this._bindCallbacks(options);

            this.startListening();
        },

        _bindCallbacks: function (options) {

            ////////////////////

            var add = options.add, remove = options.remove,
                reset = options.reset, sort = options.sort;

            ////////////////////

            if (add) options.add = _.bind(add, this);
            if (remove) options.remove = _.bind(remove, this);
            if (reset) options.reset = _.bind(reset, this);
            if (sort) options.sort = _.bind(sort, this);
        },

        _resolveElement: function (model) {

            ////////////////////

            var selector = this.options.selector;

            ////////////////////

            var view = this.view;

            if (_.isFunction(selector)) {
                selector = selector.call(view, model);
            }

            return selector ? view.$(selector) : view.$el;
        },

        _prepareView: function (model) {

            ////////////////////

            var View = this.options.view;

            ////////////////////

            var view;

            try {
                view = new View({ model: model });
            } catch (error) {
                throw error;
            }

            return view.render();
        },

        _prepareDummy: function () {

            ////////////////////

            var Dummy = this.options.dummy;

            ////////////////////

            var dummy;

            try {
                dummy = new Dummy();
            } catch (error) {
                return;
            }

            return dummy.render();
        }
    });
}());
