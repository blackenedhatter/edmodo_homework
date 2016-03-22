'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('datepicker', function() {
    return {
      restrict : 'A',
      require : 'ngModel',
      link : function (scope, element, attrs, ngModelCtrl) {
        $(function(){
          element.datepicker({
            dateFormat:'mm/dd/yy',
            onSelect:function (date) {
              scope.$apply(function () {
                ngModelCtrl.$setViewValue(date);
              });
            }
          });
        });
      }
    }
});
/*
  directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(function(){
            scope.$eval(attrs.ngEnter, {'event': event});
          });

          event.preventDefault();
        }
      });
    }
  });
*/
