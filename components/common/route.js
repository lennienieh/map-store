define(['angular'], function(angular) {
    'use strict';
    return angular.module('app.route', []).config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when("/foo", {
                templateUrl: "/templates/foo.html"
            }).when("/parkingMap", {
                templateUrl: "/templates/parkingMap.html",
                controller: 'parkingMapCtrl'
            }).when("/map-stores", {
                templateUrl: "/templates/storesMap.html",
                controller: 'storeMapCtrl'
            })
            // 默认路由-首页
            .otherwise({
                redirectTo: '/map-stores'
            });
    }]);
});
