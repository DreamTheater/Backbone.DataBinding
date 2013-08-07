$(function () {
    'use strict';

    QUnit.stop();

    $.get('base/test/index.html', function (html) {
        $(html).children().appendTo(document.body);

        QUnit.start();
    });
});
