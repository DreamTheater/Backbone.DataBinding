/*!
 * Backbone.DataBinding v0.1.9
 * https://github.com/DreamTheater/Backbone.DataBinding
 *
 * Copyright (c) 2013 Dmytro Nemoga
 * Released under the MIT license
 */
(function (View) {
    'use strict';

    Backbone.ViewModel = View.extend({
        constructor: function () {

            /////////////////
            // DEFINITIONS //
            /////////////////

            this.bindings = {};

            /////////////////

            View.apply(this, arguments);
        },

        setElement: _.wrap(View.prototype.setElement, function (setElement, element, delegate) {
            if (this.$el) {
                this.undelegateBindings();
            }

            setElement.call(this, element, delegate);

            this.delegateBindings();

            return this;
        }),

        binding: function (event, selector, binding, options) {
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

            data: function (elements) {
                return elements.data();
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

            data: function (elements, value) {
                if (value) {
                    elements.data(value);
                } else {
                    elements.removeData();
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
}(Backbone.View));

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
            var view = this.get(model) || this._prepareView(model);

            this.$el.append(view.$el);
        },

        _removeView: function (model) {
            var views = this.views, view = this.get(model), index = _.indexOf(views, view);

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

        _removeViews: function () {
            var views = this.views;

            while (views.length > 0) {
                views[0].remove();
            }
        },

        _prepareView: function (model) {
            var View = this.view, view = new View({ model: model });

            this.views.push(view);

            return view.render();
        }
    });
}(Backbone.View));
