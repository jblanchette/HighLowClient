angular.module("app", [
	"ui.router",
	"app.Home",
	"app.gameList",
	"app.SocketManager"
])

.run(function (SocketManager) {
	SocketManager.initalize(socketIoInstance);
})

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
    	$urlRouterProvider.otherwise("/");

    	$stateProvider.state("home", {
    		url: "/",
    		templateUrl: "app/home/home.tpl.html",
    		controller: "HomeCtrl"
    	});
    }
  ]
);