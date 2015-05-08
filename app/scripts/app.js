'use strict';

/**
 * @ngdoc overview
 * @name zoteromarkdownApp
 * @description
 * # zoteromarkdownApp
 *
 * Main module of the application.
 */
angular
  .module('zoteromarkdownApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngClipboard',
    'monospaced.elastic',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider, ngClipProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

      ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  });
