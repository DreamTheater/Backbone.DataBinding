files = [
    QUNIT,
    QUNIT_ADAPTER,

    { pattern: 'lib/jquery/jquery.js' },
    { pattern: 'lib/underscore/underscore.js' },
    { pattern: 'lib/backbone/backbone.js' },

    { pattern: 'src/backbone/model_binder.js' },
    { pattern: 'src/backbone/collection_binder.js' },

    { pattern: 'test/index.html', included: false },

    { pattern: 'test/backbone/model_binder_test.js' },
    { pattern: 'test/backbone/collection_binder_test.js' }
];

preprocessors = {
    'src/**/*.js': 'coverage'
};

reporters = ['progress', 'coverage'];

coverageReporter = {
    type: 'text',
    dir: 'log'
};

browsers = ['Firefox'];

singleRun = true;
