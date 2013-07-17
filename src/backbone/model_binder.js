(function () {
    'use strict';

    var ModelBinder = Backbone.ModelBinder = function (view) {

        ////////////////////

        if (!(this instanceof ModelBinder)) {
            return new ModelBinder(view);
        }

        ////////////////////

        this.bindings = {};

        ////////////////////

        _.extend(this, { view: view, model: view.model });

        _.extend(view, {
            modelBinder: this
        }, {
            setElement: _.wrap(view.setElement, function (fn, element, delegate) {
                var modelBinder = this.modelBinder;

                if (this.$el) {
                    modelBinder.undelegateEvents();
                }

                fn.call(this, element, delegate);

                if (delegate !== false) {
                    modelBinder.delegateEvents();
                }

                return this;
            })
        }, {
            refresh: function () {
                var bindings = this.modelBinder.bindings;

                _.each(bindings, function (options) {
                    _.result(options, 'setter');
                });

                return this;
            }
        });
    };

    _.extend(ModelBinder, {
        types: {
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
                this._addBinding(binding, options);
            }, this);

            this.view.refresh();

            return this;
        },

        startListening: function (binding) {

            ////////////////////

            var bindings = this.bindings;

            if (binding) {
                bindings = _.pick(bindings, binding);
            }

            ////////////////////

            _.each(bindings, function (options, binding) {

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

            var bindings = this.bindings;

            if (binding) {
                bindings = _.pick(bindings, binding);
            }

            ////////////////////

            _.each(bindings, function (options) {

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

            var bindings = this.bindings;

            if (binding) {
                bindings = _.pick(bindings, binding);
            }

            ////////////////////

            _.each(bindings, function (options, binding) {

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

            var bindings = this.bindings;

            if (binding) {
                bindings = _.pick(bindings, binding);
            }

            ////////////////////

            _.each(bindings, function (options, binding) {

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

        _addBinding: function (binding, options) {

            ////////////////////

            var match = binding.match(/^\s*([-\w]+)\s*:\s*([-\w]+)\s*$/),

                type = match[1],
                attribute = match[2],

                selector = options.selector;

            ////////////////////

            var handlers = this.constructor.types[type] || {};

            ////////////////////

            this.undelegateEvents(binding).stopListening(binding);

            this.bindings[binding] = _.defaults(options, {
                getter: _.wrap(handlers.getter, function (fn) {
                    var $el = selector ? this.$(selector) : this.$el,
                        value = fn ? fn.call($el) : $el.prop(type);

                    return this.model.set(attribute, value, options);
                }),

                setter: _.wrap(handlers.setter, function (fn) {
                    var $el = selector ? this.$(selector) : this.$el,
                        value = this.model.get(attribute);

                    return fn ? fn.call($el, value) : $el.prop(type, value);
                })
            });

            this._bindHandlers(options);

            this.delegateEvents(binding).startListening(binding);
        },

        _bindHandlers: function (options) {

            ////////////////////

            var getter = options.getter, setter = options.setter;

            ////////////////////

            var view = this.view;

            if (getter) options.getter = _.bind(getter, view);
            if (setter) options.setter = _.bind(setter, view);
        }
    });
}());
