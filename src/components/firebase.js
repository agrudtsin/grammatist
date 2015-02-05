angular.module('grammatist')
  .constant('FIREBASE_URI', 'https://brilliant-fire-4886.firebaseio.com/')
  .service('Auth', function($firebaseAuth, FIREBASE_URI) {
    var ref = new Firebase(FIREBASE_URI);
    return $firebaseAuth(ref);
  })
  .service('AuthParams', function(Auth) {
    return function(){
      var params = {};
      var auth = Auth.$getAuth();
      if(auth){
        params.auth = auth.token;
      }
      return params;
    }
  });
