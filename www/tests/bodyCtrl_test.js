'use strict';

describe('homework body controllers', function() {
  beforeEach(angular.mock.module('myApp.controllers'));

  var bodyCtrl, scope, location;

  /**
   * Use rootScope mock
   */
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    bodyCtrl = $controller('BodyCtrl', {
      $scope: scope
    });
  }));

  /**
   * Need isTeacher function in scope
   */
  describe('body should have isTeacher func', function() {
    it( 'should have isTeacher func ', function() {
      expect(scope.isTeacher).toBeDefined();
    });
  });

  describe('body should have isStudent func', function() {
    it( 'should have isStudent func ', function() {
      expect(scope.isStudent).toBeDefined();
    });
  });

  describe('body should have logout func', function() {
    it( 'scope should have logout func defined ', function() {
      expect(scope.logout).toBeDefined();
    });
  });

  describe('body should have default session var', function() {
    it( 'initial session should be empty values in object ', function() {
      expect(scope.session).toEqual({ username: '', usertype: '', name: '' });
    });
  });

});
