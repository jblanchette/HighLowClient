angular.module("app.chatWindow", [
  "app.ChatManager",
  "app.SocketManager",
  "app.Authentication"
])

.controller("chatWindowCtrl", function ($timeout, $scope, SocketManager, authentication) {
  
  if ($scope.nsp) {
    var listener = $scope.$on("socket:" + $scope.nsp + ":message", function (e, data) {
      $timeout(function () {
        $scope.handleSocketMessage(e, data);
      });
    });

    $scope.$on("$destroy", function () {
      listener();
    });
  }

  $scope.joinRoom = function (room) {
    console.log("**** setting chat room", room);
    $scope.currentRoom = room;
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
          message: "Other user joined: " + message.data.focus.nickname
        });
      break;
      case "USER_LEFT":
        $scope.addMessage({
          authorId: -1,
          author: "Server",
          message: "Other user left: " + message.data.focus.nickname
        });
      break;
      case "JOIN_GLOBAL":
      case "JOIN_ROOM":
        $scope.currentRoom = message.data;
        console.log("*** about to add room msg: ", message.data);
        $scope.addMessage({
          authorId: -1,
          author: "Server",
          message: "You joined: " + JSON.stringify(message.data)
        });
      break;
      default:
        console.log("Got some non handled message: ", message.key, message.data);
      break;
    }
  };
})

.directive("chatWindow", function ($timeout, SocketManager, chatManager, authentication) {
  return {
    restrict: "E",
    scope: {
      nsp: "@",
      handler: "=?"
    },
    controller: "chatWindowCtrl",
    // two bars in each graph
    templateUrl: "app/directives/chatWindow/chatWindow.tpl.html",
    link: function (scope, element, attrs) {
      var el = angular.element(element);
      var pageDivs = el.find("div");
      var scrollElement = _.find(pageDivs, { id: "chat-scroll" });

      scope.scrollToBottom = function () {
        if (scrollElement) {
          $timeout(function () {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          });
        }
      };

      scope.addMessage = function (message) {
        scope.messageQueue = scope.instance.addMessage(message);
        scope.scrollToBottom();
      };

      scope.sendMessage = function () {
        console.log("Sending message?");

        var message = scope.chatForm.input || "";
        if (!scope.currentRoom) {
          console.log("No room?");
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

      var init = function () {
        scope.messageQueue = [];
        scope.currentRoom = null;
        scope.chatForm = {
          input: ""
        };
        scope.instance = chatManager.create();

        if (_.isFunction(scope.handler)) {
          console.log("Runing chat handler");
          scope.handler(scope);
        }
      };
      init();
    }
  };
});
