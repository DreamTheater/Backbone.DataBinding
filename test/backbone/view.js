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
            this.binding('change', '[name="interests"]', 'checked:interests');
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
                interests: ['MOVIE', 'MUSIC'],
                notes: 'I like JavaScript!'
            });

            this.userProfile = new View({
                el: '[name="userProfile"]',
                model: this.user
            });
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('test', function () {
        ok(true);
    });
});
