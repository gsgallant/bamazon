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
	process.stdout.write(pad(70,"**Goodbye & Thank you for using Bamazon Manager Dashboard**\n\n\n").bold.red);
	process.exit();
};

var getUserChoice = function(callback){
	console.log("\n\n");
	process.stdout.write("\n"+pad(50,"Bamazon Manager Dashboard\n").bold.red);
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
				// process.stdout.write("** Choose 1 - 4 or hit <ENTER> for Exit **".bold.red);
				getUserChoice(function(userChoice){
						executeUserChoice(userChoice);
					});//closes call to getUserChoice
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
			process.stdout.write(("\nItemID "+pad("Name",22)).bold.green);
	 		process.stdout.write((pad("Price",8)+pad("# Available",10)).bold.green);
			process.stdout.write(("\n================================================").bold.red); 
			for(i=0;i<rows.length;++i){
			 	
			 	var itemId = rows[i].ItemID;
			 	var prodName = rows[i].ProdName;
		 		var price = rows[i].Price;
		 		var qty = rows[i].StockQuantity;
			 	process.stdout.write("\n"+pad(pad(3,itemId),6));
			 	process.stdout.write(" "+pad(prodName,20));
			 	process.stdout.write(" "+pad(6,price.toFixed(2)));
			 	process.stdout.write(" "+pad(10,qty.toString()));
			 }      
			 console.log();
			 callback();

	})
};

function viewLowInventory(callback){
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
			process.stdout.write(("\nItemID "+pad("Name",22)).bold.green);
	 		process.stdout.write((pad("Price",8)+pad("# Available",10)).bold.green);
			process.stdout.write(("\n================================================").bold.red); 
			for(i=0;i<rows.length;++i){
			 	
			 	var itemId = rows[i].ItemID;
			 	var prodName = rows[i].ProdName;
		 		var price = rows[i].Price;
		 		var qty = rows[i].StockQuantity;
			 	if (qty<5){
				 	process.stdout.write("\n"+pad(pad(3,itemId),6));
				 	process.stdout.write(" "+pad(prodName,20));
				 	process.stdout.write(" "+pad(6,price.toFixed(2)));
				 	process.stdout.write(" "+pad(10,qty.toString()));
			 	}
			 }      
			 console.log();
			 callback();

	})
};

function addToInventory(){
		viewProducts(function(){
		console.log("\nAdd additional Inventory to an Item".bold.red);
		prompt.start();
		prompt.get(['ItemId','qty'],function(err,result){
			if (err){throw err};
				
				if(result.ItemId && parseInt(result.ItemId)>0){
					userItemId = result.ItemId;
					userQty = parseInt(result.qty);
					if (!userQty){
						console.log("\n\nQuantity 0 added.\n\n".bold.red);
						
					
					}	

				}
		

		})
	})
	
};

function addNewProduct(){

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

getUserChoice(function(userChoice){

	executeUserChoice(userChoice);

});//closes anonymous callback inside call to getUserChoice




