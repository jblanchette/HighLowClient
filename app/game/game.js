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

  $scope.chatHandler = function (chatInstance) {
    $scope.chatInstance = chatInstance;

    console.log("**** Chat instance: ", chatInstance);
    $scope.chatInstance.joinRoom($scope.currentGame);
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

        setGameInfo(message.data.game);
        connectToGame();
      break;
      case "USER_JOINED":
        setGameInfo(message.data.game);

        $scope.chatInstance.addMessage({
          author: "Server",
          message: "User joined: " + message.data.focus.nickname
        });
      break;
      case "USER_LEFT":
        setGameInfo(message.data.game);

        $scope.chatInstance.addMessage({
          author: "Server",
          message: "User left: " + message.data.focus.nickname
        });
      break;
      case "USER_READY":
        $scope.chatInstance.addMessage({
          author: "Server",
          message: "User ready: " + message.data.focus.nickname
        });
      break;
      case "USER_BUSY":
        $scope.chatInstance.addMessage({
          author: "Server",
          message: "User busy: " + message.data.focus.nickname
        });
      break;
      case "GAME_INFO":
        console.log("*** SETTING GAME_INFO", message);
        setGameInfo(message.data.game);
      break;
    }
  };

  $scope.handleGameMessage = function (e, message) {
    console.log("Handling game msg: ", e, message);
    switch(message.key) {
      case "USER_JOINED":
        console.log("User joined game, updating info");
        setGameInfo(message.data.game);
      break;
      case "USER_LEFT":
        console.log("User left game, updating");
        setGameInfo(message.data.game);
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

    gameSocket = SocketManager.get("game");

    if (!gameSocket) {
      // todo: handle errors here
      console.error("Error getting websocket for /game");
    }
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
    var curGame = gameManager.getCurrentGame();
    var authUser = $scope.authUser; // more terse

    if (curGame) {
      var localOptions = {
        isHost: curGame.hostId === authUser.id,
        isReady: _.some(curGame.members, { id: authUser.id, ready: true })
      };
      
      console.log("Local: ", localOptions);
      curGame = _.merge(curGame, localOptions);
    }

    $scope.currentGame = curGame;
  };

  var init = function () {
    setupConnection();
    updateGameInfo();
  };
  init();

  $scope.$on("$destroy", function () {
    gameListener();
    listListener();
  });
});
