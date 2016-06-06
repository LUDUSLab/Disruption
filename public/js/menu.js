var MenuState = function()
{

	function preload()
	{
		game.load.image('splash', '/assets/images/splash.png');
		game.load.spritesheet('start', '/assets/sprites/start_200x75.png',200,75);
	}

	function create()
	{
		button = game.add.button(game.world.width * 0.5, game.world.height * 0.75, 'start', start, this, 0, 1, 2);
		button.anchor.set(0.5);
	}

	function update()
	{
		
	}

	function start()
	{
		game.state.start('LoadState');
	}

	return {preload: preload, create:create, update:update};
};