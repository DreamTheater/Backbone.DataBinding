/*jshint maxstatements:16 */
$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var Profile = Backbone.ViewModel.extend({
        el: '#profile',

        initialize: function () {
            this.binding('[name="email"]', 'value:email', 'change', { validate: true });
            this.binding('[name="gender"]', 'checked:gender', 'change');
            this.binding('[name="status"]', 'value:status', 'change');
            this.binding('[name="hasChildren"]', 'checked:hasChildren', 'change');
            this.binding('[name="favoriteDaysOfWeek[]"]', 'value:favoriteDaysOfWeek', 'change');
            this.binding('[name="favoriteColors[]"]', 'checked:favoriteColors', 'change');
            this.binding('[name="notes"]', 'value:notes', 'change');
        }
    });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.ViewModel', {
        setup: function () {
            this.user = new Backbone.Model({
                email: 'dnemoga@gmail.com',
                gender: 'MALE',
                status: 'SINGLE',
                hasChildren: false,
                favoriteDaysOfWeek: ['FRIDAY', 'SATURDAY'],
                favoriteColors: ['RED', 'BLUE', 'VIOLET'],
                notes: 'I like JavaScript!'
            });

            this.profile = new Profile({
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

    test('sync model with radio', function () {
        var elements = this.profile.$('[name="gender"]'),
            matchedElements = elements.filter('[value="FEMALE"]');

        matchedElements.prop('checked', true).trigger('change');
        strictEqual(this.user.get('gender'), 'FEMALE');
    });

    test('sync model with single select', function () {
        var elements = this.profile.$('[name="status"]');

        elements.val('MARRIED').trigger('change');
        strictEqual(this.user.get('status'), 'MARRIED');
    });

    test('sync model with one checkbox', function () {
        var elements = this.profile.$('[name="hasChildren"]');

        elements.prop('checked', true).trigger('change');
        strictEqual(this.user.get('hasChildren'), true);
    });

    test('sync model with multiple select', function () {
        var elements = this.profile.$('[name="favoriteDaysOfWeek[]"]');

        elements.val(['SATURDAY', 'SUNDAY']).trigger('change');
        deepEqual(this.user.get('favoriteDaysOfWeek'), ['SATURDAY', 'SUNDAY']);
    });

    test('sync model with multiple checkboxes', function () {
        var elements = this.profile.$('[name="favoriteColors[]"]'),
            matchedElements = elements.filter('[value="YELLOW"], [value="INDIGO"]');

        elements.not(matchedElements).filter(':checked').prop('checked', false).trigger('change');
        matchedElements.not(':checked').prop('checked', true).trigger('change');
        deepEqual(this.user.get('favoriteColors'), ['YELLOW', 'INDIGO']);
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

    test('sync radio with model', function () {
        var elements = this.profile.$('[name="gender"]'),
            matchedElements = elements.filter('[value="FEMALE"]');

        this.user.set('gender', 'FEMALE');
        strictEqual(matchedElements.prop('checked'), true);
    });

    test('sync single select with model', function () {
        var elements = this.profile.$('[name="status"]');

        this.user.set('status', 'MARRIED');
        strictEqual(elements.val(), 'MARRIED');
    });

    test('sync one checkbox with model', function () {
        var elements = this.profile.$('[name="hasChildren"]');

        this.user.set('hasChildren', true);
        strictEqual(elements.prop('checked'), true);
    });

    test('sync multiple select with model', function () {
        var elements = this.profile.$('[name="favoriteDaysOfWeek[]"]');

        this.user.set('favoriteDaysOfWeek', ['SATURDAY', 'SUNDAY']);
        deepEqual(elements.val(), ['SATURDAY', 'SUNDAY']);
    });

    test('sync multiple checkboxes with model', function () {
        var elements = this.profile.$('[name="favoriteColors[]"]'),
            matchedElements = elements.filter('[value="YELLOW"], [value="INDIGO"]');

        this.user.set('favoriteColors', ['YELLOW', 'INDIGO']);
        deepEqual(_.pluck(matchedElements.serializeArray(), 'value'), ['YELLOW', 'INDIGO']);
    });

    test('sync textarea with model', function () {
        var elements = this.profile.$('[name="notes"]');

        this.user.set('notes', 'I hate CoffeeScript!');
        strictEqual(elements.val(), 'I hate CoffeeScript!');
    });
});
