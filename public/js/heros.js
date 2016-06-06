var _heros = (function()
{
	var archer =
	{
		skills	:
		[
			{
				tiles : 
				[
									  {x:-1,y:2},
							{x:0,y:1},{x:0,y:2},
									  {x:1,y:2}
				],
				damage : 20
			},
			{
				tiles : 
				[
					{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},
					{x:0,y:-1},			   {x:0,y:1},
					{x:1,y:-1}, {x:1,y:0},{x:1,y:1},
					
				],
				damage : 10
			},
			{
				tiles : 
				[
							  {x:0,y:1},
					{x:1,y:0},{x:1,y:1}
				],
				damage : 30
			},
			{
				tiles : 
				[
					{x:0,y:1},{x:0,y:2},{x:0,y:3}
				],
				damage : 50
			}
		]
	};

	return	{
				archer : archer
			}
})();