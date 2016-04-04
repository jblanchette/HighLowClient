angular.module("app.States", ["ui.router"])

.config([
  '$stateProvider', 
  '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/login");

      $stateProvider.decorator("isAuthorized", function (state) {
        if (_.startsWith(state.name, "auth.")) {
          state.resolve = state.resolve || {};
          state.resolve.authenticate = ['authentication', function (authentication) {
            return authentication.verifySession();
          }];
        }

        return state;
      });

      $stateProvider.state("login", {
        url: "/login",
        templateUrl: "login/login.tpl.html",
        controller: "LoginCtrl"
      });

      $stateProvider.state("auth", {
        abstract: true,
        templateUrl: "auth.tpl.html",
        controller: function ($scope, $rootScope) {
          console.log("uhh?");
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

      $stateProvider.state("auth.home", {
        url: "/home",
        templateUrl: "home/home.tpl.html",
        controller: "HomeCtrl"
      });

      $stateProvider.state("auth.game", {
        url: "/game",
        templateUrl: "game/game.tpl.html",
        controller: "GameCtrl"
      });
    }
  ]
);
