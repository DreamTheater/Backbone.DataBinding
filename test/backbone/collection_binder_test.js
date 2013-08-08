/*jshint maxstatements:13, maxlen:109 */
$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var View = Backbone.View.extend({
        el: '#list-fixture',

        initialize: function () {
            var collectionBinder = this.collectionBinder = Backbone.CollectionBinder(this, this.collection, {
                view: Backbone.View.extend({
                    tagName: 'li',

                    render: function () {
                        var model = this.model;

                        this.$el.text(model.cid).data('model', model);

                        return this;
                    }
                }),

                dummy: Backbone.View.extend({
                    render: function () {
                        this.$el.text('I\'m a dummy!').data('view', this);

                        return this;
                    }
                }),

                selector: function (model) {
                    return model ? (model.id % 2 === 0 ? '.odd' : '.even') : null;
                }
            });

            collectionBinder.listen();
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
            this.view.$('.odd, .even').empty();
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('initialize with models', function () {
        var collection = this.collection, view = this.view,
            $oddIdList = view.$('.odd'), $evenIdList = view.$('.even');

        deepEqual($oddIdList.children().map(function () {
            return $(this).data('model');
        }).get(), collection.filter(function (model) {
            return model.id % 2 === 0;
        }));

        deepEqual($evenIdList.children().map(function () {
            return $(this).data('model');
        }).get(), collection.filter(function (model) {
            return model.id % 2 === 1;
        }));
    });

    test('add model', function () {
        var collection = this.collection, view = this.view,
            $oddIdList = view.$('.odd'), $evenIdList = view.$('.even');

        collection.add({ id: 10 });
        strictEqual($oddIdList.children().last().data('model'), collection.get(10));

        collection.add({ id: 11 });
        strictEqual($evenIdList.children().last().data('model'), collection.get(11));
    });

    test('remove model', function () {
        var collection = this.collection, view = this.view,
            $oddIdList = view.$('.odd'), $evenIdList = view.$('.even');

        collection.remove({ id: 8 });
        strictEqual($oddIdList.children().last().data('model'), collection.get(6));

        collection.remove({ id: 9 });
        strictEqual($evenIdList.children().last().data('model'), collection.get(7));
    });

    test('reset models', function () {
        var collection = this.collection, view = this.view,
            $oddIdList = view.$('.odd'), $evenIdList = view.$('.even');

        collection.reset([
            { id: 10 },
            { id: 11 }
        ]);

        strictEqual($oddIdList.children().length, 1);
        strictEqual($evenIdList.children().length, 1);

        strictEqual($oddIdList.children().first().data('model'), collection.get(10));
        strictEqual($evenIdList.children().first().data('model'), collection.get(11));
    });

    test('sort models', function () {
        var collection = this.collection, view = this.view,
            $oddIdList = view.$('.odd'), $evenIdList = view.$('.even');

        collection.add({ id: -1 });
        strictEqual($evenIdList.children().first().data('model'), collection.get(-1));

        collection.add({ id: -2 });
        strictEqual($oddIdList.children().first().data('model'), collection.get(-2));
    });

    test('dummy', function () {
        var collection = this.collection, view = this.view, collectionBinder = view.collectionBinder;

        collection.reset();
        ok(view.$el.children().last().data('view'));
        ok(_.has(collectionBinder, 'dummy'));

        collection.add({ id: 0 });
        ok(!view.$el.children().last().data('view'));
        ok(_.has(collectionBinder, 'dummy'));

        collection.remove({ id: 0 });
        ok(view.$el.children().last().data('view'));
        ok(_.has(collectionBinder, 'dummy'));

        collection.reset({ id: 0 });
        ok(!view.$el.children().last().data('view'));
        ok(!_.has(collectionBinder, 'dummy'));
    });
});
