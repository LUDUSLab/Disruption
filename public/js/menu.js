var MenuState = function()
{

	function preload()
	{
		game.load.image('splash', '/assets/images/splash.png');
		game.load.spritesheet('start', '/assets/sprites/start_200x75.png',200,75);
		game.load.audio('BGMMenu', 'assets/audios/BGM/Path to Nowhere by anvil.ogg');
	}
	var audio;
	function create()
	{
		button = game.add.button(game.world.width * 0.5, game.world.height * 0.75, 'start', start, this, 0, 1, 2);
		button.anchor.set(0.5);

		audio = game.add.audio('BGMMenu');
		audio.play("",0,1,true);
	}

	function update()
	{
		
	}

	function start()
	{
		audio.stop();
		game.state.start('LoadState');
	}

	return {preload: preload, create:create, update:update};
};