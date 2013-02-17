/*jshint maxstatements:16 */
$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var View = Backbone.View.extend({
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

            this.userProfile = new View({
                el: '#userProfile',
                model: this.user
            });
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('read from text input', function () {
        var elements = this.userProfile.$('[name="email"]');

        elements.val('vdudnyk@gmail.com').trigger('change');
        strictEqual(this.user.get('email'), 'vdudnyk@gmail.com');
    });

    test('read from one checkbox', function () {
        var elements = this.userProfile.$('[name="activated"]');

        elements.prop('checked', false).trigger('change');
        strictEqual(this.user.get('activated'), false);
    });

    test('read from multiple checkboxes', function () {
        ok(true);
    });

    test('read from radio', function () {
        var elements = this.userProfile.$('[name="gender"][value="FEMALE"]');

        elements.prop('checked', true).trigger('change');
        strictEqual(this.user.get('gender'), 'FEMALE');
    });

    test('read from single select', function () {
        var elements = this.userProfile.$('[name="status"]');

        elements.val('MARRIED').trigger('change');
        strictEqual(this.user.get('status'), 'MARRIED');
    });

    test('read from multiple select', function () {
        var elements = this.userProfile.$('[name="interests"]');

        elements.val(['BOOKS', 'SPORT']).trigger('change');
        deepEqual(this.user.get('interests'), ['BOOKS', 'SPORT']);
    });

    test('read from textarea', function () {
        var elements = this.userProfile.$('[name="notes"]');

        elements.val('I hate CoffeeScript!').trigger('change');
        strictEqual(this.user.get('notes'), 'I hate CoffeeScript!');
    });

    test('write to text input', function () {
        var elements = this.userProfile.$('[name="email"]');

        this.user.set('email', 'vdudnyk@gmail.com');
        strictEqual(elements.val(), 'vdudnyk@gmail.com');
    });

    test('write to one checkbox', function () {
        var elements = this.userProfile.$('[name="activated"]');

        this.user.set('activated', false);
        strictEqual(elements.prop('checked'), false);
    });

    test('write to multiple checkboxes', function () {
        ok(true);
    });

    test('write to radio', function () {
        var elements = this.userProfile.$('[name="gender"][value="FEMALE"]');

        this.user.set('gender', 'FEMALE');
        strictEqual(elements.prop('checked'), true);
    });

    test('write to single select', function () {
        var elements = this.userProfile.$('[name="status"]');

        this.user.set('status', 'MARRIED');
        strictEqual(elements.val(), 'MARRIED');
    });

    test('write to multiple select', function () {
        var elements = this.userProfile.$('[name="interests"]');

        this.user.set('interests', ['BOOKS', 'SPORT']);
        deepEqual(elements.val(), ['BOOKS', 'SPORT']);
    });

    test('write to textarea', function () {
        var elements = this.userProfile.$('[name="notes"]');

        this.user.set('notes', 'I hate CoffeeScript!');
        strictEqual(elements.val(), 'I hate CoffeeScript!');
    });
});
