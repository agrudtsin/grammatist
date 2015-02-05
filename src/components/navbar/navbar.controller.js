'use strict';

angular.module('grammatist')
  .controller('NavbarCtrl', function (Users) {
    var nc = this;
    nc.users = Users;


  });
