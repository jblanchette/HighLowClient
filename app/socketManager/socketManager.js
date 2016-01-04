angular.module("app.SocketManager", [])

.factory("SocketManager", function ($rootScope) {
	var sockets = {};

	function WSocket (options) {
		if (!_.has(options, "url") || !_.has(options, "id")) {
			throw new Error("WSocket missing url or id: " + options);
		}

		this.id = options.id;
		this.url = options.url;
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
			console.log("Socket connected: ", self.id);

			if (_.isFunction(self.onConnect)) {
				self.onConnect(socket);
			}
		});

		_.each(this.handlers, function (handlerKey) {
			self.instance.on(handlerKey, function (data) { 
				emitMessage(self.id, handlerKey, data); 
			});
		});
	};

	WSocket.prototype.getSocketId = function () { 
		return this.instance.id;
	};

	WSocket.prototype.sendTo = function (key, data) {
		this.instance.emit(key, data);
	};

	WSocket.prototype.sendToRoom = function (room, key, data) {
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
		return _.find(sockets, { id: id });
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

	var sendToRoom = function (id, room, key, data) {
		var wSocket = get(id);

		console.log("sending to room: ", id, room, key, data);
		if (wSocket) {
			console.log("Wsocket: ", wSocket);
			wSocket.sendToRoom(room, key, data);
		}
	};

	return {
		create: create,
		get: get,
		sendTo: sendTo,
		sendToRoom: sendToRoom
	};
});
