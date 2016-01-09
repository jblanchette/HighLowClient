angular.module("app.Login", ["app.Authentication"])

.controller("LoginCtrl", function ($state, $scope, authentication) {
  console.log("Running login ctrl.");
});
