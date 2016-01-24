angular.module("app.chatWindow", [
  "app.SocketManager",
  "app.Authentication"
])

.controller("chatWindowCtrl", function ($timeout, $scope, SocketManager, authentication) {
  $scope.currentRoom = null;
  $scope.chatForm = {
    input: ""
  };

  console.log("Chat nsp: ", $scope.nsp);

  var listener = $scope.$on("socket:" + $scope.nsp + ":message", function (e, data) {
    $timeout(function () {
      $scope.handleSocketMessage(e, data);
    });
  });

  $scope.sendMessage = function () {
    console.log("Sending message: ", $scope.chatForm.input);
    var message = $scope.chatForm.input || "";
    SocketManager.sendToRoom("chat", $scope.nsp, "ROOM_MSG", { id: $scope.currentRoom.id, message: message });
    $scope.chatForm.input = "";
  };

  $scope.newMessage = function (message) {
    console.log("Called new message?", message);
    $scope.addMessage(message);
  };

  $scope.handleSocketMessage = function (e, message) {
    console.log("Got chat msg: ", e, message);

    switch (message.key) {
      case "ROOM_MSG":
        $scope.newMessage(message.data);
      break;
      case "USER_JOINED":
        $scope.addMessage({
          authorId: -1,
          author: "Server",
          message: "Other user joined: " + JSON.stringify(message.data)
        });
      break;
      case "USER_LEFT":
        $scope.userLeft(message.data);
      break;
      case "JOIN_GLOBAL":
        
        $scope.currentRoom = message.data;
        console.log("*** about to add room msg: ", message.data);
        $scope.addMessage({
          authorId: -1,
          author: "Server",
          message: "You joined: " + JSON.stringify(message.data)
        });
        
      break;
      default:
        console.log("Got some non handled message: ", message.data);
      break;
    }
  };

  //$scope.newMessage({ author: "Jeef", text: "Testing! Hello World! <b>woo</b>" });

  $scope.$on("$destroy", function () {
    listener();
  });
})

.directive("chatWindow", function (SocketManager, authentication) {
  return {
    restrict: "E",
    scope: {
      nsp: "@"
    },
    controller: "chatWindowCtrl",
    // two bars in each graph
    templateUrl: "app/directives/chatWindow/chatWindow.tpl.html",
    link: function (scope, element, attrs) {
      var el = angular.element(element);
      scope.messageQueue = [];
      scope.maxLineCount = 20;

      console.log("*** RUNNING CHAT WINDOW LINK ***");

      if (!scope.currentRoom && scope.nsp === "chat") {
        var authUser = authentication.getUser();
        if (authUser) {
          console.log("Asking server to put us in a global chat");
          SocketManager.sendToRoom(scope.nsp, scope.nsp, "JOIN_GLOBAL", authUser);
        }
      }

      scope.addMessage = function (message) {
        console.log("Adding msg: ", message);
        if (scope.messageQueue.length > scope.maxLineCount) {
          scope.messageQueue.shift();
        }

        scope.messageQueue.push(message);
      };
    }
  };
});
