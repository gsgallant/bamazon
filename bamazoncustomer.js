var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors');
var pad = require('pad');
var userItemId,userQty;

var con = mysql.createConnection({
     host     : 'localhost', //for now, this will always be localhost
     user     : 'root',  // this will be whatever user you use to connect to mysql
     password : 'Thew1zardof0z',  // this is the password for the 'user' above
     database : 'Bamazon'  // this is a database which you have on your install of mysql
});


con.connect(function (err) {
       if (err) {
           console.log(err);
       }
       //console.log('connected')
   });

var userInput = function(){
	
	console.log("\n\nPlease place your order? <No Entry => No Order>");
	prompt.start();
		
	prompt.get(['ItemId','qty'],function(err,result){
			if (err){throw err};
			if(result.ItemId){
				userItemId = result.ItemId;
				userQty = parseInt(result.qty);
				if (!userQty){
					console.log("\n\nQuantity 0 ordered. Thanks for visiting Bamazon!\n\n".bold.red);
					process.exit();}	
			
				con.query("SELECT * FROM Product WHERE ItemID="+ userItemId, function(err,rows){

						if (err) {
						           throw err;
						       }
						       
						       if (!rows[0]) {
						           
						           console.log("\n\nNo products found with that ID\n\n".bold.red);
						           process.exit();            
						           
						       }
						       var itemId = rows[0].ItemID;
						       var prodName = rows[0].ProdName;
						       var unitPrice = rows[0].Price;
						       var inStockQty = parseInt(rows[0].StockQuantity);
						       var totalLeftInStock = inStockQty - userQty;
					      	   var totalCost = (userQty * unitPrice).toFixed(2); 
						       // console.log("Unit price: "+unitPrice.toFixed(2));
						       // console.log("Qty in Stock: "+inStockQty);
						       // console.log("Total Left in stock: "+totalLeftInStock);
						       var processOrder = false;
						       if ((inStockQty>0) && (inStockQty < userQty)){
						       		console.log("\nInsufficient Quantity - We only have ".bold.red + inStockQty.toString().bold.black + " of the item left in stock\n\n".bold.red);
						       			}else if(inStockQty < 1){
						       				console.log("\nThis item is Out Of Stock\n\n".bold.red);
			   								}else{
			   									processOrder = true;
			   								}
								if (processOrder){
									
									process.stdout.write("\n\n"+pad(30,"Order Placed").bold.magenta);
									process.stdout.write(("\n"+pad(30,"------------")).bold.magenta);
									process.stdout.write(("\nItemID "+pad("Name",22)).bold.red);
							 		process.stdout.write((pad("Price",8)+pad("# Ordered",10)).bold.red);
									process.stdout.write(pad(30,"Total".bold.red));
									process.stdout.write(("\n==========================================================").bold.green); 
								
									//con.query("UPDATE Product SET StockQuantity="+totalLeftInStock+"WHERE ItemID="+itemId);
									con.query(
									  'UPDATE Product SET StockQuantity = ? Where ItemId = ?',
									  [totalLeftInStock, itemId],
									  function (err, result) {
									    if (err) throw err;

									    // console.log('Changed ' + result.changedRows + ' rows');
										    process.stdout.write("\n"+pad(pad(3,itemId),6));
										 	process.stdout.write(" "+pad(prodName,20));
										 	process.stdout.write(" "+pad(6,unitPrice.toFixed(2)));
										 	process.stdout.write(" "+pad(10,userQty.toString()));
										 	process.stdout.write(" "+pad(12,totalCost));

										 	console.log("\n\n");

										 	process.exit();





									  }
									);

								}else{process.exit();}
				




				})//closes query for WHERE ItemID=
			}else if(!result.item){
				process.exit()
			}

	})//closes prompt

}//closes var userInput




// var checkStockAgainstOrder = function(){
// console.log('checkStockAgainstOrder');
// }

var displayProducts = function(callback){
	con.query("SELECT * FROM Product", function(err,rows){

		if (err) {
		           return callback(err);
		       }
		       
		       if (rows.length == 0) {
		           var err = new Error();
		           err.message = "No products found";            
		           return callback(err);
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
			 	// console.log(price);
			 	// console.log(qty);
			 	process.stdout.write("\n"+pad(pad(3,itemId),6));
			 	process.stdout.write(" "+pad(prodName,20));
			 	process.stdout.write(" "+pad(6,price.toFixed(2)));
			 	process.stdout.write(" "+pad(10,qty.toString()));
			 }      
			 console.log();
			 callback();

	})
};

displayProducts(userInput);






