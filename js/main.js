var game = new Phaser.Game(800, 600, Phaser.AUTO, 'GAME', { preload: preload, create: create, update: update});

function preload()
{
	game.load.script('game', 'js/game.js');
};

function create()
{
	game.state.add('GameState', GameState);

	game.state.start('GameState');
};

function update()
{
	
};