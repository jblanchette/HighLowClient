angular.module("app.SocketManager", [])

.factory("SocketManager", function ($rootScope) {
	var _io;

	var sendTo = function (key, data) {
		// todo: send things to rooms not just the server
		_io.emit(key, data);
	};

	var emitMessage = function (key, data) {
		var message = {
			key: key,
			data: data
		};

		$rootScope.$broadcast("socket:message", message);
		console.log("Broadcasted: ", message);
	};

	var init = function () {
		if (!_io) {
			throw new Error("No Socket.IO instance found");
		}

		// todo: change this to be the generic message handler and broadcast the msg key with $broadcast

		_io.on("GAME_LIST", function (data) {
			emitMessage("GAME_LIST", data);
		});

		_io.on("JOIN_GAME", function (data) {
			emitMessage("JOIN_GAME", data);
		})

	};

	return {
		initalize: function (ioInstance) {
			_io = ioInstance;
			init();
		},
		sendTo: function (key, data) {
			sendTo(key, data);
		}
	};
});