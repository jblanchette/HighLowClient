angular.module("app.chatWindow", [
  "app.ChatManager",
  "app.SocketManager",
  "app.Authentication"
])

.controller("chatWindowCtrl", function ($timeout, $scope, SocketManager, authentication) {
  var listener = $scope.$on("socket:" + $scope.nsp + ":message", function (e, data) {
    $timeout(function () {
      $scope.handleSocketMessage(e, data);
    });
  });

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

  $scope.$on("$destroy", function () {
    listener();
  });
})

.directive("chatWindow", function (SocketManager, chatManager, authentication) {
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

      var init = function () {
        scope.messageQueue = [];
        scope.currentRoom = null;
        scope.chatForm = {
          input: ""
        };

        scope.instance = chatManager.create();
      };
      init();
      
      scope.addMessage = function (message) {
        scope.messageQueue = scope.instance.addMessage(message);
      };

      scope.sendMessage = function () {
        var message = scope.chatForm.input || "";
        if (!scope.currentRoom) {
          return;
        }

        var msgObj = { 
          id: scope.currentRoom.id, 
          message: message 
        };

        console.log("Sending message: ", msgObj);
        SocketManager.sendTo(scope.nsp, "ROOM_MSG", msgObj);
        scope.clearInput();
      };

      scope.newMessage = function (message) {
        scope.addMessage(message);
      };

      scope.clearInput = function () {
        scope.chatForm.input = "";
      };
    }
  };
});
