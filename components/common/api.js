define(['angular'], function (angular) {
    'use strict';
    return angular.module('app.api', [])

    .factory('$$http', ['$http', '$q', function ($http, $q) {
        var errorMsg = '网络异常, 请稍后重试';
        this.post = function (url, param) {
            var defer = $q.defer();
            $http.post(url, param).success(function (data) {
                if (isRequestSuccess(data)) {
                    defer.resolve(data.data);
                } else {
                    defer.reject(data);
                }
            }).error(function (data) {
                defer.reject({
                    message: errorMsg
                });
            });
            return defer.promise;
        };

        this.get = function (url, param) {
            param = param || {};
            var defer = $q.defer();
            $http.get(url + '?' + $.param(param)).success(function (data) {
                if (isRequestSuccess(data)) {
                    defer.resolve(data.data);
                } else {
                    defer.reject(data);
                }
            }).error(function (data) {
                defer.reject({
                    message: errorMsg
                });
            });
            return defer.promise;
        };
        
        return this;
    }]);
});
/**
 * 公共js方法
 * 
 * @author zhanghua on 15/11/18
 * @requires layer qrcode
 */

/**
 * 生成二维码
 * 
 * @param  str 把这个字符串转成二维码
 * @param  tagId 标签ID, 生成好的二维码放在这个标签内
 * @param  {int} width 二维码宽度
 * @param  {int} height 二维码高度
 * @required qrcode.js
 */
function createQrcode(str, tagId, width, height) {
    var qrcode = new QRCode(document.getElementById(tagId), {
        width: width, //设置宽高
        height: height
    });
    qrcode.makeCode(str);
}

/**
 * 扩展Date，增加格式化日期方法
 * 
 * @param format
 * @returns
 */
Date.prototype.formatDate = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
            // millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

/**
 * 格式化日期， 默认为yyyy/MM/dd hh:mm:ss
 * 
 * @param date
 *            待格式化的日期
 * @param format
 *            日期格式
 * @return 格式化不成功返回undefined
 */
function formatDate(date, format) {
    if (typeof date == "string" && date.trim() == "") {
        return undefined;
    }
    var d = new Date(date);
    // console.log(d);
    if (format) {
        return d.formatDate(format);
    } else {
        return d.formatDate("yyyy/MM/dd hh:mm:ss");
    }
}

/**
 * 分页
 * 
 * @param  {Object} obj 需要含有{int}total（总行数）, {Array}rows(数据)属性
 * @param {int} currPage 当前页码 
 * @param {int} pageSize 每页行数
 * @return {Object} obj total-总行数,rows-数据,currPage-当前页码,pages-页码数组,totalPage-总页数
 */
function paging(obj, currPage, pageSize) {
    var pagesLength = 5; // 下面显示的页数，5个页码
    var totalPage = Math.ceil(obj.total / pageSize); // 总页数
    // var totalPage = 7; // 总页数
    var firstPage = 1; // 第一页
    var beforeNum = 2; // 当前页码之前有多少个页码
    var start, end; // 页码数组开始与结束

    if (totalPage <= pagesLength) { // 总页数小于等于下面显示的页数，
        start = firstPage;
        end = totalPage + 1;
    } else if (currPage > beforeNum) { // 当前页大于之前的2页
        if (totalPage > currPage + pagesLength - (beforeNum + 1)) {
            start = currPage - beforeNum;
            end = start + pagesLength;
        } else if ((totalPage - currPage) <= pagesLength) {
            //totalPage++;
            start = totalPage + 1 - pagesLength;
            end = totalPage + 1;
        }
    } else { // 从firstPage开始至pagesLength+1结束
        start = firstPage;
        end = pagesLength + 1;
    }
    obj.pages = generatedPages(start, end);
    obj.currPage = currPage;
    obj.totalPage = totalPage;
    console.log(obj);
    return obj;
    // console.log(obj);

    /**
     * 生成页码数组
     * 
     * @param  start 起始页码
     * @param  end   结束页码
     * @return 页码数组
     */
    function generatedPages(start, end) {
        var ary = [];
        for (var i = start; i < end; i++) {
            ary[ary.length] = i;
        }
        return ary;
    }
}

/**
 * 是否请求成功
 * 
 * @param  {Object}  data 请求返回的数据
 * @required layer.js
 * @return {Boolean} 请求成功返回true, 否则返回false
 */
function isRequestSuccess(data) {
    if (!data) {
        return false;
    }

    switch (data.status) {
    case 200: // OK
        return true;
    case 403: // 没有权限
    case 408: // Session超时
    case 417: // 非法参数异常
    case 500: // 服务器异常
        if (data.message) {
            layer.msg(data.message);
        }
        return false;
    }
}

/**
 * 数值转换成千分符值
 
 * param n 需转换的值
 * @return {number} 请求成功返回对应的千分符值
 */
function thousandFormat(n) {
    var re = /\d{1,3}(?=(\d{3})+$)/g;
    var value = n.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
        return s1.replace(re, "$&,") + s2;
    });
    return value;
}
// $string("a{0}, {1}", "1", "2")
// a1, 2
/**
 * 获得字符串
 * @return {[type]} [description]
 */
function $string() {
    if (arguments.length == 1) return arguments[0];
    for (var s = arguments[0], i = 1; i < arguments.length; i++) {
        s = s.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), arguments[i]);
    }
    return s;
}
function Q() {}
Q.prototype = {
    getQueryString : function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    hideHeader: function(el) {
        var hideHeader = this.getQueryString('hideHeader');
        if (hideHeader){
            $(el).hide();
        }
    }
}
var Q = new Q();
