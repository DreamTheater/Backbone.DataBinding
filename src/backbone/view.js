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

            checked: function (elements) {
                if (elements.prop('type') === 'radio') {
                    return _.pluck(elements.serializeArray(), 'value')[0];
                } else if (elements.length > 1) {
                    return _.pluck(elements.serializeArray(), 'value');
                } else {
                    return elements.prop('checked');
                }
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

            checked: function (elements, value) {
                if (elements.prop('type') === 'radio') {
                    elements.filter('[value="' + value + '"]').prop('checked', true);
                } else if (elements.length > 1) {
                    elements.prop('checked', false).filter(_.map(value, function (value) {
                        return '[value="' + value + '"]';
                    }).join(', ')).prop('checked', true);
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
                this._undelegateBindings();
            }

            setElement.call(this, element, delegate);

            this._delegateBindings();

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
                        value = null;

                    if (reader) {
                        value = reader.call(this, elements);
                    } else {
                        value = elements.prop(property);
                    }

                    this.model.set(attribute, value, options);
                }, this);

                this._delegateBindings();
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

        syncToModel: function () {
            this.model.trigger('change', this.model);

            return this;
        },

        _delegateBindings: function () {
            this._undelegateBindings();

            _.each(this._bindings, function (handler, binding) {
                var match = binding.match(/^(\S+)\s*(.*)$/),

                    event = match[1] + '.delegateBindings.' + this.cid,
                    selector = match[2];

                this.$el.on(event, selector, handler);
            }, this);
        },

        _undelegateBindings: function () {
            this.$el.off('.delegateBindings.' + this.cid);
        }
    });
}());
