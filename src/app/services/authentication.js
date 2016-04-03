angular.module("app.Authentication", ["app.SocketManager"])

.factory("authentication", function ($q, SocketManager) {
  var user;

  var loginUser = function (username, password) {
    user = {
      username: username,
      password: password
    };

    SocketManager.sendTo("login", "LOGIN", user);
  };

  var authorizeUser = function (newUser) {
    user = newUser;
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
    authorizeUser: authorizeUser,
    loginUser: loginUser,
    refreshUser: refreshUser,
    verifySession: verifySession
  };
});
