define(['./mod'], function (mod) {
    'use strict';
    mod // ----------------------
    // Factory
    // ----------------------
    // Http拦截器 设置消息头为application/x-www-form-urlencoded;charset=UTF-8; 
    // 和 将原来的JSON提交改为表单提交
        .factory('HttpInjector', ['NoHttpInjectUrl', function (NoHttpInjectUrl) {
        // 是否拦截
        var isInject = function (config) {
            for (var i in NoHttpInjectUrl) {
                if (NoHttpInjectUrl[i] === config.url) {
                    return false;
                }
            }
            return true;
        };
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
        };
        // 请求拦截器
        var request = function (config) {
            if (isInject(config)) {
                config.headers = headers; // 设置消息头
                // 转换form请求, 将原来的JSON提交改为表单提交
                config.transformRequest = function (data) {
                    if (!data) return "";
                    return $.param(data);
                };
            }
            return config;
        };

        // 响应拦截器
        var response = function (responseObject) {
            return responseObject; // 必须返回responseObject
        };

        return {
            request: request,
            response: response
        };
    }]);
});
