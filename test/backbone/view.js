$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var View = Backbone.View.extend({
        initialize: function () {
            this.addBinding('change', '[name="email"]', 'value:email', { validate: true });
            this.addBinding('change', '[name="activated"]', 'checked:activated');
            this.addBinding('change', '[name="gender"]', 'checked:gender');
            this.addBinding('change', '[name="status"]', 'value:status');
            this.addBinding('change', '[name="interests"]', 'checked:interests');
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
                interests: ['MOVIE', 'MUSIC']
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
