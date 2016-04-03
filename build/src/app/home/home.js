angular.module("app.Home", ["app.Authentication", "app.SocketManager"])

.controller("HomeCtrl", function ($timeout, $state, $scope, authentication, SocketManager) { 
  var authUser = authentication.getUser();
  $scope.chatNamespace = "chat";
  $scope.gameListNamespace = "gameList";

  if (!authUser) {
    console.log("No authorized user, going back to login...");
  }

  // onStart handler for global chat
  $scope.setupGlobalChat = function () {
    var authUser = authentication.getUser();

    if (!$scope.currentRoom && authUser) {
      console.log("Asking server to put us in a global chat");
      SocketManager.sendTo($scope.chatNamespace, "JOIN_GLOBAL", authUser);
    } 
  };

  var init = function () {
    var gameList = SocketManager.get($scope.gameListNamespace);
    var chat = SocketManager.get($scope.chatNamespace);

    if (!gameList || !chat) {
      // todo: handle possible errors here.  maybe they dont support ws
      console.error("Error creating websockets.");
      return;
    }

    console.log("*** CONNECTING TO GAMELIST AND CHAT");
    gameList.connect();
    chat.connect();
  };

  init();

  $scope.$on("socket:" + $scope.chatNamespace + ":connect", function (e, data) {
    console.log("Chat connected!", data);
    $timeout(function () {
      $scope.setupGlobalChat();
    });
  });

  $scope.$on("$destroy", function () {

  });
});
