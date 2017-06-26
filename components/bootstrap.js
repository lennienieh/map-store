define([
    'angular',
    'lib/require/domReady.min',
    'app'
], function (angular, domReady) {
    'use strict';
    domReady(function () {
        angular.bootstrap(document, ['MyApp']);
    });
});
