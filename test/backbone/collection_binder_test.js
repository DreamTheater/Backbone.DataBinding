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
                        var model = this.model;

                        this.$el.data('model', model).text(model.id);

                        return this;
                    }
                }),

                dummy: Backbone.View.extend({
                    render: function () {
                        this.$el.text('I\'m a dummy!');

                        return this;
                    }
                }),

                selector: function (model) {
                    return model ? (model.id % 2 === 0 ? '#odd-id' : '#even-id') : null;
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
            this.view.$('#odd-id, #even-id').empty();
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('initialize with models', function () {
        var oddIds = [], evenIds = [], view = this.view,
            oddIdList = view.$('#odd-id'), evenIdList = view.$('#even-id');

        oddIdList.children().each(function () {
            oddIds.push($(this).data('model').id);
        });

        evenIdList.children().each(function () {
            evenIds.push($(this).data('model').id);
        });

        deepEqual(oddIds, [0, 2, 4, 6, 8]);
        deepEqual(evenIds, [1, 3, 5, 7, 9]);
    });

    test('add', function () {
        var collection = this.collection, view = this.view,
            oddIdList = view.$('#odd-id'), evenIdList = view.$('#even-id');

        collection.add({ id: 10 });
        strictEqual(oddIdList.children().last().data('model').id, 10);

        collection.add({ id: 11 });
        strictEqual(evenIdList.children().last().data('model').id, 11);
    });

    test('remove', function () {
        var collection = this.collection, view = this.view,
            oddIdList = view.$('#odd-id'), evenIdList = view.$('#even-id');

        collection.remove({ id: 8 });
        strictEqual(oddIdList.children().last().data('model').id, 6);

        collection.remove({ id: 9 });
        strictEqual(evenIdList.children().last().data('model').id, 7);
    });

    test('reset', function () {
        var collection = this.collection, view = this.view,
            oddIdList = view.$('#odd-id'), evenIdList = view.$('#even-id');

        collection.reset([
            { id: 10 },
            { id: 11 }
        ]);

        strictEqual(oddIdList.children().length, 1);
        strictEqual(evenIdList.children().length, 1);

        strictEqual(oddIdList.children().first().data('model').id, 10);
        strictEqual(evenIdList.children().first().data('model').id, 11);
    });

    test('sort', function () {
        var collection = this.collection, view = this.view,
            oddIdList = view.$('#odd-id'), evenIdList = view.$('#even-id');

        collection.add({ id: -1 });
        strictEqual(evenIdList.children().first().data('model').id, -1);

        collection.add({ id: -2 });
        strictEqual(oddIdList.children().first().data('model').id, -2);
    });
});
