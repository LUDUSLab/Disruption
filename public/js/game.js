var GameState = function()
{
	
	function preload()
	{
		game.load.image('tile', '/assets/images/tile.png');
		game.load.image('background', '/assets/images/background.png');
		game.load.image('popup', '/assets/images/popup.png');
		game.load.image('card', '/assets/images/card.png');
		game.load.image('opt', '/assets/images/opt.png');
		game.load.spritesheet('confirm','assets/sprites/confirm_96x32.png',96,32);
	}

	var tiles;
	var popup;
	var cards;
	var opts;
	var isPlay1Ready;
	var isPlay2Ready;
	var moves1;
	var moves2;

	function create()
	{
		background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
		background.anchor.set(0.5);

		tiles 	= game.add.group();
		cards 	= game.add.group();
		opts 	= game.add.group();
		moves1 	= [];

		createGrid();
		createPopup();

		game.add.tween(popup.scale).to({x:1,y:1},1000,Phaser.Easing.Elastic.Out, true);
		
	}

	function update()
	{
		if(_link.isPackage)
		{
			_link.isPackage = false;
			moves2 = _link.getPackage();
			isPlay2Ready = true
		}

		if(isPlay1Ready && isPlay2Ready)
		{
			isPlay1Ready = false;
			isPlay2Ready = false;
			executionMoves();
		}
	}

	function createPopup()
	{
		popup = game.add.sprite(game.world.centerX, game.world.centerY, 'popup');
		popup.anchor.set(0.5);
		popup.alpha = 0.9;

		w = (popup.width / 2);
		h = (popup.height / 2);

		popup.addChild(opts);

		//1# card
		opt = opts.create(-32,h-17,'opt');
		opt.selected = false;
		opt.anchor.set(0.5);

		//2# card
		opt = opts.create(0,h-17,'opt');
		opt.selected = false;
		opt.anchor.set(0.5);

		//3# card
		opt = opts.create(32,h-17,'opt');
		opt.selected = false;
		opt.anchor.set(0.5);

		popup.addChild(cards);

		for(i = 1; i <= 4; i++)
		{
			x = - w + (i * (110 + 10)) ;
			y = - h + 90;

			card = cards.create(x,y,'card');
			card.anchor.set(0.5);

			card.move = i;

			card.inputEnabled = true;
			card.events.onInputDown.add(clickCard, this);
		}

		popup.scale.set(0);
	}

	function clickCard(card)
	{
		for(i = 0; i < 3; i++)
		{
			if(!opts.getChildAt(i).selected)
			{
				opt = opts.getChildAt(i);
				opt.selected = true;

				card.inputEnabled = false;

				moves1[i] = card.move;

				game.add.tween(card.scale).to({x:0.25,y:0.25},500,Phaser.Easing.Linear.None,true);
				game.add.tween(card).to({x:opt.x,y:opt.y},500,Phaser.Easing.Linear.None,true);

				break;
			}
		}
	}

	function createGrid()
	{
		var tile;
		var x;
		var y;
		//linhas
		for (i = 1; i <= 4; i++)
		{
			//colunas
			for (j = 1; j <= 4; j++)
			{
				x = (game.world.width * 0) + (j * (128 + 32));
				y = (game.world.height * 0.25) + (i * (64 + 32));

				tile = tiles.create( x, y, 'tile');
				tile.anchor.set(0.5);
				tile.alpha = 0.8;
			}
		}
	}

	function executionMoves()
	{

	}

	return {preload: preload, create: create, update: update};
};