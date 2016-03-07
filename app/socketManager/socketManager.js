angular.module("app.SocketManager", [])

.factory("SocketManager", function ($state, $rootScope, $log) {
	var sockets = {};

	function WSocket (options) {
		if (!_.has(options, "url") || !_.has(options, "id")) {
			throw new Error("WSocket missing url or id: " + options);
		}

		console.log("Making websocket: ", options);

		this.id = options.id;
		this.url = options.url;
		this.isConnected = false;
		this.handlers = options.handlers;
		this.onConnect = options.onConnect;
		this.instance = null;
	}

	WSocket.prototype.connect = function () {
		console.log("Connecting: ", this);
		if (!this.instance || this.instance && !this.instance.connected) {
			this.instance = io(this.url);	
			this.setupHandlers();
		}
	};

	WSocket.prototype.setupHandlers = function () {
		var self = this;

		self.instance.on("connect", function (socket) {
			if (_.isFunction(self.onConnect)) {
				self.onConnect(socket);
			}

			console.log("Emitting message on connect: socket:" + self.id + ":connect");
			$rootScope.$broadcast("socket:" + self.id + ":connect", "connected");
			self.isConnected = true;
		});

		console.log("Setting up handlers: ", this.handlers);
		_.each(this.handlers, function (handlerKey) {
			self.instance.on("disconnect", function (reason) {
				$log.warn("Server disconnected", reason);
				$state.go("login");
			});

			self.instance.on("UNAUTHORIZED", function (data) {
				$log.warn("Unauthorized user: ", data);
				$state.go("login");
			});

			self.instance.on(handlerKey, function (data) {
				console.log("GOT SOCKET HANDLER: ", self.id, handlerKey);
				
				emitMessage(self.id, handlerKey, data); 
			});
		});
	};

	WSocket.prototype.getSocketId = function () { 
		return this.instance.id;
	};

	WSocket.prototype.sendTo = function (key, data) {
		if (!this.instance) {
			console.error("Tried to send a message to a non-existing socket: ", this, key, data);
			return;
		}

		this.instance.emit(key, data);
	};

	var emitMessage = function (id, key, data) {
		var message = {
			key: key,
			data: data
		};

		if (!id || !_.has(sockets, id)) {
			return;
		}

		$rootScope.$broadcast("socket:" + id + ":message", message);
	};

	var get = function (id) {
		console.log("Getting: ", _.has(sockets, id) && sockets[id]);
		return _.has(sockets, id) && sockets[id];
	};

	var create = function (o) {
		if (!o.id || _.has(sockets, o.id)) {
			throw new Error("Tried to create a socket twice: " + o);
		}

		var wSocket = new WSocket(o);
		sockets[wSocket.id] = wSocket;

		return wSocket;
	};

	var sendTo = function (id, key, data) {
		var wSocket = get(id);

		console.log("sending: ", id, key, data);
		if (wSocket) {
			wSocket.sendTo(key, data);
		}
	};

	return {
		create: create,
		get: get,
		sendTo: sendTo
	};
});
