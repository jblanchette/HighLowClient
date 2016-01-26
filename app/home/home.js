angular.module("app.Home", ["app.Authentication", "app.SocketManager"])

.controller("HomeCtrl", function ($state, $scope, authentication, SocketManager) { 
  var authUser = authentication.getUser();
  console.log("in home ctrl: ", authUser);

  if (!authUser) {
    console.log("No authorized user, going back to login...");
  }

  var init = function () {
    if (SocketManager.get("gameList") || SocketManager.get("chat")) {
      return;
    }

    var gameList = SocketManager.create({
        id: "gameList",
        url: "http://localhost:8080/gameList",
        handlers: ["GAME_LIST", "JOIN_GAME", "LEFT_GAME", "USER_JOINED", "USER_LEFT"]
    });

    var chat = SocketManager.create({
        id: "chat",
        url: "http://localhost:8080/chat",
        handlers: ["JOIN_ROOM", "JOIN_GLOBAL", "USER_JOINED", "USER_LEFT", "ROOM_KICKED", "ROOM_MSG"]
    });

    gameList.connect();
    chat.connect();
  };

  init();

	$scope.gameListHandler = function (e, data) {
    console.log("Home got game list update: ", data);
  };

  $scope.$on("$destroy", function () {

  });
});
