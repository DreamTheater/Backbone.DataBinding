module.exports = function (config) {
    'use strict';

    config.set({
        frameworks: ['qunit'],

        files: [
            // Libraries
            { pattern: 'lib/jquery/jquery.js' },
            { pattern: 'lib/underscore/underscore.js' },
            { pattern: 'lib/backbone/backbone.js' },

            // Sources
            { pattern: 'src/backbone/model_binder.js' },
            { pattern: 'src/backbone/collection_binder.js' },

            // Fixtures
            { pattern: 'test/index.html', included: false },
            { pattern: 'test/fixture_loader.js' },

            // Tests
            { pattern: 'test/backbone/model_binder_test.js' },
            { pattern: 'test/backbone/collection_binder_test.js' }
        ],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'html',
            dir: 'coverage_reports'
        },

        browsers: ['Firefox'],

        reportSlowerThan: 100
    });
};
