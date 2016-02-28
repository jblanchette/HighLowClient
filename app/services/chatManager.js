angular.module("app.ChatManager", [
  "app.Authentication",
  "app.SocketManager"
])

.factory("chatManager", function ($log, SocketManager, authentication) {
  var chats = {};

  function ChatInstance () {
    this.id = _.uniqueId("chatInstance-");
    this.messageQueue = [];
    this.maxLineCount = 1500;

    var self = this;
    chats[self.id] = self;
  };

  ChatInstance.prototype.addMessage = function (message) {
    if (this.messageQueue.length > this.maxLineCount) {
      this.messageQueue.shift();
    }
    this.messageQueue.push(message);

    return this.messageQueue;
  };

  return {
    create: function () {
      return new ChatInstance();
    },
    globalChat: function (message) {
      // todo add a message to all chats
    }
  };
});
