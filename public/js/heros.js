var _heros = (function()
{
	var archer =
	{
		skills	:
		[
			{
				tiles : 
				[
					{x:2,y:1},
					{x:1,y:0},
					{x:2,y:0},
					{x:2,y:-1}
				],
				damage : 20
			},
			{
				tiles : 
				[
					{x:-1,y:1},
					{x:0,y:1},
					{x:1,y:1},
					{x:-1,y:0},
					{x:1,y:0},
					{x:-1,y:-1},
					{x:0,y:-1},
					{x:1,y:-1}
				],
				damage : 10
			},
			{
				tiles : 
				[
					{x:1,y:0},
					{x:0,y:-1},
					{x:1,y:-1}
				],
				damage : 30
			},
			{
				tiles : 
				[
					{x:1,y:0},
					{x:2,y:0},
					{x:3,y:0}
				],
				damage : 50
			}
		]
	};

	return	{
				archer : archer
			}
})();