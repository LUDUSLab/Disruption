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
		game.load.spritesheet('hero1','assets/sprites/'+ _user.hero+'_96x128.png',96,128);
	}

	var tiles;

	var popup;
	var cards;
	var opts;

	var heros;
	var hero1;
	var hero2;

	var isPlay1Ready;
	var isPlay2Ready;
	var moves1;
	var moves2;
	var moves;

	function create()
	{
		background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
		background.anchor.set(0.5);

		cards 	= game.add.group();
		opts 	= game.add.group();

		tiles 	= [];
		moves1 	= [];
		moves2	= [];
		moves 	= [];

		createGrid();		
		createHeros();

		createPopup();

		moves2[0] = {type : 'walk', direction : {x:-1, y:0}};
		moves2[1] = {type : 'walk', direction : {x:0, y:1}};
		moves2[2] = {type : 'walk', direction : {x:0, y:1}};

		moves1[0] = {type : 'walk', direction : {x:1, y:0}};
		moves1[1] = {type : 'walk', direction : {x:0, y:0}};
		moves1[2] = {type : 'skill', skill : 0};

		mergeMoves();

		//game.add.tween(popup.scale).to({x:1,y:1},1000,Phaser.Easing.Elastic.Out, true);
		
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
			mergeMoves();
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

			card.move = 

			card.inputEnabled = true;
			card.events.onInputDown.add(clickCard, this);
		}

		cards.getChildAt(0).move = {type : 'walk', direction : {x:1, y:0}};//right
		cards.getChildAt(1).move = {type : 'walk', direction : {x:0, y:1}};//down
		cards.getChildAt(2).move = {type : 'walk', direction : {x:0, y:-1}};//up
		cards.getChildAt(3).move = {type : 'walk', direction : {x:-1, y:0}};//left

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
			row = [];
			//colunas
			for (j = 1; j <= 4; j++)
			{
				x = (game.world.width * 0) + (j * (128 + 32));
				y = (game.world.height * 0.25) + (i * (64 + 32));

				tile = game.add.sprite(x, y, 'tile');
				tile.anchor.set(0.5);
				tile.alpha = 0.8;
				row[j-1] = tile;
			}
			tiles[i-1] = row;
		}
	}

	function createHeros()
	{
		sprite = game.add.sprite(0,0,'hero1');
		sprite.x = tiles[1][0].x;
		sprite.y = tiles[1][0].y;
		sprite.anchor.set(0.5,0.75);

		hero1 = {x:1, y:2, sprite};

		sprite = game.add.sprite(0,0,'hero1');
		sprite.x = tiles[2][3].x;
		sprite.y = tiles[2][3].y;
		sprite.anchor.set(0.5,0.75);

		hero2 = {x:4, y:3, sprite};

		heros = {hero1,hero2};
	}

	function mergeMoves()
	{
		if(_user.turn == 1)
		{
			moves[0] = moves1[0]; moves[0].hero = 'hero1';
			moves[1] = moves2[0]; moves[1].hero = 'hero2';
			moves[2] = moves1[1]; moves[2].hero = 'hero1';
			moves[3] = moves2[1]; moves[3].hero = 'hero2';
			moves[4] = moves1[2]; moves[4].hero = 'hero1';
			moves[5] = moves2[2]; moves[5].hero = 'hero2';
		}
		else
		{
			moves[0] = moves2[0]; moves[0].hero = 'hero2';
			moves[1] = moves1[0]; moves[1].hero = 'hero1';
			moves[2] = moves2[1]; moves[2].hero = 'hero2';
			moves[3] = moves1[1]; moves[3].hero = 'hero1';
			moves[4] = moves2[2]; moves[4].hero = 'hero2';
			moves[5] = moves1[2]; moves[5].hero = 'hero1';
		}

		executionMoves();
	}

	function executionMoves()
	{
		if(moves.length == 0)
		{
			console.log('Fim round');
		}
		else
		{
			move = moves.shift();
			hero = heros[move.hero];

			switch(move.type)
			{
				case 'walk' :
					hero.x = move.direction.x + hero.x;
					hero.y = move.direction.y + hero.y;

					if(hero.x <= 0) hero.x = 1;
					if(hero.x >  4) hero.x = 4;

					if(hero.y <= 0) hero.y = 1;
					if(hero.y >  4) hero.y = 4;

					tile = tiles[hero.x - 1][hero.y - 1];

					tween = game.add.tween(hero.sprite).to({x : tile.x, y : tile.y},1000,Phaser.Easing.Linear.None,true);
					tween.onComplete.add(executionMoves, this);
				break;
				case 'skill' :
				listTiles = _heros.archer.skills[move.skill].tiles;
					for(i = 0; i < listTiles.length; i++)
					{
						tile = listTiles[i];

						x = hero.x + tile.x;
						y =	hero.y + tile.y;

						if((x <= 0)||(x >  4)||(y <= 0)||(y >  4)) continue;

						tiles[x-1][y-1].destroy();
					}
				break;
			}
		}
	}

	return {preload: preload, create: create, update: update};
};