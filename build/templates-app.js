angular.module('templates-app', ['auth.tpl.html', 'directives/chatWindow/chatWindow.tpl.html', 'directives/gameList/gameList.tpl.html', 'game/game.tpl.html', 'home/home.tpl.html', 'login/login.tpl.html']);

angular.module("auth.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("auth.tpl.html",
    "<div class=\"authenticated-wrapper\">\n" +
    "  <ui-view></ui-view>\n" +
    "</div>\n" +
    "");
}]);

angular.module("directives/chatWindow/chatWindow.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/chatWindow/chatWindow.tpl.html",
    "<div class=\"chat-window-wrapper\">\n" +
    "  <div class=\"chat-members\"></div>\n" +
    "  <div class=\"chat-messages\" id=\"chat-scroll\">\n" +
    "    <div ng-repeat=\"message in messageQueue\" class=\"chat-message\">\n" +
    "      <strong>[{{message.author }}]:</strong> {{ message.message }}\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"chat-input-wrapper\">\n" +
    "    <input type=\"text\" name=\"chatInput\" ng-model=\"chatForm.input\">\n" +
    "    <button class=\"button-send\" ng-click=\"sendMessage()\">Send</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("directives/gameList/gameList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/gameList/gameList.tpl.html",
    "<header><h3>Game List</h3></header>\n" +
    "<ul>\n" +
    "	<li ng-repeat=\"game in games\" ng-click=\"joinGame(game.id)\">\n" +
    "		<div class=\"game-info\">\n" +
    "			{{ game.gameName }} - {{ game.members.length }} / {{ game.maxPlayerCount }}\n" +
    "		</div>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "\n" +
    "<div class=\"modal-overlay\" ng-show=\"modal.isOpen\">\n" +
    "  <div class=\"modal-header\">\n" +
    "    {{ modal.header }}\n" +
    "  </div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    {{ modal.body }}\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("game/game.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("game/game.tpl.html",
    "<div class=\"game\">\n" +
    "  <div class=\"game-content\">\n" +
    "    <div class=\"banner\">\n" +
    "      <h3>Game Name: {{ currentGame.gameName }}</h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"game-area\">\n" +
    "      <div class=\"game-content\">\n" +
    "        <div class=\"members\">    \n" +
    "          <span>Members:</span>\n" +
    "          <ul>\n" +
    "            <li ng-repeat=\"member in currentGame.members\">\n" +
    "              {{ member.id }}: {{ member.nickname }}\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"table\">\n" +
    "          #Table: cards that are in play, scoreboard\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"player-area\">\n" +
    "          #Player-Area:  cards, bidding controls\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"controls\">\n" +
    "      <button\n" +
    "        type=\"button\"\n" +
    "        ng-show=\"currentGame.isHost\"\n" +
    "        ng-click=\"startGame()\">\n" +
    "        Start Game\n" +
    "      </button>\n" +
    "      <button\n" +
    "        type=\"button\"\n" +
    "        ng-show=\"!currentGame.isHost\"\n" +
    "        ng-disabled=\"currentGame.isReady\"\n" +
    "        ng-click=\"setReadyState(true)\">\n" +
    "        Ready up\n" +
    "      </button>\n" +
    "\n" +
    "      <button\n" +
    "        type=\"button\"\n" +
    "        ng-click=\"setReadyState(false)\">\n" +
    "        Busy\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"chat-toggle-wrapper\">\n" +
    "      <chat-window \n" +
    "        nsp=\"gameList\" \n" +
    "        class=\"game-chat\" \n" +
    "        ng-show=\"chatOpen\"\n" +
    "        handler=\"chatHandler\">\n" +
    "      </chat-window>\n" +
    "\n" +
    "      <div class=\"chat-toggle-area\" ng-click=\"toggleChat()\">\n" +
    "        Chat Toggle\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<div class=\"home\">\n" +
    "	<div class=\"game-list-wrapper\">\n" +
    "		<game-list message-handler=\"gameListHandler\"></game-list>\n" +
    "	</div>\n" +
    "\n" +
    "  <chat-window \n" +
    "    class=\"global-chat\"\n" +
    "    nsp=\"chat\">\n" +
    "  </chat-window>\n" +
    "</div>\n" +
    "");
}]);

angular.module("login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/login.tpl.html",
    "<div class=\"login-wrapper\">\n" +
    "  <div class=\"login-header\">Login to HighLow</div>\n" +
    "  <form name=\"login\">\n" +
    "    <div class=\"login-field\">\n" +
    "      <input type=\"text\" name=\"username\" ng-model=\"loginData.username\" placeholder=\"Username\">\n" +
    "    </div>\n" +
    "    <div class=\"login-field\">\n" +
    "      <input type=\"password\" name=\"password\" ng-model=\"loginData.password\" placeholder=\"Password\">\n" +
    "    </div>\n" +
    "    <div class=\"login-field\">\n" +
    "      <button ng-click=\"loginUser()\">Login</button>\n" +
    "    </div>\n" +
    "    <div class=\"login-field\">\n" +
    "      <button ng-click=\"register()\">Register</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "");
}]);
