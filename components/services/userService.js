define(['./mod'], function(mod) {
  'use strict';
  mod
  /**
   *用户中心：我的信息
   */
    .factory('userService', [
    '$http',
    '$q',
    function($http, $q) {
      // 用户信息
      var getUserInfo = function(param) {
        var defer = $q.defer();
        $http.post('/IParking_wechat/mobile/user/myBaseInfo.do', param).success(function(data) {
          defer.resolve(data);
        }).error(function() {
          defer.reject("network error");
        });;
        return defer.promise;
      }
      //end

      // 修改用户信息
      var updateUserInfo = function(param) {
        var defer = $q.defer();
        $http.post('/IParking_wechat/mobile/user/changeMyInfo.do', param).success(function(data) {
          defer.resolve(data);
        }).error(function() {
          defer.reject("network error");
        });;
        return defer.promise;
      }

      //获取用户地址列表
      var getUserAddress = function(param) {
        var defer = $q.defer();
        $http.post('/IParking_wechat/mobile/user/myAddressList.do', param).success(function(data) {
          defer.resolve(data);
        }).error(function() {
          defer.reject("network error");
        });;
        return defer.promise;
      }

      //新增用户地址
      var addUserAddress = function(param) {
        var defer = $q.defer();
        $http.post('/IParking_wechat/mobile/user/myAddressAdd.do', param).success(function(data) {
          defer.resolve(data);
        }).error(function() {
          defer.reject("network error");
        });;
        return defer.promise;
      }

      //获取openId
      var getOpenId = function(param){
        var defer = $q.defer();
        $http.post('/IParking_wechat/wx/core/getOpenid.do', param).success(function(data) {
          defer.resolve(data);
        }).error(function() {
          defer.reject("network error");
        });;
        return defer.promise;
      }

      //获取地图
      var getPosition = function(param){
        var defer = $q.defer();
        $http.post('/IParking_wechat/mobile/parking/parkingList.do', param).success(function(data) {
          console.log(data);
          defer.resolve(data);
        }).error(function() {
          defer.reject("network error");
        });;
        return defer.promise;
      }
      //退出登录
      var loginout = function(param){
        var defer = $q.defer();
        $http.post('/IParking_wechat/mobile/user/logOut.do', param).success(function(data) {
          defer.resolve(data);
        }).error(function() {
          defer.reject("network error");
        });;
        return defer.promise;
      }

      return {
        getUserInfo: getUserInfo,
        updateUserInfo: updateUserInfo,
        getUserAddress: getUserAddress,
        addUserAddress: addUserAddress,
        getOpenId:  getOpenId,
        getPosition: getPosition,
        loginout:loginout
      };

    }
  ])

});
