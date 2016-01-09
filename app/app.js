angular.module("app", [
	"ui.router",
    // services
    "app.Authentication",
    // modules
	"app.Home",
    "app.Login",
    "app.States",
    // directives
    "app.chatWindow",
	"app.gameList",
    // factories
	"app.SocketManager"
])

.run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error){
        if (error === "Not Authorized") {
          console.log("Not auth, moving to login.");
          $state.go("login");
        }
    });
});
