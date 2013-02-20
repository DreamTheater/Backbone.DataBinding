(function () {
    'use strict';

    var View = Backbone.View;

    Backbone.View = View.extend({
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
                    elements.not(matchedElements).prop('checked', false);
                    matchedElements.prop('checked', true);
                } else {
                    elements.prop('checked', value);
                }
            }
        },

        constructor: function () {

            /////////////////
            // DEFINITIONS //
            /////////////////

            this._bindings = {};

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
            var tokens = binding.split(':'),

                property = tokens[0],
                attribute = tokens[1];

            if (event) {
                this._bindings[event + ' ' + selector] = _.bind(function () {
                    var elements = this.$(selector),
                        reader = this.readers[property],
                        value = reader ? reader.call(this, elements) : elements.prop(property);

                    this.model.set(attribute, value, options);
                }, this);

                this.delegateBindings();
            }

            this.listenTo(this.model, 'change', function (model) {
                var elements = this.$(selector),
                    writer = this.writers[property],
                    value = model.get(attribute);

                if (writer) {
                    writer.call(this, elements, value);
                } else {
                    elements.prop(property, value);
                }
            });

            this.syncToModel();

            return this;
        },

        delegateBindings: function () {
            this.undelegateBindings();

            _.each(this._bindings, function (handler, binding) {
                var match = binding.match(/^(\S+)\s*(.*)$/),

                    event = match[1] + '.delegateBindings.' + this.cid,
                    selector = match[2];

                this.$el.on(event, selector, handler);
            }, this);
        },

        undelegateBindings: function () {
            this.$el.off('.delegateBindings.' + this.cid);
        },

        syncToModel: function () {
            var model = this.model;

            model.trigger('change', model);

            return this;
        }
    });
}());
