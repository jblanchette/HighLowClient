angular.module("app.GameManager", [])

.factory("gameManager", function ($log) {
  var currentGame = null;
  var setGameInfo = function (game) {
    if (!game) {
      throw new Error("Invalid game provided to game manager");
    }

    currentGame = game;
    return currentGame;
  };

  var setGameAttr = function (attr, val) {
    if (!currentGame) {
      return;
    }

    currentGame[attr] = val;
  };

  var getCurrentGame = function () {
    return currentGame;
  };

  return {
    setGameInfo: setGameInfo,
    getCurrentGame: getCurrentGame
  };
});
