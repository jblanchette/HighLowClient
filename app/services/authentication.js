angular.module("app.Authentication", [])

.factory("authentication", function ($q) {
  var user;

  var loginUser = function (username, password) {
    user = {
      id: _.random(1, 100000000),
      username: username,
      password: password
    };

    return user;
  };

  var getUser = function () {
    return user;
  };

  var refreshUser = function () {
    return $q.when(user);
  };

  var verifySession = function () {
    if (!user) {
      return $q.reject("Not Authorized");
    }

    return $q.when(user);
  };

  return {
    getUser: getUser,
    loginUser: loginUser,
    refreshUser: refreshUser,
    verifySession: verifySession
  };
});
