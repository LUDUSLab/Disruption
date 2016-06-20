var GameState = function()
{

	function preload()
	{
		game.load.image('background', '/assets/images/background.png');
		game.load.image('popup', '/assets/images/popup.png');
		game.load.image('opt', '/assets/images/opt.png');
		game.load.image('life', '/assets/images/life.png');
		game.load.spritesheet('tile', '/assets/sprites/tile_128x64.png', 128, 64);
		game.load.spritesheet('hero1', '/assets/sprites/steve_500x500.png',500,500);
		game.load.spritesheet('hero2', '/assets/sprites/dcat_500x500.png',500,500);
		game.load.spritesheet('cardsMoves', '/assets/sprites/cards_110x165.png',110,165);
		game.load.spritesheet('confirm','assets/sprites/confirm_96x32.png',96,32);
		game.load.spritesheet('torch','assets/sprites/torch_13x55.png',13,55);
		game.load.spritesheet('cardsSkill','assets/sprites/cards_'+_user.hero+'_110x165.png',110,165);
		game.load.spritesheet('directions','assets/sprites/directions_32x32.png',32,32);
		game.load.audio('BGMGame', 'assets/audios/BGM/_vgti by _jm.mp3');
	}

	var lifeBar1;
	var lifeBar2;

	var life1;
	var life2;

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

	var arrows;

	function create()
	{
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
		arrows	= game.add.group();

		tiles 	= [];
		moves1 	= [];
		moves2	= [];
		moves 	= [];

		createHud();

		createGrid();		
		createHeros();

		createPopup();

		openPopup();

		//audio = game.add.audio('BGMGame');
		//audio.play('',0,1,true);
		
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

		lifeBar1.updateCrop();
		lifeBar2.updateCrop();
	}

	function openPopup()
	{
		opts.setAllChildren('selected',false);
		game.add.tween(popup.scale).to({x:1,y:1},Phaser.Timer.SECOND * 1,Phaser.Easing.Elastic.Out, true);
	}

	function createHud()
	{
		lifeBar1 = game.add.sprite(20 , 20, 'life');
		lifeBar1.anchor.set(0,0.5);
		life1 = 100;

		cropRect = new Phaser.Rectangle(0, 0, 0, lifeBar1.height);

		game.add.tween(cropRect).to( { width: lifeBar1.width }, Phaser.Timer.SECOND * 3,  Phaser.Easing.Linear.None, true);

    	lifeBar1.crop(cropRect);

    	lifeBar2 = game.add.sprite(game.world.width - 20 ,20, 'life');
		lifeBar2.anchor.set(1,0.5);
		life2 = 100;

		cropRect = new Phaser.Rectangle(0, 0, 0, lifeBar2.height);

		game.add.tween(cropRect).to( { width: lifeBar2.width }, Phaser.Timer.SECOND * 3,  Phaser.Easing.Linear.None, true);

    	lifeBar2.crop(cropRect);

    	if(_user.turn == 2)
    	{
    		aux = lifeBar1;
    		lifeBar1 = lifeBar2;
    		lifeBar2 = aux;

    		aux = life1;
    		life1 = life2;
    		life2 = aux;
    	}
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

		for(i = 0; i < 4; i++)
		{
			x = - w + ((i+1) * (110 + 10));
			y = - h + 90;

			card = cards.create(x,y,'cardsMoves',i);
			card.origin = {x:x,y:y};
			card.anchor.set(0.5);

			card.inputEnabled = true;
			card.events.onInputDown.add(clickCard, this);
		}

		cards.getChildAt(0).move = {type : 'walk', direction : {x:0, y:1}};//right
		cards.getChildAt(1).move = {type : 'walk', direction : {x:1, y:0}};//down
		cards.getChildAt(2).move = {type : 'walk', direction : {x:-1, y:0}};//up
		cards.getChildAt(3).move = {type : 'walk', direction : {x:0, y:-1}};//left

		for(i = 0; i < 4; i++)
		{
			x = - w + ((i + 1)* (110 + 10));
			y = - h + 300;

			card = cards.create(x,y,'cardsSkill',i);
			card.origin = {x:x,y:y};
			card.anchor.set(0.5);

			aux = (i * 2);
			card.animations.add('idle',[aux,aux+1],10,true);
			card.animations.play('idle');

			card.inputEnabled = true;
			card.events.onInputDown.add(clickCard, this);
			card.input.priorityID = 0;
		}

		cards.getChildAt(4).move = {type : 'skill', direction : 'right', name : _user.hero, skill : 0};
		cards.getChildAt(5).move = {type : 'skill', direction : 'right', name : _user.hero, skill : 1};
		cards.getChildAt(6).move = {type : 'skill', direction : 'right', name : _user.hero, skill : 2};
		cards.getChildAt(7).move = {type : 'skill', direction : 'right', name : _user.hero, skill : 3};

		confirm = game.add.button(w-50, h-50, 'confirm', confirm, this, 0, 1, 2);
		confirm.anchor.set(0.5);

		popup.addChild(confirm);

		popup.addChild(arrows);
	
		arrows.x = 0;
		arrows.y = 0;

		arrow = arrows.create(32,0, 'directions',0);
		arrow.direction = 'right';
		arrow.inputEnabled = true;
		arrow.input.priorityID = 1;
		arrow.anchor.set(0.5);
		
		arrow = arrows.create(0,32, 'directions',1);
		arrow.direction = 'down';
		arrow.inputEnabled = true;
		arrow.input.priorityID = 1;
		arrow.anchor.set(0.5);

		arrow = arrows.create(0,-32, 'directions',2);
		arrow.direction = 'up';
		arrow.inputEnabled = true;
		arrow.input.priorityID = 1;
		arrow.anchor.set(0.5);

		arrow = arrows.create(-32,0, 'directions',3);
		arrow.direction = 'left';
		arrow.inputEnabled = true;
		arrow.input.priorityID = 1;
		arrow.anchor.set(0.5);

		arrows.scale.set(0);

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
		console.log("aff");
		if(card.move.type == 'walk')
		{
			selectCard(null,null,card);
		}
		else
		{
			arrows.scale.set(1);
			arrows.x = card.x;
			arrows.y = card.y;
			arrows.callAll('events.onInputDown.removeAll','events.onInputDown');

			for(i = 0; i < 4; i++)
			{
				arrow = arrows.getChildAt(i);
				arrow.events.onInputDown.add(selectCard, this, 1, card);
			}
		}
	}

	function selectCard(arrow,var1,card)
	{
		for(i = 0; i < 3; i++)
		{
			if(!opts.getChildAt(i).selected)
			{
				opt = opts.getChildAt(i);
				opt.selected = true;

				arrows.scale.set(0);
				card.inputEnabled = false;

				if(card.move.type != 'walk')
					card.move.direction = arrow.direction;

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
				tile.empty = true;
				tile.z = 0;

				tile.animations.add('idle', [0], 10, false);
				tile.animations.add('selected', [1], 10, false);

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
			for(j = 0; j < tiles[i].length; j++)
			{
				tiles[i][j].animations.play('idle');
			}
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

					x = move.direction.x + hero.x;
					y = move.direction.y + hero.y;

					if(x <= 0) x = 1;
					if(x >  4) x = 4;

					if(y <= 0) y = 1;
					if(y >  4) y = 4;

					
					//hero.sprite.animations.play('walk');

					tile = tiles[x - 1][y - 1];
					if(!tile.empty)
					{
						x = hero.x;
						y = hero.y;
						tile = tiles[hero.x -1][hero.y -1];
					}
					else
					{
						tile.empty = false;
						tiles[hero.x - 1][hero.y - 1].empty = true;
					}
					hero.x = x;
					hero.y = y;

					game.add.tween(hero.sprite).to({z : x}, Phaser.Timer.SECOND * 1, Phaser.Easing.Linear.None,true);

					tween = game.add.tween(hero.sprite).to({x : tile.x, y : tile.y},Phaser.Timer.SECOND * 1,Phaser.Easing.Linear.None,true);
					tween.onComplete.add(executionMoves, this);
				break;
				case 'skill' :
					listTiles = _heros[move.name].skills[move.skill].tiles;
					for(i = 0; i < listTiles.length; i++)
					{
						tile = listTiles[i];

						a = tile.x;
						b = tile.y;

						if(move.direction == 'down')
						{
							aux = a;
							a = b;
							b = -aux;
						}
						else if(move.direction == 'up')
						{
							aux = a;
							a = -b;
							b = aux;
						}
						else if(move.direction == 'left')
						{
							a = -a;
							b = -b;
						}

						x = hero.x + a;
						y =	hero.y + b;

						if((x <= 0)||(x >  4)||(y <= 0)||(y >  4)) continue;
						

						tiles[x-1][y-1].animations.play('selected');

						if(hero1.x == x && hero1.y == y)
						{
							life1 = life1 - _heros[move.name].skills[move.skill].damage;
							if(life1 < 0) life1 = 0;
							damageHero('hero1', lifeBar1, life1);
						}

						if(hero2.x == x && hero2.y == y)
						{
							life2 = life2 - _heros[move.name].skills[move.skill].damage;
							if(life2 < 0) life2 = 0;
							damageHero('hero2', lifeBar2, life2);
						}
					}
					hero.sprite.animations.play('skill');
					if(life1 == 0 || life2 == 0)
						0;
					else
						game.time.events.add(Phaser.Timer.SECOND * 3, executionMoves, this);
				break;
			}
		}
	}

	function damageHero(hero, obj, dmg)
	{
		heros[hero].sprite.animations.play('damage');

		cropRect = new Phaser.Rectangle(0, 0, obj.width, obj.height);
		game.add.tween(cropRect).to( { width: obj.width * (dmg/100) }, Phaser.Timer.SECOND * 1,  Phaser.Easing.Linear.None, true);

		obj.crop(cropRect);
	}

	return {preload: preload, create: create, update: update};
};