var _link = (function()
{
	var socket  = io();
	var ready = false;
	var room;

	socket.on('join room', function(data)
	{
		room = data.room;

		if(data.player != socket.id)
		{
			ready = true;
			console.log(ready);
			data.player = socket.id;
			socket.emit('start game',data);
		}

		console.log(data);
	});

	socket.on('start game', function(data)
	{
		ready = true;
	});

	socket.on('send move', function(data)
	{

	});

	function sendMove(data)
	{
		socket.emit('send move',data);
	}

	function isReady()
	{
		return ready;
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
				isReady		: isReady
			};

})();