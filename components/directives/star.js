define(['./mod'], function(mod) {
  'use strict';
  mod
  /**
     * 页眉标签 <ep-header></epheader>
     */
    .directive('star', function() {
    return {
      restrict: 'AE',
      // restrict: 'AE',
      template: '<ul class="rating" ng-mouseleave="leave()">' + '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)" ng-mouseover="over($index + 1)">' + '\u2605' + '</li>' + '</ul>',
      scope: {
        ratingValue: '=',
        max: '=',
        readonly: '@',
        onHover: '=',
        onLeave: '='
      },
      link: function(scope, elem, attrs) {
        elem.css("text-align", "center");
        var updateStars = function() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        updateStars();

        scope.$watch('ratingValue', function(oldVal, newVal) {
          if (newVal) {
            updateStars();
          }
        });
        scope.$watch('max', function(oldVal, newVal) {
          if (newVal) {
            updateStars();
          }
        });
      }
    };
  })

});
