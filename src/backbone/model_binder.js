(function () {
    'use strict';

    ////////////////////

    var scope;

    ////////////////////

    var ModelBinder = Backbone.ModelBinder = function (view, model) {

        ////////////////////

        if (!(this instanceof ModelBinder)) {
            return new ModelBinder(view, model);
        }

        ////////////////////

        scope = _.extend(this, {
            view: view,
            model: model
        }, {
            handlers: {}
        });

        ////////////////////

        _.extend(view, {
            setElement: _.wrap(view.setElement, function (fn, element, delegate) {
                if (this.$el) {
                    scope.undelegateEvents();
                }

                fn.call(this, element, delegate);

                if (delegate !== false) {
                    scope.delegateEvents();
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

                    ////////////////////

                    value = _.isNull(value) || _.isUndefined(value) ? '' : String(value);

                    ////////////////////

                    this.html(value);
                }
            },

            text: {
                getter: function () {
                    return this.text();
                },

                setter: function (value) {

                    ////////////////////

                    value = _.isNull(value) || _.isUndefined(value) ? '' : String(value);

                    ////////////////////

                    this.text(value);
                }
            },

            value: {
                getter: function () {
                    var value = this.val() || [];

                    return this.is('select[multiple]') ? value : String(value);
                },

                setter: function (value) {

                    ////////////////////

                    if (_.isArray(value)) {
                        value = _.reject(value, function (value) {
                            return _.isNull(value) || _.isUndefined(value);
                        });
                    } else {
                        value = _.isNull(value) || _.isUndefined(value) ? [] : String(value);
                    }

                    ////////////////////

                    this.val(value);
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
                    var values = _.isArray(value) ? value : [String(value)];

                    values = _.reject(values, function (value) {
                        return _.isNull(value) || _.isUndefined(value);
                    });

                    if (this.prop('type') === 'radio') {
                        this.val(values);
                    } else if (this.prop('value') === 'on') {
                        this.prop('checked', value);
                    } else {
                        this.val(values);
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

        watch: function (binding, options) {

            ////////////////////

            var bindings;

            if (!binding || _.isObject(binding)) {
                bindings = binding;
            } else {
                (bindings = {})[binding] = options;
            }

            ////////////////////

            _.each(bindings, function (options, binding) {

                ////////////////////

                options = options || {};

                ////////////////////

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

        delegateEvents: function (binding) {

            ////////////////////

            var handlers = this.handlers;

            if (binding) {
                handlers = _.pick(handlers, binding);
            }

            ////////////////////

            _.each(handlers, function (options, binding) {

                ////////////////////

                var events = this._resolveEvents.call({
                        view: this.view,
                        options: options
                    }, binding),

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

                var events = this._resolveEvents.call({
                        view: this.view,
                        options: options
                    }, binding),

                    selector = options.selector, getter = options.getter;

                ////////////////////

                if (getter) {
                    this.view.$el.off(events, selector, getter);
                }
            }, this);

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

        _addHandlers: function (binding, options) {

            ////////////////////

            var match = binding.match(/^\s*([-\w]+)\s*:\s*([-\w]+)\s*$/),

                type = match[1], attribute = match[2];

            ////////////////////

            var callbacks = this.constructor.handlers[type] || {};

            ////////////////////

            this.undelegateEvents(binding).stopListening(binding);

            this.handlers[binding] = _.defaults(options, {
                getter: _.wrap(callbacks.getter, function (fn) {
                    var $el = this._resolveElement.call({
                            view: this.view,
                            options: options
                        }),

                        value = fn ? fn.call($el) : $el.attr(type);

                    return this.model.set(attribute, value, options);
                }),

                setter: _.wrap(callbacks.setter, function (fn) {
                    var $el = this._resolveElement.call({
                            view: this.view,
                            options: options
                        }),

                        value = this.model.get(attribute);

                    return fn ? fn.call($el, value) : $el.attr(type, value);
                })
            });

            this._bindCallbacks(options);

            this.delegateEvents(binding).startListening(binding);
        },

        _bindCallbacks: function (options) {

            ////////////////////

            var getter = options.getter, setter = options.setter;

            ////////////////////

            if (getter) options.getter = _.bind(getter, this);
            if (setter) options.setter = _.bind(setter, this);
        },

        _resolveElement: function () {

            ////////////////////

            var selector = this.options.selector;

            ////////////////////

            var view = this.view;

            if (_.isFunction(selector)) {
                selector = selector.call(view);
            }

            return selector ? view.$(selector) : view.$el;
        },

        _resolveEvents: function (binding) {

            ////////////////////

            var event = this.options.event || 'change';

            ////////////////////

            var events = event.match(/\S+/g);

            events = _.map(events, function (event) {
                return event + '.' + binding + '.modelBinder.' + this.view.cid;
            }, this);

            return events.join(' ');
        }
    });
}());
