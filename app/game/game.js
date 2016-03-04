angular.module("app.Game", [
  "app.Authentication",
  "app.GameManager",
  "app.SocketManager"
])

.controller("GameCtrl", function ($timeout, $state, $stateParams, $scope, authentication, SocketManager, gameManager) { 
  $scope.authUser = authentication.getUser();
  console.log("in game ctrl: ", $scope.authUser);
  
  if (!$scope.authUser) {
    console.log("No authorized user, going back to login...");
  }

  $scope.currentGame = gameManager.getCurrentGame();
  $scope.isHost = false;

  var gameSocket;

  var inGame = function () {
    return !!$scope.currentGame;
  };

  //
  // UI Scope methods
  //

  $scope.startGame = function () {
    if (!inGame() || $scope.currentGame.hostId !== $scope.authUser.id) {
      return;
    }

    var msg = {
      gameId: $scope.currentGame.id
    };

    SocketManager.sendTo("gameList", "START_GAME", msg);
  };

  $scope.setReadyState = function (state) {
    if (!inGame()) {
      return;
    }

    var msg = {
      gameId: $scope.currentGame.id
    };
    var msgKey = state ? "USER_READY" : "USER_BUSY";

    SocketManager.sendTo("gameList", msgKey, msg);
  };

  $scope.getGameState = function () {
    console.log("Cur game: ", $scope.currentGame);
    return $scope.currentGame && $scope.currentGame.state;
  };

  //
  // WebSocket handler
  //

  $scope.handleGameListMessage = function (e, message) {
    console.log("Handling gameList msg: ", e, message);
    switch(message.key) {
      case "GAME_STARTED":
        console.log("Got a game started signal");
        console.log("Game msg: ", message.data);

        setGameInfo(message.data);
        connectToGame();
      break;
    }
  };

  $scope.handleGameMessage = function (e, message) {
    console.log("Handling game msg: ", e, message);
    switch(message.key) {
      case "USER_JOINED":
        console.log("User joined game, updating info");
        setGameInfo(message.data);
      break;
      case "USER_LEFT":
        console.log("User left game, updating");
        setGameInfo(message.data);
      break;
      case "GAME_STARTED":

      break;
      case "USER_READY":

      break;
      case "USER_LEFT":

      break;
      case "GAME_INFO":

      break;
    }
  };

  var setupConnection = function () {
    if (gameSocket || SocketManager.get("game")) {
      return;
    }

    gameSocket = SocketManager.create({
        id: "game",
        url: "http://localhost:8080/game",
        handlers: [
          "START_GAME", "CLOSE_GAME", "GAME_STARTED", "JOIN_GAME", 
          "LEFT_GAME", "USER_LEFT", "USER_JOINED", "KICK_MEMBER", 
          "USER_READY", "USER_BUSY", "GAME_INFO", "GAME_STEP"
        ]
    });
  };

  var connectToGame = function () {
    if (!gameSocket) {
      return;
    }

    gameSocket.connect();
  };

  var gameListener = $scope.$on("socket:game:message", function (e, data) {
    $timeout(function () {
      $scope.handleGameMessage(e, data);
    });
  });

  var listListener = $scope.$on("socket:gameList:message", function (e, data) {
    console.log("Recieved a game list message: ", e, data);

    $timeout(function () {
      $scope.handleGameListMessage(e, data);
    });
  });

  //
  // Game controller
  //

  var setGameInfo = function (info) {
    console.log("**** SETTING INFO: ", info);
    $scope.currentGame = gameManager.setGameInfo(info);
    updateGameInfo();
  };

  var updateGameInfo = function () {
    $scope.currentGame = gameManager.getCurrentGame();
  };

  var init = function () {
    setupConnection();
    $scope.currentGame = gameManager.getCurrentGame();

    if ($scope.currentGame.hostId === $scope.authUser.id) {
      console.log("Setting user as host");
      $scope.isHost = true;
    }
  };
  init();

  $scope.$on("$destroy", function () {
    gameListener();
    listListener();
  });
});
