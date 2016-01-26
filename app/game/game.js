angular.module("app.Game", [
  "app.Authentication",
  "app.GameManager",
  "app.SocketManager"
])

.controller("GameCtrl", function ($timeout, $state, $stateParams, $scope, authentication, SocketManager, gameManager) { 
  var authUser = authentication.getUser();
  console.log("in game ctrl: ", authUser);
  if (!authUser) {
    console.log("No authorized user, going back to login...");
  }

  $scope.currentGame = null;
  $scope.isHost = false;

  $scope.handleGameListMessage = function (e, message) {
    console.log("Handling game list msg: ", e, message);
    switch(message.key) {
      case "USER_JOINED":
        console.log("User joined game, updating info");
        gameManager.setGameInfo(message.data);
        updateGameInfo();
      break;
      case "USER_LEFT":
        console.log("User left game, updating");
        gameManager.setGameInfo(message.data);
        updateGameInfo();
      break;
    }
  };

  var updateGameInfo = function () {
    $scope.currentGame = gameManager.getCurrentGame();
  };

  var init = function () {
    $scope.currentGame = gameManager.getCurrentGame();

    if ($scope.currentGame.hostId === authUser.id) {
      console.log("Setting user as host");
      $scope.isHost = true;
    }
  };
  init();

  var gameListListener = $scope.$on("socket:gameList:message", function (e, data) {
    $timeout(function () {
      $scope.handleGameListMessage(e, data);
    });
  });

  $scope.$on("$destroy", function () {
    gameListListener();
  });
});
