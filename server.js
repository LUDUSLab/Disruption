app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended : true })); // support encoded bodies

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res)
{
	res.sendFile( __dirname + '/index.html');
});

var rooms = 
{
	avaliable : []
}


io.on('connection', function(socket)
{

	console.log("Novo Jogador conectado "+socket.id);

	socket.on('request room', function(data)
	{
		var room = rooms['avaliable'].shift();

		if(!room)
		{
			room = new Date().getTime().toString();
			rooms['avaliable'].push(room);
			console.log("Nova sala criada "+room);
		}

		socket.join(room);
		console.log("Jogador "+socket.id+" conectou na sala "+room);

		data.room = room;

		socket.to(room).emit('join room',data);
	});

	socket.on('start game', function(data)
	{
		socket.to(data.room).emit('start game',data);
	});

	socket.on('send move', function(data)
	{
		socket.to(data.room).emit('send move',data);
	});

	socket.on('disconnect', function(msg)
	{

	});

});

http.listen(3000, function()
{
		console.log('listening on 3000');
});
