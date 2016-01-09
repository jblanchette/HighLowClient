angular.module("app.States", ["ui.router"])

.config([
  '$stateProvider', 
  '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/login");

      $stateProvider.decorator("isAuthorized", function (state) {
        if (_.startsWith(state.name, "auth.")) {
          console.log("Got an auth state: ", state.name);

          state.resolve = state.resolve || {};
          state.resolve.authenticate = ['authentication', function (authentication) {
            return authentication.verifySession();
          }];
        }

        return state;
      });

      $stateProvider.state("login", {
        url: "/login",
        templateUrl: "app/login/login.tpl.html",
        controller: "LoginCtrl"
      });

      $stateProvider.state("auth", {
        abstract: true,
        templateUrl: "app/auth.tpl.html",
        controller: function ($scope, $rootScope) {
          console.log("Running auth controller?");
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
        templateUrl: "app/home/home.tpl.html",
        controller: "HomeCtrl"
      });
    }
  ]
);
