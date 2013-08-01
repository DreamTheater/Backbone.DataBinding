/*jshint maxstatements:28, maxlen:117 */
$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var View = Backbone.View.extend({
        el: '#test-form',

        initialize: function () {
            var modelBinder = new Backbone.ModelBinder(this, this.model);

            this.modelBinder = modelBinder.watch({
                'html: output-html': { selector: '[name="output-html"]' },
                'text: output-text': { selector: '[name="output-text"]' },

                'value: text-input-value': { selector: '[name="text-input-value"]' },
                'value: textarea-value': { selector: '[name="textarea-value"]' },
                'value: single-select-value': { selector: '[name="single-select-value"]' },
                'value: multiple-select-value': { selector: '[name="multiple-select-value"]' },

                'checked: radio-input-checked': { selector: '[name="radio-input-checked"]' },
                'checked: single-checkbox-input-checked': { selector: '[name="single-checkbox-input-checked"]' },
                'checked: multiple-checkbox-input-checked': { selector: '[name="multiple-checkbox-input-checked"]' },

                'visible: button-visible': { selector: '[name="button-visible"]' },
                'hidden: button-hidden': { selector: '[name="button-hidden"]' },
                'enabled: button-enabled': { selector: '[name="button-enabled"]' },
                'disabled: button-disabled': { selector: '[name="button-disabled"]' }
            });
        }
    });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.ModelBinder', {
        setup: function () {
            this.view = new View({
                model: this.model = new Backbone.Model()
            });
        },

        teardown: function () {
            this.view.modelBinder.undelegateEvents();
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('sync output-html with model', function () {
        var attribute = 'output-html', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'A');
        strictEqual($el.html(), 'A');

        model.set(attribute, 'B');
        strictEqual($el.html(), 'B');

        model.set(attribute, '');
        strictEqual($el.html(), '');

        model.unset(attribute);
        strictEqual($el.html(), '');
    });

    test('sync output-text with model', function () {
        var attribute = 'output-text', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'A');
        strictEqual($el.text(), 'A');

        model.set(attribute, 'B');
        strictEqual($el.text(), 'B');

        model.set(attribute, '');
        strictEqual($el.text(), '');

        model.unset(attribute);
        strictEqual($el.text(), '');
    });

    test('sync text-input-value with model', function () {
        var attribute = 'text-input-value', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'A');
        strictEqual($el.val(), 'A');

        model.set(attribute, 'B');
        strictEqual($el.val(), 'B');

        model.set(attribute, '');
        strictEqual($el.val(), '');

        model.unset(attribute);
        strictEqual($el.val(), '');
    });

    test('sync textarea-value with model', function () {
        var attribute = 'textarea-value', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'A');
        strictEqual($el.val(), 'A');

        model.set(attribute, 'B');
        strictEqual($el.val(), 'B');

        model.set(attribute, '');
        strictEqual($el.val(), '');

        model.unset(attribute);
        strictEqual($el.val(), '');
    });

    test('sync single-select-value with model', function () {
        var attribute = 'single-select-value', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'A');
        strictEqual($el.val(), 'A');

        model.set(attribute, 'B');
        strictEqual($el.val(), 'B');

        model.set(attribute, '');
        strictEqual($el.val(), null);

        model.unset(attribute);
        strictEqual($el.val(), null);
    });

    test('sync multiple-select-value with model', function () {
        var attribute = 'multiple-select-value', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, ['A']);
        deepEqual($el.val(), ['A']);

        model.set(attribute, ['B']);
        deepEqual($el.val(), ['B']);

        model.set(attribute, ['A', 'B']);
        deepEqual($el.val(), ['A', 'B']);

        model.set(attribute, []);
        strictEqual($el.val(), null);

        model.unset(attribute);
        strictEqual($el.val(), null);
    });

    test('sync radio-input-checked with model', function () {
        var attribute = 'radio-input-checked', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'A');
        strictEqual($el.filter(':checked').val(), 'A');

        model.set(attribute, 'B');
        strictEqual($el.filter(':checked').val(), 'B');

        model.set(attribute, '');
        strictEqual($el.filter(':checked').length, 0);

        model.unset(attribute);
        strictEqual($el.filter(':checked').length, 0);
    });

    test('sync single-checkbox-input-checked with model', function () {
        var attribute = 'single-checkbox-input-checked', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, true);
        ok($el.is(':checked'));

        model.set(attribute, false);
        ok(!$el.is(':checked'));

        model.unset(attribute);
        ok(!$el.is(':checked'));
    });

    test('sync multiple-checkbox-input-checked with model', function () {
        var attribute = 'multiple-checkbox-input-checked', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, ['A']);
        strictEqual($el.filter(':checked').val(), 'A');

        model.set(attribute, ['B']);
        strictEqual($el.filter(':checked').val(), 'B');

        model.set(attribute, ['A', 'B']);
        strictEqual($el.filter(':checked').length, 2);

        model.set(attribute, []);
        strictEqual($el.filter(':checked').length, 0);

        model.unset(attribute);
        strictEqual($el.filter(':checked').length, 0);
    });

    test('sync button-visible with model', function () {
        var attribute = 'button-visible', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, true);
        ok($el.is(':visible'));

        model.set(attribute, false);
        ok(!$el.is(':visible'));

        model.unset(attribute);
        ok(!$el.is(':visible'));
    });

    test('sync button-hidden with model', function () {
        var attribute = 'button-hidden', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, true);
        ok($el.is(':hidden'));

        model.set(attribute, false);
        ok(!$el.is(':hidden'));

        model.unset(attribute);
        ok(!$el.is(':hidden'));
    });

    test('sync button-enabled with model', function () {
        var attribute = 'button-enabled', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, true);
        ok($el.is(':enabled'));

        model.set(attribute, false);
        ok(!$el.is(':enabled'));

        model.unset(attribute);
        ok(!$el.is(':enabled'));
    });

    test('sync button-disabled with model', function () {
        var attribute = 'button-disabled', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, true);
        ok($el.is(':disabled'));

        model.set(attribute, false);
        ok(!$el.is(':disabled'));

        model.unset(attribute);
        ok(!$el.is(':disabled'));
    });

    test('sync model with output-html', function () {
        var attribute = 'output-html', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.html('A').trigger('change');
        strictEqual(attributes[attribute], 'A');

        $el.html('B').trigger('change');
        strictEqual(attributes[attribute], 'B');

        $el.html('').trigger('change');
        strictEqual(attributes[attribute], '');

        $el.html(null).trigger('change');
        strictEqual(attributes[attribute], '');
    });

    test('sync model with output-text', function () {
        var attribute = 'output-text', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.text('A').trigger('change');
        strictEqual(attributes[attribute], 'A');

        $el.text('B').trigger('change');
        strictEqual(attributes[attribute], 'B');

        $el.text('').trigger('change');
        strictEqual(attributes[attribute], '');

        $el.text(null).trigger('change');
        strictEqual(attributes[attribute], 'null');
    });

    test('sync model with text-input-value', function () {
        var attribute = 'text-input-value', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val('A').trigger('change');
        strictEqual(attributes[attribute], 'A');

        $el.val('B').trigger('change');
        strictEqual(attributes[attribute], 'B');

        $el.val('').trigger('change');
        strictEqual(attributes[attribute], '');
    });

    test('sync model with textarea-value', function () {
        var attribute = 'textarea-value', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val('A').trigger('change');
        strictEqual(attributes[attribute], 'A');

        $el.val('B').trigger('change');
        strictEqual(attributes[attribute], 'B');

        $el.val('').trigger('change');
        strictEqual(attributes[attribute], '');
    });

    test('sync model with single-select-value', function () {
        var attribute = 'single-select-value', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val('A').trigger('change');
        strictEqual(attributes[attribute], 'A');

        $el.val('B').trigger('change');
        strictEqual(attributes[attribute], 'B');

        $el.val('').trigger('change');
        strictEqual(attributes[attribute], null);

        $el.val(null).trigger('change');
        strictEqual(attributes[attribute], null);
    });

    test('sync model with multiple-select-value', function () {
        var attribute = 'multiple-select-value', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val(['A']).trigger('change');
        deepEqual(attributes[attribute], ['A']);

        $el.val(['B']).trigger('change');
        deepEqual(attributes[attribute], ['B']);

        $el.val(['A', 'B']).trigger('change');
        deepEqual(attributes[attribute], ['A', 'B']);

        $el.val([]).trigger('change');
        deepEqual(attributes[attribute], null);
    });

    test('sync model with radio-input-checked', function () {
        var attribute = 'radio-input-checked', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.filter('[value="A"]').prop('checked', true).trigger('change');
        strictEqual(attributes[attribute], 'A');

        $el.filter('[value="B"]').prop('checked', true).trigger('change');
        strictEqual(attributes[attribute], 'B');

        $el.prop('checked', false).trigger('change');
        strictEqual(attributes[attribute], undefined);
    });

    test('sync model with single-checkbox-input-checked', function () {
        var attribute = 'single-checkbox-input-checked', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.prop('checked', true).trigger('change');
        strictEqual(attributes[attribute], true);

        $el.prop('checked', false).trigger('change');
        strictEqual(attributes[attribute], false);
    });

    test('sync model with multiple-checkbox-input-checked', function () {
        var attribute = 'multiple-checkbox-input-checked', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.prop('checked', false).filter('[value="A"]').prop('checked', true).trigger('change');
        deepEqual(attributes[attribute], ['A']);

        $el.prop('checked', false).filter('[value="B"]').prop('checked', true).trigger('change');
        deepEqual(attributes[attribute], ['B']);

        $el.prop('checked', true).trigger('change');
        deepEqual(attributes[attribute], ['A', 'B']);

        $el.prop('checked', false).trigger('change');
        deepEqual(attributes[attribute], []);
    });

    test('sync model with button-visible', function () {
        var attribute = 'button-visible', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.prop('hidden', false).trigger('change');
        strictEqual(attributes[attribute], true);

        $el.prop('hidden', true).trigger('change');
        strictEqual(attributes[attribute], false);
    });

    test('sync model with button-hidden', function () {
        var attribute = 'button-hidden', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.prop('hidden', true).trigger('change');
        strictEqual(attributes[attribute], true);

        $el.prop('hidden', false).trigger('change');
        strictEqual(attributes[attribute], false);
    });

    test('sync model with button-enabled', function () {
        var attribute = 'button-enabled', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.prop('disabled', false).trigger('change');
        strictEqual(attributes[attribute], true);

        $el.prop('disabled', true).trigger('change');
        strictEqual(attributes[attribute], false);
    });

    test('sync model with button-disabled', function () {
        var attribute = 'button-disabled', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.prop('disabled', true).trigger('change');
        strictEqual(attributes[attribute], true);

        $el.prop('disabled', false).trigger('change');
        strictEqual(attributes[attribute], false);
    });
});
