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
  $scope.chatOpen = true;

  var gameSocket;
  var inGame = function () {
    return !!$scope.currentGame;
  };

  //
  // UI Scope methods
  //

  $scope.toggleChat = function () {
    $scope.chatOpen = !$scope.chatOpen;
  };

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
    $scope.addChatMessage({
      author: "me",
      message: "You are now marked as " + (state ? "ready" : "busy")
    });
  };

  $scope.chatHandler = function (chatInstance) {
    $scope.chatInstance = chatInstance;
    $scope.chatInstance.joinRoom($scope.currentGame);

    $scope.addChatMessage({
      author: "Server",
      message: "You Joined A Game"
    });
  };

  $scope.addChatMessage = function (msg) {
    $timeout(function () {
      $scope.chatInstance.addMessage(msg);
    })
  }

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

        $scope.addChatMessage({
          author: "Server",
          message: "Game is starting, connecting to server..."
        });
        connectToGame();
      break;
      case "USER_JOINED":
        setGameInfo(message.data.game);
      break;
      case "USER_LEFT":
        setGameInfo(message.data.game);

        $scope.addChatMessage({
          author: "Server",
          message: "User left: " + message.data.focus.nickname
        });
      break;
      case "USER_READY":
        $scope.addChatMessage({
          author: "Server",
          message: "User ready: " + message.data.focus.nickname
        });
      break;
      case "USER_BUSY":
        $scope.addChatMessage({
          author: "Server",
          message: "User busy: " + message.data.focus.nickname
        });
      break;
      case "GAME_INFO":
        setGameInfo(message.data.game);
      break;
    }
  };

  $scope.handleGameMessage = function (e, message) {
    console.log("Handling game msg: ", e, message);
    switch(message.key) {
      case "USER_JOINED":
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

  $scope.handleGameConnect = function (e, data) {
    $scope.addChatMessage({
      author: "Server",
      message: "Connected to game."
    });

    // TODO: ask for our games info?  idk
  };

  var setupConnection = function () {
    if (gameSocket) {
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
      console.log("%%%% ERROR FINDING GAME SOCKET %%%%%");
      return;
    }

    console.log("***%% CONNECTING TO GAME SERVER %%***");
    gameSocket.connect();
  };

  var gameListener = $scope.$on("socket:game:message", function (e, data) {
    $timeout(function () {
      $scope.handleGameMessage(e, data);
    });
  });

  var gameConnectListener = $scope.$on("socket:game:connect", function (e, data) {
    $timeout(function () {
      $scope.handleGameConnect(e, data);
    });
  });

  var listListener = $scope.$on("socket:gameList:message", function (e, data) {
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
