var GameState = {preload: preload, create: create, update: update}

function preload()
{
	game.load.image('tile', 'assets/tile.png');
}

function create()
{
	var tiles = game.add.group();
	var tile;
	var tileCount = 10;

	//tile = game.add.sprite(0, 0, 'tile', 0);
	
	for (var i = tileCount - 1; i >= 0; i--)
	{
		for (var j = tileCount - 1; j >= 0; j--)
		{
			tile = tiles.create(64 * i, 64 * j, 'tile');
			tile.anchor.set(0, 0);	
		}
	}
}	

function update()
{
	
}