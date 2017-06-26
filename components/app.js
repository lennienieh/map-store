define([
  'angular',
  'angularRoute',
  'twitterBootstrap',
  'ngFileUpload',
  'mobiscroll',
  'baiduMap',
  'angularSwiper',
  'common/route',
  'common/api',
  'constants/_base',
  'ctrls/_base',
  'directives/_base',
  'filters/_base',
  'services/_base'
  // 'mobileSort'
], function (angular) {
  'use strict';
  return angular.module('MyApp', ['ngRoute', 'ngFileUpload', 'angular-baidu-map', 'ksSwiper', 'app.route', 'app.api', 'app.constants', 'app.ctrls', 'app.directives', 'app.filters', 'app.services'])

    .config(['$httpProvider', '$routeProvider', '$locationProvider', function ($httpProvider, $routeProvider, $locationProvider) {
      // 设置Http拦截器
      // $httpProvider.interceptors.push('HttpInjector');
      $locationProvider.html5Mode(true);
    }])

    // 'AuthService', 'HideHeaderUrl', 'DocTitle',
    .run(['$rootScope', '$location', '$timeout', function ($rootScope, $location, $timeout) {
      // 路由改变监听
      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        console.log(next);
        console.log(current);

        // 判断权限是否跳转
        // AuthService.doAuth(next, current).then(function () {
        //     // 通过
        //     // $location.path(next.$$route.originalPath);
        // }, function () {
        //     // 不通过
        //     console.log(layer);
        //     event.preventDefault(); // 取消默认跳转行为
        //     layer.msg('请先登录或注册!');
        //     $location.path('/home');
        //     // 将当前请求保存到$rootScope上
        //     $rootScope.savedRequest = current;
        // });

        var viewPath = next.$$route.originalPath;
        // 设置当前path
        $rootScope.path = viewPath;
        console.log('viewPath:', viewPath);




        // 设置title
        // $rootScope.docTitle = DocTitle[viewPath] && DocTitle[viewPath].title || '金蛛金服';

        // 是否显示头部
        // var isShowHeaderFn = function () {
        //     for (var i = 0; i < HideHeaderUrl.length; i++) {
        //         var url = HideHeaderUrl[i];
        //         if ($rootScope.path.indexOf(url) != -1) {
        //             return false;
        //         }
        //     }
        //     return true;
        // };
        //
        // $rootScope.isShowHeader = isShowHeaderFn();
      });

      $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
        // 当视图加载完成时, 页面滚动至顶部
        $(window).scrollTop(0);
      });
    }]);
});
