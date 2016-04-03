angular.module("app", [
	"ui.router",
    // services
    "app.Authentication",
    "app.ChatManager",
    "app.GameManager",
    // modules
    "app.Game",
	"app.Home",
    "app.Login",
    "app.States",
    // directives
    "app.chatWindow",
	"app.gameList",
    // factories
	"app.SocketManager"
])

.run(function ($rootScope, $state, SocketManager) {

    //
    // Create the WebSocket managers.  Does not connect yet.
    //

    console.log("Creating sockets");
    
    SocketManager.create({
        id: "gameList",
        url: "http://localhost:8080/gameList",
        handlers: [
          "GAME_LIST", "JOIN_GAME", "LEFT_GAME",
          "USER_JOINED", "USER_LEFT", "GAME_STARTED",
          "GAME_INFO", "USER_READY", "USER_BUSY",
          "GAME_NOT_READY", "ROOM_MSG"
        ]
    });

    SocketManager.create({
        id: "chat",
        url: "http://localhost:8080/chat",
        handlers: ["JOIN_ROOM", "JOIN_GLOBAL", "USER_JOINED", "USER_LEFT", "ROOM_KICKED", "ROOM_MSG"]
    });

    SocketManager.create({
        id: "game",
        url: "http://localhost:8080/game",
        handlers: [
          "START_GAME", "CLOSE_GAME", "GAME_STARTED", "JOIN_GAME", 
          "LEFT_GAME", "USER_LEFT", "USER_JOINED", "KICK_MEMBER", 
          "USER_READY", "USER_BUSY", "GAME_INFO", "GAME_STEP"
        ]
    });

    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error){
        // todo: other state change errors

        if (error === "Not Authorized") {
          $state.go("login");
        }
    });
});
