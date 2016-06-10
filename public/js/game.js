var GameState = function()
{

	function preload()
	{
		game.load.image('tile', '/assets/images/tile.png');
		game.load.image('background', '/assets/images/background.png');
		game.load.image('popup', '/assets/images/popup.png');
		game.load.image('opt', '/assets/images/opt.png');
		game.load.spritesheet('hero1', '/assets/sprites/steve_500x500.png',500,500);
		game.load.spritesheet('hero2', '/assets/sprites/dcat_500x500.png',500,500);
		game.load.spritesheet('cardsMoves', '/assets/sprites/cards_110x165.png',110,165);
		game.load.spritesheet('confirm','assets/sprites/confirm_96x32.png',96,32);
		game.load.spritesheet('torch','assets/sprites/torch_13x55.png',13,55);
		game.load.spritesheet('cardsSkill','assets/sprites/cards_'+_user.hero+'_110x165.png',110,165);
		game.load.audio('BGMGame', 'assets/audios/BGM/_vgti by _jm.mp3');
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
		console.log(_user.turn);
		background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
		background.anchor.set(0.5);

		x = game.world.centerX + 100;
		y = game.world.height * 0.30;
		torch = game.add.sprite(x,y,'torch');
		torch.anchor.set(0.5);
		torch.animations.add('idle',[0,1],10,true);
		torch.animations.play('idle');

		x = game.world.centerX - 100;
		y = game.world.height * 0.30;
		torch = game.add.sprite(x,y,'torch');
		torch.anchor.set(0.5);
		torch.animations.add('idle',[0,1],10,true);
		torch.animations.play('idle');

		cards 	= game.add.group();
		opts 	= game.add.group();

		tiles 	= [];
		moves1 	= [];
		moves2	= [];
		moves 	= [];

		createGrid();		
		createHeros();

		createPopup();

		openPopup();

		audio = game.add.audio('BGMGame');
		audio.play('',0,1,true);
		
	}

	function update()
	{
		if(_link.isPackage())
		{
			_link.setPackage(false);
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

	function openPopup()
	{
		opts.setAllChildren('selected',false);
		game.add.tween(popup.scale).to({x:1,y:1},1000,Phaser.Easing.Elastic.Out, true);
	}

	function createPopup()
	{
		popup = game.add.sprite(game.world.centerX, game.world.centerY, 'popup');
		popup.anchor.set(0.5);
		popup.alpha = 0.9;
		popup.z = 10;

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
			x = - w + (i * (110 + 10));
			y = - h + 90;

			card = cards.create(x,y,'cardsMoves',i-1);
			card.origin = {x:x,y:y};
			card.anchor.set(0.5);

			card.inputEnabled = true;
			card.events.onInputDown.add(clickCard, this);
		}

		cards.getChildAt(0).move = {type : 'walk', direction : {x:0, y:1}};//right
		cards.getChildAt(1).move = {type : 'walk', direction : {x:1, y:0}};//down
		cards.getChildAt(2).move = {type : 'walk', direction : {x:-1, y:0}};//up
		cards.getChildAt(3).move = {type : 'walk', direction : {x:0, y:-1}};//left

		for(i = 1; i <= 4; i++)
		{
			x = - w + (i * (110 + 10));
			y = - h + 300;

			card = cards.create(x,y,'cardsSkill',i-1);
			card.origin = {x:x,y:y};
			card.anchor.set(0.5);

			card.inputEnabled = true;
			card.events.onInputDown.add(clickCard, this);
		}

		cards.getChildAt(4).move = {type : 'skill', direction : 'right', name : _user.hero, skill : 0};
		cards.getChildAt(5).move = {type : 'skill', direction : 'right', name : _user.hero, skill : 1};
		cards.getChildAt(6).move = {type : 'skill', direction : 'right', name : _user.hero, skill : 2};
		cards.getChildAt(7).move = {type : 'skill', direction : 'right', name : _user.hero, skill : 3};

		confirm = game.add.button(w-50, h-50, 'confirm', confirm, this, 0, 1, 2);
		confirm.anchor.set(0.5);

		popup.addChild(confirm);

		popup.scale.set(0);
	}

	function confirm()
	{
		if(opts.getChildAt(2).selected)
		{
			popup.scale.set(0);
			isPlay1Ready = true;

			for(i = 0; i < cards.length; i++)
			{
				card = cards.getChildAt(i);
				card.x = card.origin.x;
				card.y = card.origin.y;
				card.inputEnabled = true;
				card.scale.set(1);
			}

			_link.sendMove(moves1);
		}
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

				game.add.tween(card.scale).to({x:0.25,y:0.25}, Phaser.Timer.SECOND * 0.5, Phaser.Easing.Linear.None, true);
				game.add.tween(card).to({x:opt.x,y:opt.y}, Phaser.Timer.SECOND * 0.5, Phaser.Easing.Linear.None, true);

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
				tile.z = 0;
				row[j-1] = tile;
			}
			tiles[i-1] = row;
		}
	}

	function createHeros()
	{
		x = tiles[1][0].x;
		y = tiles[1][0].y;
		sprite = game.add.sprite(x,y,'hero1');
		sprite.scale.setTo(0.5,0.5);
		sprite.anchor.set(0.5,0.75);
		sprite.z = 2;
		sprite.animations.add('idle',[0],10,true);
		//sprite.animations.add('walk',[4,5,6,7],10,true);
		sprite.animations.add('skill',[1],10,false);
		sprite.animations.add('damage',[0,2,0,2,0,2,0,2,0],10,false);
		sprite.animations.play('idle');
		hero1 = {x:2, y:1, sprite};

		x = tiles[2][3].x;
		y = tiles[2][3].y;
		sprite = game.add.sprite(x,y,'hero2');
		sprite.scale.setTo(0.5,0.5);
		sprite.anchor.set(0.5,0.75);
		sprite.z = 3;
		sprite.animations.add('idle',[0],10,true);
		//sprite.animations.add('walk',[4,5,6,7],10,true);
		sprite.animations.add('skill',[1],10,false);
		sprite.animations.add('damage',[0,2,0,2,0,2,0,2,0],10,false);
		sprite.animations.play('idle');
		hero2 = {x:3, y:4, sprite};

		if(_user.turn == 2)
		{
			aux = hero1;
			hero1 = hero2;
			hero2 = aux
		}

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
		hero1.sprite.animations.play('idle');
		hero2.sprite.animations.play('idle');
		
		for(i = 0; i < tiles.length; i++)
		{
			tiles[i].tint = 0xffffff;
			console.log(tiles[i]);
		}

		if(moves.length == 0)
		{
			openPopup();
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

					
					//hero.sprite.animations.play('walk');

					tile = tiles[hero.x - 1][hero.y - 1];

					game.add.tween(hero.sprite).to({z : hero.x}, Phaser.Timer.SECOND * 1, Phaser.Easing.Linear.None,true);

					tween = game.add.tween(hero.sprite).to({x : tile.x, y : tile.y},Phaser.Timer.SECOND * 1,Phaser.Easing.Linear.None,true);
					tween.onComplete.add(executionMoves, this);
				break;
				case 'skill' :
					listTiles = _heros[move.name].skills[move.skill].tiles;
					for(i = 0; i < listTiles.length; i++)
					{
						tile = listTiles[i];

						x = hero.x + tile.x;
						y =	hero.y + tile.y;

						if((x <= 0)||(x >  4)||(y <= 0)||(y >  4)) continue;
						

						tiles[x-1][y-1].tint = 0xff0000;

						if(hero1.x == x && hero1.y == y)
						{
							damageHero('hero1');
						}

						if(hero2.x == x && hero2.y == y)
						{
							damageHero('hero2');
						}
					}
					hero.sprite.animations.play('skill');

					game.time.events.add(Phaser.Timer.SECOND * 2, executionMoves, this);
				break;
			}
		}
	}

	function damageHero(hero)
	{
		heros[hero].sprite.animations.play('damage');
	}

	return {preload: preload, create: create, update: update};
};