angular.module("app", [
	"ui.router",
    // modules
	"app.Home",
    // directives
    "app.chatWindow",
	"app.gameList",
    // factories
	"app.SocketManager"
])

.run(function (SocketManager) {
	var gameList = SocketManager.create({
        id: "gameList",
        url: "http://localhost:8080/gameList",
        handlers: ["GAME_LIST", "JOIN_GAME"]
    });

    var chat = SocketManager.create({
        id: "chat",
        url: "http://localhost:8080/chat",
        handlers: ["JOIN_ROOM", "MEMBER_JOINED", "MEMBER_LEFT", "ROOM_KICKED", "ROOM_MSG"]
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
