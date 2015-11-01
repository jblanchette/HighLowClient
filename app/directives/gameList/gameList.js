angular.module("app.gameList", ["app.SocketManager"])
.controller("gameListCtrl", function ($timeout, $scope, SocketManager) {
	$scope.games = [];	

	$scope.handleSocketMessage = function (e, message) {
		console.log("Handling socket msg: ", e, message);
		switch(message.key) {
			case "GAME_LIST":
				$scope.games = message.data;
			break;
			case "JOIN_GAME":
				if (message.data) {
					console.log("You joined game: ", message.data);
					updateList();	
				} else {
					console.log("Can't join this game");
				}
			break;
		}
	};

	$scope.joinGame = function (gameId) {
		var gameInfo = {
			gameId: gameId,
			member: {
				id: 1,
				name: "Jeef",
				mvp: true // dats right
			}
		};

		console.log("Joining game...", gameInfo);

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
		console.log("Asking for game list...asdf");
		SocketManager.sendTo("gameList", "GAME_LIST");
	};

	updateList();

})

.directive("gameList", function (){
	return {
    restrict: "E",
    scope: true,
    controller: "gameListCtrl",
    // two bars in each graph
    templateUrl: "app/directives/gameList/gameList.tpl.html"
   };
})
