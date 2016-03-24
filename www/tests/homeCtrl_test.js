'use strict';

describe('homework controllers', function() {
  beforeEach(angular.mock.module('myApp.controllers'));

  var homeCtrl, scope, location;

  /**
   * Use rootScope and Location mock
   */
  beforeEach(inject(function($controller, $rootScope, $location) {
    location = $location;
    scope = $rootScope.$new();
    homeCtrl = $controller('HomeCtrl', {
      $scope: scope,
      $location: location
    });
  }));

  describe('home', function() {

    /**
     * login function needs to be defined
     */
    it( 'login func should exist in scope ', function() {
      expect(scope.login).toBeDefined();
    });

    /**
     * Login func should set path to login route
     */
    it( 'should set path to login', function() {
        scope.login();
        expect(location.path()).toBe('/login');
    });

    /**
     * Register function needs to be defined
     */
    it( 'register func should exist in scope', function() {
      expect(scope.register).toBeDefined();
    });


    /**
     * Register func should set path to register route
     */
    it( 'should set the path to register when registering', function() {
        scope.register();
        expect(location.path()).toBe('/register');
    });
  });
});
