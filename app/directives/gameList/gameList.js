angular.module("app.gameList", ["app.SocketManager"])
.controller("gameListCtrl", function ($timeout, $scope, SocketManager) {
	console.log("Game list ctrl ran...");
	$scope.games = [];

	$scope.handleSocketMessage = function (message) {
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

		SocketManager.sendTo("JOIN_GAME", gameInfo);
	};

	var updateList = function () {
		console.log("Asking for game list...");
		SocketManager.sendTo("GAME_LIST");
	};

	updateList();

	$scope.$on("socket:message", function (event, data) {
		$timeout(function () {
			$scope.handleSocketMessage(data);
		});
	});

})

.directive("gameList", function (){
	return {
    restrict: "E",
    scope: true,
    controller: "gameListCtrl",
    // two bars in each graph
    templateUrl: "app/directives/gameList/gameList.tpl.html",
    link: function (scope, element, attrs) {
    	console.log("I linked!?");
    }
   };
})