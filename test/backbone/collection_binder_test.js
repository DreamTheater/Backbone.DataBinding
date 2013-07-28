$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var View = Backbone.View.extend({
        el: '#test-list',

        initialize: function () {
            var collectionBinder = new Backbone.CollectionBinder(this, this.collection, {
                view: Backbone.View.extend({
                    tagName: 'li',

                    render: function () {
                        this.$el.text(this.model.id);

                        return this;
                    }
                }),

                dummy: Backbone.View.extend({
                    tagName: 'li',

                    render: function () {
                        this.$el.text('I\'m a dummy!');

                        return this;
                    }
                }),

                selector: function (model) {
                    return model ? (model.id % 2 ? '#even-id' : '#odd-id') : null;
                }
            });

            this.collectionBinder = collectionBinder.listen();
        }
    });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.CollectionBinder', {
        setup: function () {
            this.view = new View({
                collection: this.collection = new Backbone.Collection([
                    { id: 0 },
                    { id: 1 },
                    { id: 2 },
                    { id: 3 },
                    { id: 4 },
                    { id: 5 },
                    { id: 6 },
                    { id: 7 },
                    { id: 8 },
                    { id: 9 }
                ], {
                    comparator: 'id'
                })
            });
        },

        teardown: function () {
            this.view.collectionBinder.removeViews();
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('add', function () {
        ok(true);
    });

//    test('remove', function () {
//        ok(true);
//    });
//
//    test('reset', function () {
//        ok(true);
//    });
//
//    test('sort', function () {
//        ok(true);
//    });
});
