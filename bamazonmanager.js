//Greg Gallant - HW12 - Bonus #1

var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors');
var pad = require('pad');
var userChoice;
var con = mysql.createConnection({
     host     : 'localhost', //for now, this will always be localhost
     user     : 'root',  // this will be whatever user you use to connect to mysql
     password : 'Thew1zardof0z',  // this is the password for the 'user' above
     database : 'Bamazon'  // this is a database which you have on your install of mysql
});
//===============
//connect to mysql database
con.connect(function (err) {
       if (err) {
           console.log(err);
       }
       // console.log('connected')
});//closes connection

function exitToTerminal(){
	console.log("\n");
	process.stdout.write(pad(70,"**Thank you for using Bamazon Manager Dashboard**\n\n\n").bold.red);
	process.exit();
};

var getUserChoice = function(callback){
	console.log("");
	process.stdout.write("\n"+pad(20,"Bamazon Manager Dashboard").bold.red);
	process.stdout.write("\n"+pad(21,"=========================\n").bold.red);
	process.stdout.write("\n"+pad(26,"Choose option (1 - 4) <ENTER> to Exit").bold.red);
	process.stdout.write("\n"+pad(5,"1) View Products for Sale").bold.magenta);
	process.stdout.write("\n"+pad(5,"2) View Low Inventory").bold.magenta);
	process.stdout.write("\n"+pad(5,"3) Add to Low Inventory").bold.magenta);
	process.stdout.write("\n"+pad(5,"4) Add New Product").bold.magenta);
	console.log("\n");
	prompt.start();
	prompt.get(['Choice'],function(err,result){
			
			if (err){
				throw err;
				console.log(err);
				process.exit();
			}
			var userChoice = parseInt(result.Choice);
			
			if(!result.Choice){return callback(0);};
			if (isNaN(userChoice) || userChoice < 1 || userChoice>4){
				console.log('\033c')//clear console
				process.stdout.write("** Choose 1 - 4 or hit <ENTER> for Exit **".bold.red);
				return(getUserChoice(function(userChoice){
						executeUserChoice(userChoice);
					}));//closes call to getUserChoice
			}else{
				return callback(userChoice);
			}
	})//closes prompt

}//closes getUserChoice

var viewProducts = function(callback){
	con.query("SELECT * FROM Product", function(err,rows){

		if (err) {
		           throw error;
		       }
		       
		       if (rows.length == 0) {
		           var err = new Error();
		           err.message = "No products found";            
		           return;
		       }
			process.stdout.write("\n\n"+pad(30,"Current Inventory").bold.red);
			process.stdout.write(("\n"+pad(30,"-----------------")).bold.red);
			process.stdout.write(("\nItemID "+pad("Name",21)).bold.green);
	 		process.stdout.write(pad("Dept".bold.green,7));
	 		process.stdout.write((pad(13,"Price")+pad(15,"# Available")).bold.green);
			process.stdout.write(("\n============================================================").bold.red); 
			for(i=0;i<rows.length;++i){
			 	
			 	var itemId = rows[i].ItemID;
			 	var prodName = rows[i].ProdName;
		 		var price = rows[i].Price;
		 		var qty = rows[i].StockQuantity;
			 	var dept = rows[i].DeptName;
			 	process.stdout.write("\n"+pad(pad(3,itemId),6));
			 	process.stdout.write(" "+pad(prodName,20));
			 	process.stdout.write(" "+pad(dept,10));
			 	process.stdout.write(" "+pad(6,price.toFixed(2)));
			 	process.stdout.write(" "+pad(10,qty.toString()));
			 }      
			 console.log();
			 return(callback());

	})
};

function viewLowInventory(callback){
	var foundLowInv = false;
	con.query("SELECT * FROM Product", function(err,rows){

		if (err) {
		           throw error;
		       }
		       
		       if (rows.length == 0) {
		           var err = new Error();
		           err.message = "No products found";            
		           return;
		       }
			process.stdout.write("\n\n"+pad(40,"Low Inventory (less than 5)").bold.red);
			process.stdout.write(("\n"+pad(40,"---------------------------")).bold.red);
			process.stdout.write(("\nItemID "+pad("Name",20)).bold.green);
	 		process.stdout.write(pad("Dept".bold.green,9));
	 		process.stdout.write((pad(13,"Price")+pad(15,"# Available")).bold.green);
			process.stdout.write(("\n============================================================\n").bold.red);
			for(i=0;i<rows.length;++i){
			 	
			 	var itemId = rows[i].ItemID;
			 	var prodName = rows[i].ProdName;
		 		var price = rows[i].Price;
		 		var qty = rows[i].StockQuantity;
			 	var dept = rows[i].DeptName;
			 	if (qty<5){
		 		foundLowInv = true;
			 	process.stdout.write(pad(pad(3,itemId),6));
			 	process.stdout.write(" "+pad(prodName,20));
			 	process.stdout.write(pad(dept,11));
			 	process.stdout.write(pad(6,price.toFixed(2)));
			 	process.stdout.write(pad(10,qty.toString()));
		 		console.log();
			 	}
			 }      
			 if(!foundLowInv){
			 	process.stdout.write(("No Low Inventory Items Found").bold.magenta);
			 }
			 console.log();
			 return(callback());

	})
};

function addToInventory(callback){
		
		viewProducts(function(){
			console.log("\nAdd additional Qty To An Item".bold.red);
			prompt.start();
			prompt.get(['ItemId','qty'],function(err,result){
				if (err){return callback(err)};
				
				if(!result.ItemId || parseInt(result.ItemId)<1){
					console.log("\n\nNo products found with that ID\n\n".bold.red);
					return callback();
				}
					userItemId = result.ItemId;
					userQty = parseInt(result.qty);
					
					if (!userQty){
						console.log("\n\nQuantity 0 added.\n\n".bold.red);
						return callback();
					}	

				
				con.query("SELECT * FROM Product WHERE ItemID="+ userItemId, function(err,rows){
								if (err) {
								           return callback(err);
								       }
								       if (!rows[0]) {
								           console.log("\n\nNo products found with that ID\n\n".bold.red);
								           return callback();
							           }     
		       		 			
		       		 			var itemId = rows[0].ItemID;
						       var prodName = rows[0].ProdName;
						       var unitPrice = rows[0].Price;
						       var inStockQty = parseInt(rows[0].StockQuantity);
						       var totalLeftInStock = inStockQty + userQty;
					      	   // var totalCost = (userQty * unitPrice).toFixed(2); 
						      		process.stdout.write("\n\n"+pad(35,"Qty Added To Inventory Item").bold.magenta);
									process.stdout.write(("\n"+pad(35,"---------------------------")).bold.magenta);
									process.stdout.write(("\nItemID "+pad("Name",22)).bold.red);
							 		process.stdout.write((pad("Price",8)+pad("# Added",10)).bold.red);
									process.stdout.write(pad(30,"# Available".bold.red));
									process.stdout.write(("\n==========================================================").bold.green); 

						      con.query(
									  'UPDATE Product SET StockQuantity = ? Where ItemId = ?',
									  [totalLeftInStock, itemId],
									  function (err, result) {
									    if (err) throw err;
										    process.stdout.write("\n"+pad(pad(3,itemId),6));
										 	process.stdout.write(" "+pad(prodName,20));
										 	process.stdout.write(" "+pad(6,unitPrice.toFixed(2)));
										 	process.stdout.write(" "+pad(10,userQty.toString()));
										 	process.stdout.write(" "+pad(10,totalLeftInStock.toString()));
										 	

										 	console.log("\n\n");

										 	return(callback());

									  }
									);
		       
		       })
	       })
		})
}

function addNewProduct(callback){
viewProducts(function(){
			console.log("\nAdd New Item to Inventory".bold.red);
			prompt.start();
			prompt.get(['Name','Dept','Price','qty'],function(err,result){
				if (err){return callback(err)};
				
				
					if (!result.qty || !result.Name){
						console.log("\n\nNo Item Added\n\n".bold.red);
						return callback();
					}	
								if(result.Price){
								var price = parseFloat(result.Price);
								}else{price = 0.00};
								if(result.qty){
									var qty = parseInt(result.qty);
								}else{qty = 0};
								
								var addProduct = {ProdName : result.Name, DeptName : result.Dept, Price : price, StockQuantity : qty }
				
				con.query('INSERT INTO Product SET ?', addProduct, function(err,res){
								if (err) {
								           console.log(err);
								           return callback(err);
								       }
								           
							            process.stdout.write("\n\n"+pad(35,"New Item Added To Inventory").bold.magenta);
										process.stdout.write(("\n"+pad(35,"---------------------------")).bold.magenta);
										process.stdout.write(("\nItemID "+pad("Name",21)).bold.green);
								 		process.stdout.write(pad("Dept".bold.green,7));
								 		process.stdout.write((pad(13,"Price")+pad(15,"# Available")).bold.green);
										process.stdout.write(("\n============================================================").bold.red);

										process.stdout.write("\n"+pad(pad(3,res.insertId),6));
									 	process.stdout.write(" "+pad(result.Name,20));
									 	process.stdout.write(" "+pad(result.Dept,10));
									 	process.stdout.write(" "+pad(6,price.toFixed(2)));
									 	process.stdout.write(" "+pad(10,qty.toString()));
										 	

										 	console.log("\n\n");
								           return(callback());
								          // viewProducts(callback);
							          
		       
		       })
	       })
		})
};

function executeUserChoice(switchToChoice){
		
	switch (switchToChoice){
			case 0 :
				exitToTerminal();
			case 1 :
				console.log('\033c')//clear console
				viewProducts(function(){
					getUserChoice(function(userChoice){
						executeUserChoice(userChoice);
					});//closes call to getUserChoice	
				})//closes call to viewProducts
				break;
			case 2 :
				console.log('\033c')//clear console
				viewLowInventory(function(){
					getUserChoice(function(userChoice){
						executeUserChoice(userChoice);
					});//closes call to getUserChoice	
				})//closes call to viewProducts
				break;
			case 3 :
				console.log('\033c')//clear console
				addToInventory(function(){
					getUserChoice(function(userChoice){
						executeUserChoice(userChoice);
					});//closes call to getUserChoice	
				})//closes call to viewProducts
				break;
			case 4:
				console.log('\033c')//clear console
				addNewProduct(function(){
					getUserChoice(function(userChoice){
						executeUserChoice(userChoice);
					});//closes call to getUserChoice	
				})//closes call to viewProducts
				break;
			default :
				console.log("ERROR");exitToTerminal();
		}


}//closes function executeUserChoice







//===============================================================

//begin application
console.log('\033c')//clear console

return(getUserChoice(function(userChoice){

	executeUserChoice(userChoice);

}));//closes anonymous callback inside call to getUserChoice




