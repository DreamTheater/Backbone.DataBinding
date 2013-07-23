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
                    var values = _.isArray(value) ? value : [value];

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
                        value = fn ? fn.call($el) : $el.attr(type);

                    return this.model.set(attribute, value, options);
                }),

                setter: _.wrap(callbacks.setter, function (fn) {
                    var $el = selector ? this.$(selector) : this.$el,
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

            var view = this.view;

            if (getter) options.getter = _.bind(getter, view);
            if (setter) options.setter = _.bind(setter, view);
        }
    });
}());
