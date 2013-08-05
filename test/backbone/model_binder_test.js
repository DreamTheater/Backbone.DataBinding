/*jshint maxstatements:28, maxlen:117 */
$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var View = Backbone.View.extend({
        el: '#form-fixture',

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

        model.set(attribute, 'string');
        strictEqual($el.html(), 'string');

        model.set(attribute, '');
        strictEqual($el.html(), '');

        model.set(attribute, 1);
        strictEqual($el.html(), '1');

        model.set(attribute, 0);
        strictEqual($el.html(), '0');

        model.set(attribute, true);
        strictEqual($el.html(), 'true');

        model.set(attribute, false);
        strictEqual($el.html(), 'false');

        model.set(attribute, null);
        strictEqual($el.html(), '');

        model.set(attribute, undefined);
        strictEqual($el.html(), '');

        model.unset(attribute);
        strictEqual($el.html(), '');
    });

    test('sync output-text with model', function () {
        var attribute = 'output-text', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        strictEqual($el.text(), 'string');

        model.set(attribute, '');
        strictEqual($el.text(), '');

        model.set(attribute, 1);
        strictEqual($el.text(), '1');

        model.set(attribute, 0);
        strictEqual($el.text(), '0');

        model.set(attribute, true);
        strictEqual($el.text(), 'true');

        model.set(attribute, false);
        strictEqual($el.text(), 'false');

        model.set(attribute, null);
        strictEqual($el.text(), '');

        model.set(attribute, undefined);
        strictEqual($el.text(), '');

        model.unset(attribute);
        strictEqual($el.text(), '');
    });

    test('sync text-input-value with model', function () {
        var attribute = 'text-input-value', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        strictEqual($el.val(), 'string');

        model.set(attribute, '');
        strictEqual($el.val(), '');

        model.set(attribute, 1);
        strictEqual($el.val(), '1');

        model.set(attribute, 0);
        strictEqual($el.val(), '0');

        model.set(attribute, true);
        strictEqual($el.val(), 'true');

        model.set(attribute, false);
        strictEqual($el.val(), 'false');

        model.set(attribute, null);
        strictEqual($el.val(), '');

        model.set(attribute, undefined);
        strictEqual($el.val(), '');

        model.unset(attribute);
        strictEqual($el.val(), '');
    });

    test('sync textarea-value with model', function () {
        var attribute = 'textarea-value', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        strictEqual($el.val(), 'string');

        model.set(attribute, '');
        strictEqual($el.val(), '');

        model.set(attribute, 1);
        strictEqual($el.val(), '1');

        model.set(attribute, 0);
        strictEqual($el.val(), '0');

        model.set(attribute, true);
        strictEqual($el.val(), 'true');

        model.set(attribute, false);
        strictEqual($el.val(), 'false');

        model.set(attribute, null);
        strictEqual($el.val(), '');

        model.set(attribute, undefined);
        strictEqual($el.val(), '');

        model.unset(attribute);
        strictEqual($el.val(), '');
    });

    test('sync single-select-value with model', function () {
        var attribute = 'single-select-value', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        strictEqual($el.val(), 'string');

        model.set(attribute, '');
        strictEqual($el.val(), '');

        model.set(attribute, 1);
        strictEqual($el.val(), '1');

        model.set(attribute, 0);
        strictEqual($el.val(), '0');

        model.set(attribute, true);
        strictEqual($el.val(), 'true');

        model.set(attribute, false);
        strictEqual($el.val(), 'false');

        model.set(attribute, null);
        strictEqual($el.val(), null);

        model.set(attribute, undefined);
        strictEqual($el.val(), null);

        model.unset(attribute);
        strictEqual($el.val(), null);
    });

    test('sync multiple-select-value with model', function () {
        var attribute = 'multiple-select-value', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, ['string', 1, true]);
        deepEqual($el.val(), ['string', '1', 'true']);

        model.set(attribute, ['', 0, false]);
        deepEqual($el.val(), ['', '0', 'false']);

        model.set(attribute, [null]);
        deepEqual($el.val(), null);

        model.set(attribute, [undefined]);
        deepEqual($el.val(), null);

        model.set(attribute, []);
        deepEqual($el.val(), null);

        model.set(attribute, null);
        deepEqual($el.val(), null);

        model.set(attribute, undefined);
        deepEqual($el.val(), null);

        model.unset(attribute);
        deepEqual($el.val(), null);
    });

    test('sync radio-input-checked with model', function () {
        var attribute = 'radio-input-checked', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        strictEqual($el.filter(':checked').val(), 'string');

        model.set(attribute, '');
        strictEqual($el.filter(':checked').val(), '');

        model.set(attribute, 1);
        strictEqual($el.filter(':checked').val(), '1');

        model.set(attribute, 0);
        strictEqual($el.filter(':checked').val(), '0');

        model.set(attribute, true);
        strictEqual($el.filter(':checked').val(), 'true');

        model.set(attribute, false);
        strictEqual($el.filter(':checked').val(), 'false');

        model.set(attribute, null);
        strictEqual($el.filter(':checked').val(), undefined);

        model.set(attribute, undefined);
        strictEqual($el.filter(':checked').val(), undefined);

        model.unset(attribute);
        strictEqual($el.filter(':checked').val(), undefined);
    });

    test('sync single-checkbox-input-checked with model', function () {
        var attribute = 'single-checkbox-input-checked', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        ok($el.is(':checked'));

        model.set(attribute, '');
        ok(!$el.is(':checked'));

        model.set(attribute, 1);
        ok($el.is(':checked'));

        model.set(attribute, 0);
        ok(!$el.is(':checked'));

        model.set(attribute, true);
        ok($el.is(':checked'));

        model.set(attribute, false);
        ok(!$el.is(':checked'));

        model.set(attribute, null);
        ok(!$el.is(':checked'));

        model.set(attribute, undefined);
        ok(!$el.is(':checked'));

        model.unset(attribute);
        ok(!$el.is(':checked'));
    });

    test('sync multiple-checkbox-input-checked with model', function () {
        var attribute = 'multiple-checkbox-input-checked', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, ['string', 1, true]);
        deepEqual(_.pluck($el.filter(':checked'), 'value'), ['string', '1', 'true']);

        model.set(attribute, ['', 0, false]);
        deepEqual(_.pluck($el.filter(':checked'), 'value'), ['', '0', 'false']);

        model.set(attribute, [null]);
        deepEqual(_.pluck($el.filter(':checked'), 'value'), []);

        model.set(attribute, [undefined]);
        deepEqual(_.pluck($el.filter(':checked'), 'value'), []);

        model.set(attribute, []);
        deepEqual(_.pluck($el.filter(':checked'), 'value'), []);

        model.set(attribute, null);
        deepEqual(_.pluck($el.filter(':checked'), 'value'), []);

        model.set(attribute, undefined);
        deepEqual(_.pluck($el.filter(':checked'), 'value'), []);

        model.unset(attribute);
        deepEqual(_.pluck($el.filter(':checked'), 'value'), []);
    });

    test('sync button-visible with model', function () {
        var attribute = 'button-visible', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        ok($el.is(':visible'));

        model.set(attribute, '');
        ok(!$el.is(':visible'));

        model.set(attribute, 1);
        ok($el.is(':visible'));

        model.set(attribute, 0);
        ok(!$el.is(':visible'));

        model.set(attribute, true);
        ok($el.is(':visible'));

        model.set(attribute, false);
        ok(!$el.is(':visible'));

        model.set(attribute, null);
        ok(!$el.is(':visible'));

        model.set(attribute, undefined);
        ok(!$el.is(':visible'));

        model.unset(attribute);
        ok(!$el.is(':visible'));
    });

    test('sync button-hidden with model', function () {
        var attribute = 'button-hidden', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        ok($el.is(':hidden'));

        model.set(attribute, '');
        ok(!$el.is(':hidden'));

        model.set(attribute, 1);
        ok($el.is(':hidden'));

        model.set(attribute, 0);
        ok(!$el.is(':hidden'));

        model.set(attribute, true);
        ok($el.is(':hidden'));

        model.set(attribute, false);
        ok(!$el.is(':hidden'));

        model.set(attribute, null);
        ok(!$el.is(':hidden'));

        model.set(attribute, undefined);
        ok(!$el.is(':hidden'));

        model.unset(attribute);
        ok(!$el.is(':hidden'));
    });

    test('sync button-enabled with model', function () {
        var attribute = 'button-enabled', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        ok($el.is(':enabled'));

        model.set(attribute, '');
        ok(!$el.is(':enabled'));

        model.set(attribute, 1);
        ok($el.is(':enabled'));

        model.set(attribute, 0);
        ok(!$el.is(':enabled'));

        model.set(attribute, true);
        ok($el.is(':enabled'));

        model.set(attribute, false);
        ok(!$el.is(':enabled'));

        model.set(attribute, null);
        ok(!$el.is(':enabled'));

        model.set(attribute, undefined);
        ok(!$el.is(':enabled'));

        model.unset(attribute);
        ok(!$el.is(':enabled'));
    });

    test('sync button-disabled with model', function () {
        var attribute = 'button-disabled', model = this.model,
            $el = this.view.$('[name="' + attribute + '"]');

        model.set(attribute, 'string');
        ok($el.is(':disabled'));

        model.set(attribute, '');
        ok(!$el.is(':disabled'));

        model.set(attribute, 1);
        ok($el.is(':disabled'));

        model.set(attribute, 0);
        ok(!$el.is(':disabled'));

        model.set(attribute, true);
        ok($el.is(':disabled'));

        model.set(attribute, false);
        ok(!$el.is(':disabled'));

        model.set(attribute, null);
        ok(!$el.is(':disabled'));

        model.set(attribute, undefined);
        ok(!$el.is(':disabled'));

        model.unset(attribute);
        ok(!$el.is(':disabled'));
    });

    test('sync model with output-html', function () {
        var attribute = 'output-html', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.html('string').trigger('change');
        strictEqual(attributes[attribute], 'string');

        $el.html('').trigger('change');
        strictEqual(attributes[attribute], '');

        $el.html('1').trigger('change');
        strictEqual(attributes[attribute], '1');

        $el.html('0').trigger('change');
        strictEqual(attributes[attribute], '0');

        $el.html('true').trigger('change');
        strictEqual(attributes[attribute], 'true');

        $el.html('false').trigger('change');
        strictEqual(attributes[attribute], 'false');

        $el.empty().trigger('change');
        strictEqual(attributes[attribute], '');
    });

    test('sync model with output-text', function () {
        var attribute = 'output-text', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.text('string').trigger('change');
        strictEqual(attributes[attribute], 'string');

        $el.text('').trigger('change');
        strictEqual(attributes[attribute], '');

        $el.text('1').trigger('change');
        strictEqual(attributes[attribute], '1');

        $el.text('0').trigger('change');
        strictEqual(attributes[attribute], '0');

        $el.text('true').trigger('change');
        strictEqual(attributes[attribute], 'true');

        $el.text('false').trigger('change');
        strictEqual(attributes[attribute], 'false');

        $el.empty().trigger('change');
        strictEqual(attributes[attribute], '');
    });

    test('sync model with text-input-value', function () {
        var attribute = 'text-input-value', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val('string').trigger('change');
        strictEqual(attributes[attribute], 'string');

        $el.val('').trigger('change');
        strictEqual(attributes[attribute], '');

        $el.val('1').trigger('change');
        strictEqual(attributes[attribute], '1');

        $el.val('0').trigger('change');
        strictEqual(attributes[attribute], '0');

        $el.val('true').trigger('change');
        strictEqual(attributes[attribute], 'true');

        $el.val('false').trigger('change');
        strictEqual(attributes[attribute], 'false');

        $el.val(null).trigger('change');
        strictEqual(attributes[attribute], '');
    });

    test('sync model with textarea-value', function () {
        var attribute = 'textarea-value', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val('string').trigger('change');
        strictEqual(attributes[attribute], 'string');

        $el.val('').trigger('change');
        strictEqual(attributes[attribute], '');

        $el.val('1').trigger('change');
        strictEqual(attributes[attribute], '1');

        $el.val('0').trigger('change');
        strictEqual(attributes[attribute], '0');

        $el.val('true').trigger('change');
        strictEqual(attributes[attribute], 'true');

        $el.val('false').trigger('change');
        strictEqual(attributes[attribute], 'false');

        $el.val(null).trigger('change');
        strictEqual(attributes[attribute], '');
    });

    test('sync model with single-select-value', function () {
        var attribute = 'single-select-value', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val('string').trigger('change');
        strictEqual(attributes[attribute], 'string');

        $el.val('').trigger('change');
        strictEqual(attributes[attribute], '');

        $el.val('1').trigger('change');
        strictEqual(attributes[attribute], '1');

        $el.val('0').trigger('change');
        strictEqual(attributes[attribute], '0');

        $el.val('true').trigger('change');
        strictEqual(attributes[attribute], 'true');

        $el.val('false').trigger('change');
        strictEqual(attributes[attribute], 'false');

        $el.val(null).trigger('change');
        strictEqual(attributes[attribute], '');
    });

    test('sync model with multiple-select-value', function () {
        var attribute = 'multiple-select-value', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val(['string', '1', 'true']).trigger('change');
        deepEqual(attributes[attribute], ['string', '1', 'true']);

        $el.val(['', '0', 'false']).trigger('change');
        deepEqual(attributes[attribute], ['', '0', 'false']);

        $el.val([]).trigger('change');
        deepEqual(attributes[attribute], []);
    });

    test('sync model with radio-input-checked', function () {
        var attribute = 'radio-input-checked', attributes = this.model.attributes,
            $el = this.view.$('[name="' + attribute + '"]');

        $el.val(['string']).trigger('change');
        strictEqual(attributes[attribute], 'string');

        $el.val(['']).trigger('change');
        strictEqual(attributes[attribute], '');

        $el.val(['1']).trigger('change');
        strictEqual(attributes[attribute], '1');

        $el.val(['0']).trigger('change');
        strictEqual(attributes[attribute], '0');

        $el.val(['true']).trigger('change');
        strictEqual(attributes[attribute], 'true');

        $el.val(['false']).trigger('change');
        strictEqual(attributes[attribute], 'false');

        $el.val([]).trigger('change');
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

        $el.val(['string', '1', 'true']).trigger('change');
        deepEqual(attributes[attribute], ['string', '1', 'true']);

        $el.val(['', '0', 'false']).trigger('change');
        deepEqual(attributes[attribute], ['', '0', 'false']);

        $el.val([]).trigger('change');
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
