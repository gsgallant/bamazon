var prompt = require('prompt');

	prompt.start();
		
	prompt.get(['ItemId'],function(err,result){
			if (err){throw err};
			var ItemId = result.ItemId;
			console.log("-"+ItemId+"-",typeof ItemId, ItemId.length);
	});