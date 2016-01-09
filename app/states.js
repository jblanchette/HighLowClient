angular.module("app.States", [
  "ui.router",
  "app.Authentication"
])

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise("/login");

      $stateProvider.state("login", {
        url: "/login",
        templateUrl: "app/login/login.tpl.html",
        controller: "LoginCtrl"
      });

      $stateProvider.state("auth", {
        abstract: true,
        templateUrl: "app/auth.tpl.html",
        controller: function ($scope, $rootScope) {

        },
        resolve: {
          authenticatedUser: function ($q, authentication) {
            return authentication.refreshUser()
              .catch(function (err) {
                console.log("Auth err: ", err);
              });
          }
        }
      });

      $stateProvider.decorator("isAuthorized", function (state) {
        console.log(state.name);
      });


      $stateProvider.state("auth.home", {
        url: "/home",
        templateUrl: "app/home/home.tpl.html",
        controller: "HomeCtrl"
      });
    }
  ]
);
