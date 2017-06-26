// fis3: define()

require.config({
    paths: {
        angular: 'lib/angular/angular.min',
        angularRoute: 'lib/angular/angular-route.min',
        ngFileUpload: 'lib/ng-file-upload/ng-file-upload',
        jquery: 'lib/jquery/jquery.min',
        layer: 'lib/layer/layer.min',
        twitterBootstrap: 'lib/bootstrap/bootstrap.min',
        baiduMap:'lib/baiduMap/angular-baidu-map.min',
        swiper: 'lib/swiper/js/swiper.min',
        angularSwiper: 'lib/swiper/angular-swiper',
        mobiscroll: 'lib/mobiscroll/mobiscroll.custom-3.0.0-beta2.min'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        baiduMap:['angular'],
        angularRoute: ['angular'],
        ngFileUpload: ['angular'],
        layer: {
            deps: ['jquery'],
            exports: 'layer'
        },
        twitterBootstrap: ['jquery'],
        angularSwiper:['angular','swiper'],
        mobiscroll:['angular','jquery']
    }
});

require(['layer'], function(layer) {
    layer.config({
        path: '/lib/layer/', //layer.js所在的目录，可以是绝对目录，也可以是相对目录
        extend: 'extend/layer.ext.js'
    });
});
require(['bootstrap']);
