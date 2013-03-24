/**
 * Backbone.DataBinding v0.2.7
 * https://github.com/DreamTheater/Backbone.DataBinding
 *
 * Copyright (c) 2013 Dmytro Nemoga
 * Released under the MIT license
 */
(function () {
    'use strict';

    var View = Backbone.View;

    /**
     * @class
     */
    Backbone.ViewModel = View.extend({

        /**
         * @constructor
         */
        constructor: function (options) {

            /**
             * @override
             */
            this.initialize = _.wrap(this.initialize, function (initialize, options) {

                /////////////////
                // DEFINITIONS //
                /////////////////

                this.bindings = {};

                /////////////////

                return initialize.call(this, options);
            });

            View.call(this, options);
        },

        /**
         * @override
         */
        setElement: _.wrap(View.prototype.setElement, function (setElement, element, delegate) {
            if (this.$el) {
                this.undelegateBindings();
            }

            setElement.call(this, element, delegate);

            if (delegate !== false) {
                this.delegateBindings();
            }

            return this;
        }),

        binding: function (selector, binding, event, options) {
            var match = binding.match(/^(\S+):(\S+)$/),

                type = match[1],
                attribute = match[2];

            if (event) {
                this.bindings[event + ' ' + selector] = _.bind(function () {
                    var readers = this.constructor.readers, reader = readers[type],

                        elements = this.$(selector),
                        value = reader ? reader.call(readers, elements) : elements.prop(type);

                    this.model.set(attribute, value, options);
                }, this);

                this.delegateBindings();
            }

            this.listenTo(this.model, 'change', function (model) {
                var writers = this.constructor.writers, writer = writers[type],

                    elements = this.$(selector),
                    value = model.get(attribute);

                if (writer) {
                    writer.call(writers, elements, value);
                } else {
                    elements.prop(type, value);
                }
            });

            this.syncToModel();

            return this;
        },

        delegateBindings: function (bindings) {

            ///////////////
            // INSURANCE //
            ///////////////

            bindings = bindings || _.result(this, 'bindings');

            ///////////////

            this.undelegateBindings();

            _.each(bindings, function (handler, binding) {
                var match = binding.match(/^(\S+)\s*(.*)$/),

                    event = match[1] + '.delegateBindings.' + this.cid,
                    selector = match[2];

                this.$el.on(event, selector, handler);
            }, this);

            return this;
        },

        undelegateBindings: function () {
            this.$el.off('.delegateBindings.' + this.cid);

            return this;
        },

        syncToModel: function () {
            var model = this.model;

            model.trigger('change', model);

            return this;
        }
    }, {
        readers: {
            html: function (elements) {
                return elements.html();
            },

            text: function (elements) {
                return elements.text();
            },

            value: function (elements) {
                return elements.val();
            },

            checked: function (elements) {
                var value, values = _.pluck(elements.serializeArray(), 'value');

                if (elements.prop('type') === 'radio') {
                    value = values[0];
                } else if (elements.length > 1) {
                    value = values;
                } else {
                    value = !!values[0];
                }

                return value;
            }
        },

        writers: {
            html: function (elements, value) {
                if (value) {
                    elements.html(value);
                } else {
                    elements.empty();
                }
            },

            text: function (elements, value) {
                if (value) {
                    elements.text(value);
                } else {
                    elements.empty();
                }
            },

            value: function (elements, value) {
                if (value) {
                    elements.val(value);
                } else {
                    elements.val(null);
                }
            },

            checked: function (elements, value) {
                var values = _.isArray(value) ? value : [value],

                    matchedElements = elements.filter(function () {
                        return _.contains(values, this.value);
                    });

                if (elements.prop('type') === 'radio') {
                    matchedElements.prop('checked', true);
                } else if (elements.length > 1) {
                    elements.not(matchedElements).filter(':checked').prop('checked', false);
                    matchedElements.not(':checked').prop('checked', true);
                } else {
                    elements.prop('checked', value);
                }
            }
        }
    });
}());

(function () {
    'use strict';

    var View = Backbone.View;

    /**
     * @class
     */
    Backbone.ViewCollection = View.extend({
        view: Backbone.ViewModel,

        /**
         * @constructor
         */
        constructor: function (options) {

            /**
             * @override
             */
            this.initialize = _.wrap(this.initialize, function (initialize, options) {

                /////////////////
                // DEFINITIONS //
                /////////////////

                this.views = [];

                /////////////////

                var collection = this.collection;

                this.listenTo(collection, 'reset', this.syncToCollection);
                this.listenTo(collection, 'sort', this._sortViews);
                this.listenTo(collection, 'add', this._addView);
                this.listenTo(collection, 'remove', this._removeView);

                this.syncToCollection();

                return initialize.call(this, options);
            });

            View.call(this, options);
        },

        /**
         * @override
         */
        remove: _.wrap(View.prototype.remove, function (remove) {
            this._destroyViews();

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

        syncToCollection: function () {
            this._refreshViews({ reset: true });

            return this;
        },

        _sortViews: function (collection) {
            var views = this.views, comparator = collection.comparator;

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
            return new this.view({ model: model }).render();
        },

        _ensureContainer: function (model) {
            var container = this.container;

            if (_.isFunction(container)) {
                container = container.call(this, model);
            }

            return (container ? this.$(container) : this.$el);
        },

        _refreshViews: function (options) {

            ///////////////
            // INSURANCE //
            ///////////////

            options = options || {};

            ///////////////

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
