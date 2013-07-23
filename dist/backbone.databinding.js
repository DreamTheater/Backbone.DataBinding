/**
 * Backbone.DataBinding v0.3.7
 * https://github.com/DreamTheater/Backbone.DataBinding
 *
 * Copyright (c) 2013 Dmytro Nemoga
 * Released under the MIT license
 */
(function (self) {
    'use strict';

    var ModelBinder = Backbone.ModelBinder = function (view) {

        ////////////////////

        if (!(this instanceof ModelBinder)) {
            return new ModelBinder(view);
        }

        ////////////////////

        self = _.extend(this, { view: view, model: view.model }, {
            handlers: {}
        });

        ////////////////////

        _.extend(view, {
            setElement: _.wrap(view.setElement, function (fn, element, delegate) {
                if (this.$el) {
                    self.undelegateEvents();
                }

                fn.call(this, element, delegate);

                if (delegate !== false) {
                    self.delegateEvents();
                }

                return this;
            })
        });
    };

    _.extend(ModelBinder, {
        handlers: {
            html: {
                getter: function () {
                    return this.html();
                },

                setter: function (value) {
                    if (!_.isNull(value) && !_.isUndefined(value)) {
                        this.html(value);
                    } else {
                        this.empty();
                    }
                }
            },

            text: {
                getter: function () {
                    return this.text();
                },

                setter: function (value) {
                    if (!_.isNull(value) && !_.isUndefined(value)) {
                        this.text(value);
                    } else {
                        this.empty();
                    }
                }
            },

            value: {
                getter: function () {
                    return this.val();
                },

                setter: function (value) {
                    if (!_.isNull(value) && !_.isUndefined(value)) {
                        this.val(value);
                    } else {
                        this.val(null);
                    }
                }
            },

            checked: {
                getter: function () {
                    var value, values = _.chain(this).filter(function (el) {
                        return el.checked;
                    }).pluck('value').value();

                    if (this.prop('type') === 'radio') {
                        value = values[0];
                    } else if (this.prop('value') === 'on') {
                        value = !!values[0];
                    } else {
                        value = values;
                    }

                    return value;
                },

                setter: function (value) {

                    ////////////////////

                    var values = _.isArray(value) ? value : [value];

                    values = _.map(values, function (value) {
                        return String(value);
                    });

                    ////////////////////

                    var $el = this.filter(function () {
                        return _.contains(values, this.value);
                    });

                    this.prop('checked', false);

                    if (this.prop('type') === 'radio' || this.prop('value') !== 'on') {
                        $el.prop('checked', true);
                    } else if (value) {
                        this.prop('checked', true);
                    }
                }
            },

            visible: {
                getter: function () {
                    return this.is(':visible');
                },

                setter: function (value) {
                    this.prop('hidden', !value);
                }
            },

            hidden: {
                getter: function () {
                    return this.is(':hidden');
                },

                setter: function (value) {
                    this.prop('hidden', value);
                }
            },

            enabled: {
                getter: function () {
                    return this.is(':enabled');
                },

                setter: function (value) {
                    this.prop('disabled', !value);
                }
            },

            disabled: {
                getter: function () {
                    return this.is(':disabled');
                },

                setter: function (value) {
                    this.prop('disabled', value);
                }
            }
        }
    });

    _.extend(ModelBinder.prototype, {
        constructor: ModelBinder,

        define: function (binding, options) {

            ////////////////////

            var bindings;

            if (!binding || _.isObject(binding)) {
                bindings = binding;
            } else {
                (bindings = {})[binding] = options;
            }

            ////////////////////

            _.each(bindings, function (options, binding) {
                this._addHandlers(binding, options);
            }, this);

            this.refresh();

            return this;
        },

        refresh: function () {

            ////////////////////

            var callbacks = _.pluck(this.handlers, 'setter');

            ////////////////////

            _.each(callbacks, function (callback) {
                if (callback) callback();
            });

            return this;
        },

        startListening: function (binding) {

            ////////////////////

            var handlers = this.handlers;

            if (binding) {
                handlers = _.pick(handlers, binding);
            }

            ////////////////////

            _.each(handlers, function (options, binding) {

                ////////////////////

                var setter = options.setter;

                ////////////////////

                this.stopListening(binding);

                if (setter) {
                    this.view.listenTo(this.model, 'change', setter);
                }
            }, this);

            return this;
        },

        stopListening: function (binding) {

            ////////////////////

            var handlers = this.handlers;

            if (binding) {
                handlers = _.pick(handlers, binding);
            }

            ////////////////////

            _.each(handlers, function (options) {

                ////////////////////

                var setter = options.setter;

                ////////////////////

                if (setter) {
                    this.view.stopListening(this.model, 'change', setter);
                }
            }, this);

            return this;
        },

        delegateEvents: function (binding) {

            ////////////////////

            var handlers = this.handlers;

            if (binding) {
                handlers = _.pick(handlers, binding);
            }

            ////////////////////

            _.each(handlers, function (options, binding) {

                ////////////////////

                var events = this.resolveEvents(binding, options),
                    selector = options.selector, getter = options.getter;

                ////////////////////

                this.undelegateEvents(binding);

                if (getter) {
                    this.view.$el.on(events, selector, getter);
                }
            }, this);

            return this;
        },

        undelegateEvents: function (binding) {

            ////////////////////

            var handlers = this.handlers;

            if (binding) {
                handlers = _.pick(handlers, binding);
            }

            ////////////////////

            _.each(handlers, function (options, binding) {

                ////////////////////

                var events = this.resolveEvents(binding, options),
                    selector = options.selector, getter = options.getter;

                ////////////////////

                if (getter) {
                    this.view.$el.off(events, selector, getter);
                }
            }, this);

            return this;
        },

        resolveEvents: function (binding, options) {

            ////////////////////

            var event = options.event || 'change';

            ////////////////////

            var events = event.match(/\S+/g);

            events = _.map(events, function (event) {
                return event + '.' + binding + '.modelBinder.' + this.view.cid;
            }, this);

            return events.join(' ');
        },

        _addHandlers: function (binding, options) {

            ////////////////////

            var match = binding.match(/^\s*([-\w]+)\s*:\s*([-\w]+)\s*$/),

                type = match[1],
                attribute = match[2],

                selector = options.selector;

            ////////////////////

            var callbacks = this.constructor.handlers[type] || {};

            ////////////////////

            this.undelegateEvents(binding).stopListening(binding);

            this.handlers[binding] = _.defaults(options, {
                getter: _.wrap(callbacks.getter, function (fn) {
                    var $el = selector ? this.$(selector) : this.$el,
                        value = fn ? fn.call($el) : $el.prop(type);

                    return this.model.set(attribute, value, options);
                }),

                setter: _.wrap(callbacks.setter, function (fn) {
                    var $el = selector ? this.$(selector) : this.$el,
                        value = this.model.get(attribute);

                    return fn ? fn.call($el, value) : $el.prop(type, value);
                })
            });

            this._bindCallbacks(options);

            this.delegateEvents(binding).startListening(binding);
        },

        _bindCallbacks: function (options) {

            ////////////////////

            var getter = options.getter, setter = options.setter;

            ////////////////////

            var view = this.view;

            if (getter) options.getter = _.bind(getter, view);
            if (setter) options.setter = _.bind(setter, view);
        }
    });
}());

/*jshint maxstatements:12 */
(function (self) {
    'use strict';

    var CollectionBinder = Backbone.CollectionBinder = function (view, options) {

        ////////////////////

        if (!(this instanceof CollectionBinder)) {
            return new CollectionBinder(view, options);
        }

        ////////////////////

        self = _.extend(this, { view: view, collection: view.collection }, { options: options }, {
            views: []
        });

        ////////////////////

        _.extend(view, {
            remove: _.wrap(view.remove, function (fn) {
                self.removeViews().removeDummy();

                return fn.call(this);
            })
        }, {
            get: function (object) {

                ////////////////////

                var id = object.id || object, cid = object.cid || object;

                ////////////////////

                var views = self.views;

                return _.find(views, function (view) {
                    var model = view.model;

                    return model.id === id || model.cid === cid;
                });
            },

            at: function (index) {
                return self.views[index];
            }
        });
    };

    _.extend(CollectionBinder, {
        handlers: {
            add: function (model) {
                var views = this.views, view = this.view.get(model) || this._prepareView(model),
                    index = _.indexOf(views, view), element = this._ensureElement(model);

                if (index === -1) {
                    views.push(view);
                }

                view.$el.appendTo(element);
            },

            remove: function (model) {
                var views = this.views, view = this.view.get(model),
                    index = _.indexOf(views, view);

                if (index !== -1) {
                    views.splice(index, 1);
                }

                if (view) view.remove();
            },

            reset: function (collection) {
                this.removeViews().renderViews(collection);
            },

            sort: function (collection) {
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

            var callbacks = _.pick(this.handlers, 'reset');

            ////////////////////

            _.each(callbacks, function (callback) {
                if (callback) callback(this.collection);
            }, this);

            return this;
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

        renderViews: function (collection) {
            collection.each(this.constructor.handlers.add, this);

            return this;
        },

        removeViews: function () {
            var views = this.views;

            _.each(views, function (view) {
                view.remove();
            });

            views.splice(0);

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
            var dummy = this.dummy, element;

            if (!dummy) {
                dummy = this._prepareView();
                element = this._ensureElement();

                if (dummy) {
                    dummy.$el.appendTo(element);

                    this.dummy = dummy;
                }
            }

            return this;
        },

        removeDummy: function () {
            var dummy = this.dummy;

            if (dummy) {
                dummy.remove();

                delete this.dummy;
            }

            return this;
        },

        _addHandlers: function (options) {

            ////////////////////

            var callbacks = this.constructor.handlers;

            ////////////////////

            this.stopListening();

            this.handlers = _.defaults(options, {
                add: _.wrap(callbacks.add, function (fn, model) {
                    this.removeDummy();

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

        _prepareView: function (model) {

            ////////////////////

            var View = this.options.view, Dummy = this.options.dummy;

            ////////////////////

            var view;

            if (model) {
                view = new View({ model: model });
            } else if (Dummy) {
                view = new Dummy();
            }

            return view ? view.render() : null;
        },

        _ensureElement: function (model) {

            ////////////////////

            var selector = this.options.selector;

            ////////////////////

            var view = this.view;

            if (_.isFunction(selector)) {
                selector = selector.call(view, model);
            }

            return selector ? view.$(selector) : view.$el;
        }
    });
}());
