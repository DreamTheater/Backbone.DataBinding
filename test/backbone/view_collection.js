$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var ListItem = Backbone.ViewModel.extend({
            tagName: 'li',

            render: function () {
                this.$el.text(this.cid);

                return this;
            }
        }),

        List = Backbone.ViewCollection.extend({
            el: '#list',
            view: ListItem
        });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.ViewCollection', {
        setup: function () {
            this.itemList = new Backbone.Collection([
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
                { id: 7 },
                { id: 8 },
                { id: 9 },
                { id: 10 }
            ], {
                comparator: 'id'
            });

            this.list = new List({
                collection: this.itemList
            }).reset();
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('dummy', function () {
        ok(true);
    });
});
