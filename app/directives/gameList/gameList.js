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
				if (message.data) {
					console.log("You joined game: ", message.data);
					$scope.modal.isOpen = false;

					gameManager.setGameInfo(message.data);
					$state.go("auth.game");
				}
			break;

			case "USER_JOINED":
				console.log("A user joined a game: ", message.data);
				updateGame(message.data);
			break;

			case "USER_LEFT":
				console.log("A user left a game: ", message.data);
				updateGame(message.data);
			break;

			case "GAME_STARTED":
				console.log("**** The game i'm in started!", message.data);
			break;
		}
	};

	var updateGame = function (newGame) {
		var gameIndex = _.findKey($scope.games, function (g) {
			return g.id === newGame.id;
		});

		if (!!gameIndex) {
			console.log("Updating game index: ", gameIndex);
			$scope.games[gameIndex] = newGame;
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

	var listener = $scope.$on("socket:gameList:message", function (e, data) {
		console.log("Recieved a message: ", e, data);

		$timeout(function () {
			$scope.handleSocketMessage(e, data);
		});
	});

	$scope.$on("$destroy", function () {
		listener();
	});

	var updateList = function () {
		SocketManager.sendTo("gameList", "GAME_LIST");
	};

	updateList();

})

.directive("gameList", function (){
	return {
    restrict: "E",
    controller: "gameListCtrl",
    scope: {
    	messageHandler: "="
    },
    // two bars in each graph
    templateUrl: "app/directives/gameList/gameList.tpl.html"
   };
})
