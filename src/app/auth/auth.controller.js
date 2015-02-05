'use strict';

angular.module('grammatist')
  .controller('AuthCtrl', function (Auth, Users) {
    var vm = this;
    vm.email = '';
    vm.password = '';
    vm.auth = Auth;
    vm.users = Users;

    vm.authErrorMessage = '';

    vm.login = function (email, password) {
      vm.authErrorMessage = '';
      return vm.auth.$authWithPassword({
        email: email,
        password: password
      })
        .then(function (authData) {
          Users.setCurrentUser(authData);
          console.log('Successful auth', authData);
        })
        .catch(function (error) {
          vm.logout();
          vm.authErrorMessage = error.message;
          console.log('Auth failed', error);
        })
    };

    vm.logout = function () {
      vm.auth.$unauth();
      vm.users.setCurrentUser(undefined);
    };

    vm.createUser = function (email, password) {
      vm.authErrorMessage = '';
      return vm.auth.$createUser({
        email: email,
        password: password
      }).then(function () {
        return vm.auth.$authWithPassword({
          email: email,
          password: password
        })
      }).finally(function(){
        vm.login(email, password);
      } )
        .catch(function (error) {
          vm.logout();
          vm.authErrorMessage = error.message;
          console.log('Auth failed', error);
        })
    }

  });
