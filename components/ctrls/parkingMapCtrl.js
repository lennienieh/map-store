define(['./mod'], function(mod) {
  'use strict';
  mod.controller('parkingMapCtrl', [
    '$scope',
    '$location',
    'userService',
    function($scope, $location, userService) {




      $scope.trafficImg = "/images/lk_hover.png";
      $scope.filterImg = "/images/filter.png";

      $scope.max = 5;
      $scope.ratingVal = 1;
      $scope.readonly = false;
      $scope.onHover = function(val) {
        $scope.hoverVal = val;
      };
      $scope.onLeave = function() {
        $scope.hoverVal = null;
      }
      $scope.onChange = function(val) {
        $scope.ratingVal = val;
      }
      //search input
      var $searchBar = $('#searchBar'),
        $searchResult = $('#searchResult'),
        $searchText = $('#searchText'),
        $searchInput = $('#searchInput'),
        $searchClear = $('#searchClear'),
        $searchCancel = $('#searchCancel');

      function hideSearchResult() {
        $searchResult.hide();
        $searchInput.val('');
        $('#confirmSearchBtn').show();
      }
      function cancelSearch() {
        hideSearchResult();
        $searchBar.removeClass('weui-search-bar_focusing');
        $searchText.show();
      }

      $searchText.on('click', function() {
        $searchBar.addClass('weui-search-bar_focusing');
        $searchInput.focus();
      });
      // $searchInput.on('blur', function() {
      //
      //   cancelSearch();
      //   if (!this.value.length)
      //     cancelSearch();
      //   }
      // ).on('input', function() {
      //   if (this.value.length) {
      //     $searchResult.show();
      //     console.log('likai');
      //     console.log(this)
      //   } else {
      //     $searchResult.hide();
      //   }
      // });


      $searchClear.on('click', function() {
        hideSearchResult();
        $searchInput.focus();
        $('#confirmSearchBtn').show();
      });
      $searchCancel.on('click', function() {
        cancelSearch();
        $searchInput.blur();
        // $('#confirmSearchBtn').hide();
      });

      //end

      //map filter

      var getFilterObj = {
        data_type:0,
        discount_type:0
      };



      //end

      //stars
      //
      $scope.mapReady = function(map) {

        $scope.commitSearch = function(){
            var getTxt = $('#searchInput').val();
            geolocation.getCurrentPosition(function(r) {

                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var centerMap = map.getCenter();
                    var localSearch = new BMap.LocalSearch(map);
                    localSearch.enableAutoViewport(); //允许自动调节窗体大小
                    map.clearOverlays();
                    localSearch.setSearchCompleteCallback(function (searchResult) {
                        var poi = searchResult.getPoi(0);
                        // var mk = new BMap.Marker(poi.point);
                        // var mk = new BMap.Marker(poi.point);
                        // map.addOverlay(mk);
                        console.log('poi:',poi);
                        map.panTo(poi.point);
                        var centerMap = map.getCenter();

                        userService.getPosition({
                            longitude_user: r.point.lng,
                            latitude_user:  r.point.lat,
                            longitude_core: centerMap.lng,
                            latitude_core:  centerMap.lat,
                            parking_name: getTxt
                        }).then(function(data){
                            console.log(data);
                            var urlData = {
                              longitude_user: r.point.lng,
                              latitude_user:  r.point.lat,
                              longitude_core: centerMap.lng,
                              latitude_core:  centerMap.lat
                            }

                            $scope.urlparkinglist = function(){
                               $location.path('/h5/parkinglist').search(urlData);
                            }

                            var mapArr = [];
                            for(var i = 0 ,len = data.list.length;i<len;i++){
                                mapArr.push([data.list[i].longitude,data.list[i].latitude,{data:data.list[i]}]);

                            }

                            console.log('mapArr:',mapArr);

                            json_data = mapArr;
                            var pointArray = new Array();

                            for (var i = 0; i < json_data.length; i++) {
                                var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                                    offset: new BMap.Size(10, 25),
                                    imageOffset: new BMap.Size(0, 0 - i * 25)
                                });
                                var marker = new BMap.Marker(new BMap.Point(json_data[i][0], json_data[i][1]), {icon: myIcon}); // 创建点
                                map.addOverlay(marker); //增加点
                                pointArray[i] = new BMap.Point(json_data[i][0], json_data[i][1]);
                                console.log('marker:',marker);
                                marker.addEventListener("click", attribute);
                                console.log('marker:',marker);
                            }

                            if(mapArr[0]){
                                var point = new BMap.Point(mapArr[0][0], mapArr[0][1]);
                                map.centerAndZoom(point, 15);
                                console.log('mapArr',mapArr);
                                var getData = mapArr[0][2].data;

                                console.log('getData:',getData);

                                var gethtml = $('#positionMark').html();
                                layer.open({
                                  content: gethtml,
                                  type: '3',
                                  shade: true,
                                  btn: ['开始导航'],
                                  skin: 'footer',
                                  yes: function(index) {

                                    var geolocation = new BMap.Geolocation();
                                    geolocation.getCurrentPosition(function(r) {
                                      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                                        var p1 = new BMap.Point(r.point.lng,r.point.lat);
                                        var p2 = new BMap.Point(getData.longitude,getData.latitude);

                                        var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
                                        driving.search(p1, p2);
                                        location.href="http://api.map.baidu.com/direction?origin="+r.point.lat+","+r.point.lng+"&destination="+getData.latitude+","+getData.longitude+"&mode=driving&region=上海&output=html";
                                      } else {
                                      }
                                    }, {enableHighAccuracy: true});
                                    layer.closeAll();
                                  },
                                  success: function(elem) {
                                    $('.layui-m-layerchild').css('backgroundColor', 'white');
                                    $('.layui-m-layerbtn span').addClass('searchParkingBtn');
                                    for(var i = 0 ,len = json_data.length;i<len;i++){
                                      if(json_data[i][0]  && json_data[i][1] ){
                                        getData = json_data[i][2].data;
                                        $('.rating li').removeClass('filled');
                                        $('.rating li').each(function(index, el) {
                                          if( index >= $('.rating li').length/2){
                                            if(index < getData.parking_stars+$('.rating li').length/2){
                                              $(this).addClass('filled')
                                            }
                                          }
                                        });
                                        $('.parkingTitle').text(getData.parking_name);
                                        $('.spaceCar').text(getData.spaceNum);
                                        $('.allSpaceCar').text(getData.total_spaces);
                                        if(!getData.open24h){
                                          $('.fullHours').hide();
                                        }else if(!getData.spacesInfo){
                                          $('.privateCar').hide();
                                        }else if(!getData.iscoupon){
                                          $('.isCoupon').hide();
                                        }
                                        $('.parkingAdd').text(getData.parking_address);
                                        $('.foundTel').text();
                                        $('.parkingDis').text(getData.distanceStr);
                                        // arrowTop
                                        var j = 0;
                                        $('.displayFlag').hide();
                                        $('.showFlag').on('click',function(){
                                          j++;
                                          if(j%2==0){
                                            $(this).addClass('arrowBot').removeClass('arrowTop');
                                            $('.displayFlag').hide();
                                          }else{
                                            $('.displayFlag').show();
                                            $(this).addClass('arrowTop').removeClass('arrowBot');

                                          }
                                        })
                                      }
                                    }

                                  }
                                });
                            }





                        })

                    });
                    localSearch.search(getTxt);









                } else {
                }
            }, {enableHighAccuracy: true});

        }

        $searchInput.on('keydown',function(e){
          if(e.keyCode == 13){
            $scope.commitSearch();
          }
        })


        var json_data = [];

        map.enableScrollWheelZoom();
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
        map.addControl(new BMap.OverviewMapControl());

        var point = new BMap.Point(121.357251, 31.233272);
        map.centerAndZoom(point, 15);
        function getMyCity(result) {
          var cityName = result.name;
        }

        $scope.toFilter = function() {

          $scope.filterImg = "/images/filter.png";
          var gethtml = $('#filterArea').html();
          // map.clearOverlays();
          layer.open({
            content: gethtml,
            type: '1',
            btn: ['确定'],
            skin: 'footer',
            yes: function(index) {

              $scope.filterImg = "/images/filter.png";
              console.log('getFilterObj:',getFilterObj);
              $('.parkingType li').each(function(index, el) {
                console.log($(this).data())
                if(index>1){
                  if(!$(this).hasClass('active')){
                    // getFilterObj.data_type = "";
                    console.log('300:',$(this).data())
                  }else{
                    console.log('301:',$(this).data())
                    getFilterObj.data_type = $(this).data().type;
                  }
                }

              });

              $('.weui-switch:checked').each(function(index, el) {
                var title = $(this).data().filterbtn;
                getFilterObj[title]=1;
              });

              var geolocation = new BMap.Geolocation();
              geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                  map.clearOverlays();
                  var mk = new BMap.Marker(r.point);
                  map.addOverlay(mk);
                  // map.panTo(r.point);
                  var centerMap = map.getCenter();
                  getFilterObj.longitude_user = r.point.lng;
                  getFilterObj.latitude_user = r.point.lat;
                  getFilterObj.longitude_core = centerMap.lng;
                  getFilterObj.latitude_core = centerMap.lat;
                  userService.getPosition(getFilterObj).then(function(data){
                    var urlData = {
                      longitude_user: r.point.lng,
                      latitude_user:  r.point.lat,
                      longitude_core: centerMap.lng,
                      latitude_core:  centerMap.lat
                    }

                    $scope.urlparkinglist = function(){
                       $location.path('/h5/parkinglist').search(urlData);
                    }
                    var mapArr = [];
                    for(var i = 0 ,len = data.list.length;i<len;i++){
                      mapArr.push([data.list[i].longitude,data.list[i].latitude,{data:data.list[i]}]);
                    }
                    json_data = mapArr;
                    var pointArray = new Array();
                    for (var i = 0; i < json_data.length; i++) {
                      var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                        offset: new BMap.Size(10, 25),
                        imageOffset: new BMap.Size(0, 0 - i * 25)
                      });
                      var marker = new BMap.Marker(new BMap.Point(json_data[i][0], json_data[i][1]), {icon: myIcon}); // 创建点
                      map.addOverlay(marker); //增加点
                      pointArray[i] = new BMap.Point(json_data[i][0], json_data[i][1]);
                      marker.addEventListener("click", attribute);
                    }
                  })
                } else {
                }
              }, {enableHighAccuracy: true});
              layer.closeAll();
            },
            success: function(elem) {
              $('.layui-m-layercont,.layui-m-layerbtn').css('backgroundColor', 'white');
              getFilterObj.isSpaces = 0;
              getFilterObj.is_pay = 0;
              getFilterObj.bespeak = 0;
              getFilterObj.charging_pile = 0;
              getFilterObj.open24h = 0;
              $('.parkingType li').each(function(index, el) {
                var getData = $(this).data();
                if(getData.type){
                  if(getFilterObj.data_type == getData.type){
                    $(this).addClass('active').siblings().removeClass('active');
                  }
                }else if(getData.discount){
                  if(getFilterObj.discount_type == getData.discount){
                    $(this).addClass('active').siblings().removeClass('active');
                  }
                }
              });

              $('.parkingType li').on('click', function(event) {
                if($(this).data().type){
                  getFilterObj.data_type = $(this).data().type;
                }else if($(this).data().discount){
                  getFilterObj.discount_type = $(this).data().discount;
                }
                if($(this).hasClass('active')){
                  $(this).removeClass('active').siblings().removeClass('active');
                  if($(this).data().type){
                    getFilterObj.data_type = "";
                  }else if($(this).data().discount){
                    getFilterObj.discount_type = "";
                  }
                }else{
                  $(this).addClass('active').siblings().removeClass('active');
                  if($(this).data().type){
                    getFilterObj.data_type = $(this).data().type;
                  }else if($(this).data().discount){
                    getFilterObj.discount_type = $(this).data().discount;
                  }
                }
              });
            }

          });
        }
        var myCity = new BMap.LocalCity();

        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            // alert(r.point.lat);
            // map.panTo(r.point);
            var centerMap = map.getCenter();
            console.log()

            var point = new BMap.Point(r.point.lng, r.point.lat);
            map.centerAndZoom(point, 15);
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            userService.getPosition({
              longitude_user: r.point.lng,
              latitude_user:  r.point.lat,
              longitude_core: centerMap.lng,
              latitude_core:  centerMap.lat
            }).then(function(data){
              var urlData = {
                longitude_user: r.point.lng,
                latitude_user:  r.point.lat,
                longitude_core: centerMap.lng,
                latitude_core:  centerMap.lat
              }

              $scope.urlparkinglist = function(){
                 $location.path('/h5/parkinglist').search(urlData);
              }
              var mapArr = [];
              for(var i = 0 ,len = data.list.length;i<len;i++){
                mapArr.push([data.list[i].longitude,data.list[i].latitude,{data:data.list[i]}]);
              }

              json_data = mapArr;

              var pointArray = new Array();
              for (var i = 0; i < json_data.length; i++) {
                var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                  offset: new BMap.Size(10, 25),
                  imageOffset: new BMap.Size(0, 0 - i * 25)
                });
                var marker = new BMap.Marker(new BMap.Point(json_data[i][0], json_data[i][1]), {icon: myIcon}); // 创建点
                map.addOverlay(marker); //增加点
                pointArray[i] = new BMap.Point(json_data[i][0], json_data[i][1]);
                marker.addEventListener("click", attribute);
              }
            })

            // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
          } else {
            // alert('failed' + this.getStatus());
          }
        }, {enableHighAccuracy: true})

        //获取覆盖物位置
        function attribute(e) {
          var p = e.target;
          console.log('e:',e)
          var getData = ""
          var gethtml = $('#positionMark').html();
          layer.open({
            content: gethtml,
            type: '3',
            shade: true,
            btn: ['开始导航'],
            skin: 'footer',
            yes: function(index) {

              var geolocation = new BMap.Geolocation();
              geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                  var p1 = new BMap.Point(r.point.lng,r.point.lat);
                  var p2 = new BMap.Point(getData.longitude,getData.latitude);

                  var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
                  driving.search(p1, p2);
                  location.href="http://api.map.baidu.com/direction?origin="+r.point.lat+","+r.point.lng+"&destination="+getData.latitude+","+getData.longitude+"&mode=driving&region=上海&output=html";
                } else {
                }
              }, {enableHighAccuracy: true});
              layer.closeAll();
            },
            success: function(elem) {
              $('.layui-m-layerchild').css('backgroundColor', 'white');
              $('.layui-m-layerbtn span').addClass('searchParkingBtn');
              for(var i = 0 ,len = json_data.length;i<len;i++){
                if(json_data[i][0] == p.getPosition().lng && json_data[i][1] == p.getPosition().lat){
                  getData = json_data[i][2].data;
                  $('.rating li').removeClass('filled');
                  $('.rating li').each(function(index, el) {
                    if( index >= $('.rating li').length/2){
                      if(index < getData.parking_stars+$('.rating li').length/2){
                        $(this).addClass('filled')
                      }
                    }
                  });
                  $('.parkingTitle').text(getData.parking_name);
                  $('.spaceCar').text(getData.spaceNum);
                  $('.allSpaceCar').text(getData.total_spaces);
                  if(!getData.open24h){
                    $('.fullHours').hide();
                  }else if(!getData.spacesInfo){
                    $('.privateCar').hide();
                  }else if(!getData.iscoupon){
                    $('.isCoupon').hide();
                  }
                  $('.parkingAdd').text(getData.parking_address);
                  $('.foundTel').text();
                  $('.parkingDis').text(getData.distanceStr);
                  // arrowTop
                  var j = 0;
                  $('.displayFlag').hide();
                  $('.showFlag').on('click',function(){
                    j++;
                    if(j%2==0){
                      $(this).addClass('arrowBot').removeClass('arrowTop');
                      $('.displayFlag').hide();
                    }else{
                      $('.displayFlag').show();
                      $(this).addClass('arrowTop').removeClass('arrowBot');

                    }
                  })
                }
              }
              console.log('getData:',getData);
            }
          });
        }

        //显示实时苦况情况
        var traffic = new BMap.TrafficLayer(); // 创建交通流量图层实例
        $scope.showTrafficLayer = function(){
          if($scope.trafficImg == "/images/lk.png"){
            $scope.trafficImg = "/images/lk_hover.png";
            map.removeTileLayer(traffic);
          }else if($scope.trafficImg == "/images/lk_hover.png"){
            $scope.trafficImg = "/images/lk.png";
            map.addTileLayer(traffic);
          }
        }
        //end


        map.addEventListener('dragend', function(e) {
          var center = map.getCenter();
          var geolocation = new BMap.Geolocation();
          geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              var mk = new BMap.Marker(r.point);
              map.addOverlay(mk);
              // map.panTo(r.point);
              var centerMap = map.getCenter();
              userService.getPosition({
                longitude_user: r.point.lng,
                latitude_user:  r.point.lat,
                longitude_core: centerMap.lng,
                latitude_core:  centerMap.lat
              }).then(function(data){
                map.clearOverlays();
                var mapArr = [];
                for(var i = 0 ,len = data.list.length;i<len;i++){
                  mapArr.push([data.list[i].longitude,data.list[i].latitude,{data:data.list[i]}]);
                }

                json_data = mapArr;

                var pointArray = new Array();
                for (var i = 0; i < json_data.length; i++) {
                  var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                    offset: new BMap.Size(10, 25),
                    imageOffset: new BMap.Size(0, 0 - i * 25)
                  });
                  var marker = new BMap.Marker(new BMap.Point(json_data[i][0], json_data[i][1]), {icon: myIcon}); // 创建点
                  map.addOverlay(marker); //增加点
                  pointArray[i] = new BMap.Point(json_data[i][0], json_data[i][1]);
                  marker.addEventListener("click", attribute);
                }
              })
            } else {
            }
          }, {enableHighAccuracy: true})

        })

      };

    }
  ])
})
