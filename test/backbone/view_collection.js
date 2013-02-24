$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var Item = Backbone.ViewModel.extend({
            tagName: 'li',

            render: function () {
                this.$el.text(this.cid);

                return this;
            }
        }),

        List = Backbone.ViewCollection.extend({
            el: '#list',
            view: Item
        });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.ViewCollection', {
        setup: function () {
            this.items = new Backbone.Collection([
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
                comparator: function (model) {
                    return model.id;
                }
            });

            this.list = new List({
                collection: this.items
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
