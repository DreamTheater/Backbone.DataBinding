/*jshint maxstatements:16 */
$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var Profile = Backbone.View.extend({
        initialize: function () {
            this.binding('change', '[name="email"]', 'value:email', { validate: true });
            this.binding('change', '[name="activated"]', 'checked:activated');
            this.binding('change', '[name="gender"]', 'checked:gender');
            this.binding('change', '[name="status"]', 'value:status');
            this.binding('change', '[name="interests"]', 'value:interests');
            this.binding('change', '[name="notes"]', 'value:notes');
        }
    });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.DataBinding', {
        setup: function () {
            this.user = new Backbone.Model({
                email: 'dnemoga@gmail.com',
                activated: true,
                gender: 'MALE',
                status: 'SINGLE',
                interests: ['MOVIES', 'MUSIC'],
                notes: 'I like JavaScript!'
            });

            this.profile = new Profile({
                el: '#profile',
                model: this.user
            });
        },

        teardown: function () {
            this.profile.undelegateBindings();
            this.profile.stopListening();
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('sync model with text input', function () {
        var elements = this.profile.$('[name="email"]');

        elements.val('vdudnyk@gmail.com').trigger('change');
        strictEqual(this.user.get('email'), 'vdudnyk@gmail.com');
    });

    test('sync model with one checkbox', function () {
        var elements = this.profile.$('[name="activated"]');

        elements.prop('checked', false).trigger('change');
        strictEqual(this.user.get('activated'), false);
    });

    test('sync model with multiple checkboxes', function () {
        ok(true);
    });

    test('sync model with radio', function () {
        var elements = this.profile.$('[name="gender"][value="FEMALE"]');

        elements.prop('checked', true).trigger('change');
        strictEqual(this.user.get('gender'), 'FEMALE');
    });

    test('sync model with single select', function () {
        var elements = this.profile.$('[name="status"]');

        elements.val('MARRIED').trigger('change');
        strictEqual(this.user.get('status'), 'MARRIED');
    });

    test('sync model with multiple select', function () {
        var elements = this.profile.$('[name="interests"]');

        elements.val(['BOOKS', 'SPORT']).trigger('change');
        deepEqual(this.user.get('interests'), ['BOOKS', 'SPORT']);
    });

    test('sync model with textarea', function () {
        var elements = this.profile.$('[name="notes"]');

        elements.val('I hate CoffeeScript!').trigger('change');
        strictEqual(this.user.get('notes'), 'I hate CoffeeScript!');
    });

    test('sync text input with model', function () {
        var elements = this.profile.$('[name="email"]');

        this.user.set('email', 'vdudnyk@gmail.com');
        strictEqual(elements.val(), 'vdudnyk@gmail.com');
    });

    test('sync one checkbox with model', function () {
        var elements = this.profile.$('[name="activated"]');

        this.user.set('activated', false);
        strictEqual(elements.prop('checked'), false);
    });

    test('sync multiple checkboxes with model', function () {
        ok(true);
    });

    test('sync radio with model', function () {
        var elements = this.profile.$('[name="gender"][value="FEMALE"]');

        this.user.set('gender', 'FEMALE');
        strictEqual(elements.prop('checked'), true);
    });

    test('sync single select with model', function () {
        var elements = this.profile.$('[name="status"]');

        this.user.set('status', 'MARRIED');
        strictEqual(elements.val(), 'MARRIED');
    });

    test('sync multiple select with model', function () {
        var elements = this.profile.$('[name="interests"]');

        this.user.set('interests', ['BOOKS', 'SPORT']);
        deepEqual(elements.val(), ['BOOKS', 'SPORT']);
    });

    test('sync textarea with model', function () {
        var elements = this.profile.$('[name="notes"]');

        this.user.set('notes', 'I hate CoffeeScript!');
        strictEqual(elements.val(), 'I hate CoffeeScript!');
    });
});
