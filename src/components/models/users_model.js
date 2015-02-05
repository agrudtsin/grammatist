angular.module('model.users', [])
  .service('Users', function(Auth){
    var obj = {
      setCurrentUser: setCurrentUser,
      currentUser: undefined
    };

    setCurrentUser(Auth.$getAuth());
    console.log('auth', Auth.$getAuth());
    return obj;

    function setCurrentUser(user){
      return obj.currentUser = user;
    }
  });
