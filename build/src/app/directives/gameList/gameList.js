angular.module("app.gameList", [
	"app.SocketManager",
	"app.Authentication",
	"app.GameManager"
])
.controller("gameListCtrl", function ($timeout, $state, $scope, SocketManager, gameManager, authentication) {
	var authUser = authentication.getUser();
	$scope.games = [];	

	$scope.joiningGame = false;

	$scope.modal = {
    isOpen: false,
    header: "Join Game",
    body: "Joining..."
  };

	$scope.handleSocketMessage = function (e, message) {
		console.log("Handling socket msg: ", e, message);
		switch(message.key) {
			case "GAME_LIST":
				$scope.games = message.data;
			break;
			case "JOIN_GAME":
				console.log("You joined game: ", message.data);
				$scope.modal.isOpen = false;

				gameManager.setGameInfo(message.data.game);
				$state.go("auth.game");
			break;

			case "USER_JOINED":
				console.log("A user joined a game: ", message.data.game);
				updateGame(message.data);
			break;

			case "USER_LEFT":
				console.log("A user left a game: ", message.data.game);
				updateGame(message.data);
			break;

			case "GAME_STARTED":
				console.log("**** The game i'm in started!", message.data);
			break;
		}
	};

	var updateGame = function (data) {
		var gameIndex = _.findKey($scope.games, function (g) {
			return g.id === data.game.id;
		});

		if (!!gameIndex) {
			console.log("Updating game index: ", gameIndex);
			$scope.games[gameIndex] = data.game;
		} else {
			console.log("NOT UPDATING: ", data);
		}
	};

	$scope.joinGame = function (gameId) {
		if ($scope.joiningGame) {
			return;
		}

		$scope.joiningGame = true;
		var gameInfo = {
			gameId: gameId,
			member: authUser
		};

		console.log("Joining game...", gameInfo);
		$scope.modal.isOpen = true;
		SocketManager.sendTo("gameList", "JOIN_GAME", gameInfo);
	};

	var updateList = function () {
		console.log("***** CALLING UPDATE LIST");
		SocketManager.sendTo("gameList", "GAME_LIST");
	};

	var listener = $scope.$on("socket:gameList:message", function (e, data) {
		console.log("Recieved a message: ", e, data);

		$timeout(function () {
			$scope.handleSocketMessage(e, data);
		});
	});

	console.log("Setting up onconn listener...");
	var onConnectListener = $scope.$on("socket:gameList:connect", function (e, data) {
		console.log("*** Gamelist conn!");
		updateList();
	});

	$scope.$on("$destroy", function () {
		listener();
		onConnectListener();
	});

	var init = function () {
		var gameListSocket = SocketManager.get("gameList");

		if (gameListSocket && gameListSocket.isConnected) {
			updateList();
		}
	};
	init();

})

.directive("gameList", function (){
	return {
    restrict: "E",
    controller: "gameListCtrl",
    scope: {
    	messageHandler: "="
    },
    // two bars in each graph
    templateUrl: "directives/gameList/gameList.tpl.html"
   };
})
