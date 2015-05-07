'use strict';

/**
 * @ngdoc directive
 * @name zoteromarkdownApp.directive:fitHeight
 * @description
 * # fitHeight
 */
angular.module('zoteromarkdownApp')
  .directive('fitheight', function ($window, $timeout) {
    return {
      restrict: 'AC',
      scope : {
        trigger : "@resizetrigger"
      },
      link: function postLink(scope, element, attrs) {
        var parent = $(element).parent(),
        	 prev = $(element).prev(),
        	 next = $(element).next();
        var first = false;

        var fitHeight = function(){
            var begin = (prev)?$(prev).position().top + $(prev).outerHeight():$(parent).position().top,
                end = ($(next).offset().top)?$(next).position().top:$(parent).outerHeight();
            var newHeight = end - begin;
            
        	$(element).css({
        		height : newHeight,
        		top : ($(element).css('position')=='absolute')?begin:undefined
        	});
            if(!first){
                $timeout(fitHeight, 500);
                first = true;
            }
            
        }
        fitHeight();

        var w = angular.element($window);
        w.bind('resize', function(){
            first = false;
            fitHeight();
        });

        scope.$watch(function(){
            return next.outerHeight() 
                    
        }, function(){
            first = false;
            fitHeight();
        });

        scope.$watch('trigger', function(){
            first = false;
            fitHeight();
        });

        

      }
    };
  });
