'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ngCookies']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegCtrl'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.when('/main', {templateUrl: 'partials/main.html', controller: 'MainCtrl'});
    $routeProvider.when('/createhomework', {templateUrl: 'partials/createhomework.html', controller: 'CreateHomeworkCtrl'});
    $routeProvider.when('/assignhomework', {templateUrl: 'partials/assignhomework.html', controller: 'AssignHomeworkCtrl'});
    $routeProvider.when('/listhomework', {templateUrl: 'partials/listhomework.html', controller: 'ListHomeworkCtrl'});
    $routeProvider.when('/showhomework/:homeworkid', {templateUrl: 'partials/showhomework.html', controller: 'ShowHomeworkCtrl'});
    $routeProvider.when('/showanswers/:homeworkid/:username', {templateUrl: 'partials/showanswers.html', controller: 'ShowAnswersCtrl'});
    $routeProvider.when('/myhomework', {templateUrl: 'partials/myhomework.html', controller: 'MyHomeworkCtrl'});
    $routeProvider.when('/submit/:homeworkid', {templateUrl: 'partials/submit.html', controller: 'SubmitCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
