angular.module("app.Login", [
  "app.Authentication",
  "app.SocketManager"
])

.controller("LoginCtrl", function ($state, $scope, $timeout, authentication, SocketManager) {
  console.log("Running login ctrl.");

  var init = function () {
    if (SocketManager.get("login")) {
      console.log("not making login twice");
      return;
    } 

    console.log("Connecting to login server");
    var loginChannel = SocketManager.create({
      id: "login",
      url: "http://localhost:8080/login",
      handlers: ["AUTHORIZE", "LOGOUT", "PROFILE_GET", "PROFILE_SET"]
    });

    loginChannel.connect();
  };

  init();

  $scope.loginData = {
    username: "jblanch" + _.random(1, 10000),
    password: "test"
  };

  $scope.loginUser = function () {
    authentication.loginUser($scope.loginData.username, $scope.loginData.password);
  };

  $scope.handleSocketMessage = function (e, message) {
    console.log("Handling login socket msg: ", e, message);
    switch(message.key) {
      case "AUTHORIZE":
        var response = message.data || {};

        if (!message.data) {
          $scope.loginError = true;
        } else {

          console.log("**** Got user from server: ", message.data);
          authentication.authorizeUser(message.data);
          $state.go("auth.home");
        }
      break;
    }
  };

  var listener = $scope.$on("socket:login:message", function (e, data) {
    console.log("Recieved a login message: ", e, data);

    $timeout(function () {
      $scope.handleSocketMessage(e, data);
    });
  });

  $scope.$on("$destroy", function () {
    listener();
  });
});
