'use strict';

describe('Auth ctrl: ', function(){
  var scope;

  beforeEach(module('grammatist'));

  beforeEach(inject(function($rootScope,$controller) {
    scope = $rootScope.$new();
    $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('scope should be defined ', function() {
    expect(scope).toBeDefined();
  });
});
