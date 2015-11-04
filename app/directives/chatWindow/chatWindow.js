angular.module("app.chatWindow", ["app.SocketManager"])

.controller("chatWindowCtrl", function ($scope, SocketManager) {
  var members = {};
  $scope.chatForm = {
    input: ""
  };

  var listener = $scope.$on("socket:" + $scope.nsp + ":message", function (e, data) {
    $scope.handleSocketMessage(e, data);
  });

  $scope.sendMessage = function () {
    console.log("Sending message: ", $scope.chatForm.input);
  };

  $scope.newMessage = function (message) {
    console.log("Called new message?");
    $scope.addMessage(message.author + ": " + message.text);
  };

  $scope.handleSocketMessage = function (e, message) {
    console.log("Got chat msg: ", e, message);

    switch (message.key) {
      case "NEW_MSG":
        $scope.newMessage(message.data);
      break;
      case "USER_JOINED":
        $scope.userJoined(message.data);
      break;
      case "USER_LEFT":
        $scope.userLeft(message.data);
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
