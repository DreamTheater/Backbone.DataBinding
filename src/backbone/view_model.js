(function () {
    'use strict';

    ////////////////
    // SUPERCLASS //
    ////////////////

    var View = Backbone.View;

    ////////////////

    /**
     * @function
     */
    function isTrue(value) {
        return _.isBoolean(value) ? value : !_.isUndefined(value) && !_.isNull(value);
    }

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
            this.initialize = _.wrap(this.initialize, function (fn, options) {

                ////////////////
                // PROPERTIES //
                ////////////////

                this.bindings = {};

                ////////////////

                return fn.call(this, options);
            });

            View.call(this, options);
        },

        /**
         * @override
         */
        setElement: _.wrap(View.prototype.setElement, function (fn, element, delegate) {
            if (this.$el) {
                this.undelegateBindings();
            }

            fn.call(this, element, delegate);

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
                    var reader = this.constructor.readers[type],

                        elements = this.$(selector),
                        value = reader ? reader.call(this, elements) : elements.prop(type);

                    this.model.set(attribute, value, options);
                }, this);

                this.delegateBindings();
            }

            this.listenTo(this.model, 'change', function (model) {
                var writer = this.constructor.writers[type],

                    elements = this.$(selector),
                    value = model.get(attribute);

                if (writer) {
                    writer.call(this, elements, value);
                } else {
                    elements.prop(type, value);
                }
            });

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

            visible: function (elements) {
                return elements.is(':visible');
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
                if (isTrue(value)) {
                    elements.html(value);
                } else {
                    elements.empty();
                }
            },

            text: function (elements, value) {
                if (isTrue(value)) {
                    elements.text(value);
                } else {
                    elements.empty();
                }
            },

            visible: function (elements, value) {
                if (isTrue(value)) {
                    elements.show();
                } else {
                    elements.hide();
                }
            },

            value: function (elements, value) {
                if (isTrue(value)) {
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
