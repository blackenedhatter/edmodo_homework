'use strict';

describe('test registration', function() {
  beforeEach(angular.mock.module('myApp.controllers'));

  var homeCtrl, scope, location, httpBackend;

  beforeEach(inject(function($controller, $rootScope, $location, $httpBackend, $http) {
    location = $location;
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    /**
     * The registration function only expects a 200 response code
     */
    httpBackend.when('POST', 'http://168.144.134.38:8000/homework/register/')
                     .respond(200,'');

    homeCtrl = $controller('RegCtrl', {
      $scope: scope,
      $http: $http,
      $location: location
    });
  }));

  describe('register', function() {
    /**
     * Registration function should exist.
     */
    it( 'reg should be defined ', function() {
      expect(scope.register).toBeDefined();
    });

    /**
     * newuser object should start off empty but set
     */
    it( 'blank user should be set in scope', function() {
        expect(scope.newuser).toEqual( {name: '', username: '', usertype: '', password: ''} )
    });

    /**
     * If setUser is called, newuser object should be set to the same
     *   object.
     */
    it( 'should set user', function() {
      scope.setUser({ name: 'John Smithe', username: 'radman1', usertype: 'Student', password: '123456' });

      expect(scope.newuser).toEqual( { name: 'John Smithe', username: 'radman1', usertype: 'Student', password: '123456' });
    });

    /**
     * If setUser is called, then register function is called,
     *   then location should get set to login page.
     */
    it( 'should set the path to login on login', function() {
        scope.setUser({ name: 'John Smithe', username: 'radman1', usertype: 'Student', password: '123456' });
        scope.register();
        httpBackend.flush();
        expect(location.path()).toBe('/login');
    });

  });
});
