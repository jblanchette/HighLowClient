angular.module("app.Login", ["app.Authentication"])

.controller("LoginCtrl", function ($state, $scope, authentication) {
  console.log("Running login ctrl.");

  $scope.loginData = {
    username: "jblanch" + _.random(1, 10000),
    password: "test"
  };

  $scope.loginUser = function () {
    authentication.loginUser($scope.loginData.username, $scope.loginData.password);
    $state.go("auth.home");
  };
});
