angular.module("app", [
	"ui.router",
	"app.Home",
	"app.gameList",
	"app.SocketManager"
])

.run(function (SocketManager) {
	var gameList = SocketManager.create({
        id: "gameList",
        url: "http://localhost:8080/gameList",
        handlers: ["GAME_LIST", "JOIN_GAME"]
    });

    gameList.connect();
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