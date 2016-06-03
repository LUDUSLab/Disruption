var _user = (function ()
{
	var name = 'Player';

	function setName(newName)
	{
		name = newName;
	}

	return 	{
				name 	: name,
				setName : setName
			}
})();