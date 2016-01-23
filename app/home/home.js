angular.module("app.Home", ["app.Authentication", "app.SocketManager"])

.controller("HomeCtrl", function ($state, $scope, authentication, SocketManager) { 
  var authUser = authentication.getUser();
  console.log("in home ctrl: ", authUser);

  if (!authUser) {
    console.log("No authorized user, going back to login...");
  }

  var init = function () {
    var gameList = SocketManager.create({
        id: "gameList",
        url: "http://localhost:8080/gameList",
        handlers: ["GAME_LIST", "JOIN_GAME"]
    });

    var chat = SocketManager.create({
        id: "chat",
        url: "http://localhost:8080/chat",
        handlers: ["JOIN_ROOM", "JOIN_GLOBAL", "MEMBER_JOINED", "MEMBER_LEFT", "ROOM_KICKED", "ROOM_MSG"]
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
