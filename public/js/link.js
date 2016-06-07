var _link = (function()
{
	var socket  = io();
	var isReady = false;
	var isPackage = false;
	var package;
	var room;

	socket.on('join room', function(data)
	{

		room = data.room;
		if(data.player != socket.id)
		{
			isReady = true;
			data.player = socket.id;
			socket.emit('start game',data);
		}

	});

	socket.on('start game', function(data)
	{
		isReady = true;
	});

	socket.on('send move', function(data)
	{
		isPackage = true;
		package = data;
	});

	function getPackage()
	{
		isPackage = false;
		return aux;
	}

	function sendMove(data)
	{
		data.room = room;
		socket.emit('send move',data);
	}

	function requestRoom()
	{
		var data = 	{
						player : socket.id
				 	};

		data.player = 'teste';
		socket.emit('request room',data);
	}

	return	{
				sendMove    : sendMove,
				requestRoom	: requestRoom,
				isReady		: isReady,
				isPackage	: isPackage,
				getPackage	: getPackage
			};

})();