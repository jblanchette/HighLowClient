angular.module("app.Home", ["app.Authentication", "app.SocketManager"])

.controller("HomeCtrl", function ($state, $scope, authentication, SocketManager) { 
  var authUser = authentication.getUser();
  $scope.chatNamespace = "chat";
  $scope.gameListNamespace = "gameList";

  if (!authUser) {
    console.log("No authorized user, going back to login...");
  }

  // onStart handler for global chat
  $scope.setupGlobalChat = function () {
    var authUser = authentication.getUser();

    if (!$scope.currentRoom && authUser) {
      console.log("Asking server to put us in a global chat");
      SocketManager.sendTo($scope.chatNamespace, "JOIN_GLOBAL", authUser);
    } 
  };

	$scope.gameListHandler = function (e, data) {
    console.log("Home got game list update: ", data);
  };

  var init = function () {
    if (SocketManager.get("gameList") || SocketManager.get("chat")) {
      return;
    }

    var gameList = SocketManager.create({
        id: $scope.gameListNamespace,
        url: "http://localhost:8080/" + $scope.gameListNamespace,
        handlers: [
          "GAME_LIST", "JOIN_GAME", "LEFT_GAME",
          "USER_JOINED", "USER_LEFT", "GAME_STARTED",
          "GAME_INFO", "USER_READY", "USER_BUSY"
        ]
    });

    var chat = SocketManager.create({
        id: $scope.chatNamespace,
        url: "http://localhost:8080/" + $scope.chatNamespace,
        handlers: ["JOIN_ROOM", "JOIN_GLOBAL", "USER_JOINED", "USER_LEFT", "ROOM_KICKED", "ROOM_MSG"],
        onConnect: $scope.setupGlobalChat
    });

    gameList.connect();
    chat.connect();
  };

  init();

  $scope.$on("$destroy", function () {

  });
});
