angular.module("app.chatWindow", ["app.SocketManager"])

.controller("chatWindowCtrl", function ($scope, SocketManager) {
  var members = {};
  $scope.chatForm = {
    input: ""
  };

  console.log("Chat nsp: ", $scope.nsp);

  var listener = $scope.$on("socket:" + $scope.nsp + ":message", function (e, data) {
    $scope.handleSocketMessage(e, data);
  });

  $scope.sendMessage = function () {
    console.log("Sending message: ", $scope.chatForm.input);
    var message = $scope.chatForm.input || "";
    SocketManager.sendToRoom("chat", $scope.roomId, "ROOM_MSG", { message: message });
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
        $scope.userJoined(message.data);
      break;
      case "USER_LEFT":
        $scope.userLeft(message.data);
      break;
      case "JOIN_GLOBAL":
        var room = message.data;

        console.log("Sending test chat message to global...");
        SocketManager.sendToRoom("chat", room.id, "ROOM_MSG", { 
          memberId: SocketManager.get("chat").getSocketId(), 
          roomId: room.id, 
          message: "hello world!" 
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

.directive("chatWindow", function ($compile) {
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

      scope.addMessage = function (message) {
        var msgEl = angular.element("<div class='chat-message'>" + message + "</div>");
        $compile(msgEl)(scope);
        el.append(msgEl);
      };
    }
  };
});
